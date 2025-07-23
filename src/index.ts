import './scss/styles.scss';
import { AppApi } from './components/api/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './data/products/ProductsData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/common/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IContactModal, IPaymentModal, IProduct } from './types';
import { Product } from './components/views/product/Product';
import { OrdersData } from './data/orders/OrdersData';
import { Modal } from './components/common/Modal';
import { ProductPreview } from './components/views/product/ProductPreview';
import { Basket } from './components/views/basket/Basket';
import { BasketItem } from './components/views/basket/BasketItem';
import { PaymentForm } from './components/views/forms/PaymentForm';
import { ContactForm } from './components/views/forms/ContactForm';
import { Component } from './components/base/Component';
import { FinishForm } from './components/views/modal/FinishForm';
import { data } from 'autoprefixer';


export enum Event {
	DOM_LOADED = 'DOM:loaded',

	PRODUCTS_CHANGED = 'products:changed',
	PRODUCT_TO_CLICK = 'product:to-click',
	PRODUCT_GET_BY_ID = 'product:get-by-id',
	PRODUCTS_GET = 'products:get',
	PREVIEW_SET = 'preview:set',
	ORDER_ADD_PRODUCT = 'order:add-product',

	ORDER_OPEN = 'order:open',
	ORDER_RESET = 'order:reset',
	ORDER_PAYMENT_CHANGED = 'order:payment-changed',
	ORDER_CONTACT_CHANGED = 'order:contact-changed',
	BASKET_REMOVE = 'basket:remove',
	COUNTER_CHANGED = 'counter:changed',
	PAYMENT_VALIDITY = 'payment:validity',


	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
	ORDER_REMOVE_PRODUCT = 'order:remove-product',
	PAYMENT_VALIDITY_RESULT = 'payment:validity-result',
	CONTACT_VALIDITY = 'contact:validity',
	CONTACT_VALIDITY_RESULT = 'contact:validity-result',
	ORDER_FINISHED = 'order:finished',
	MODAL_TO_PAYMENT = 'modal:to-payment',
	MODAL_TO_CONTACT = 'modal:to-contact',
	MODAL_TO_FINISH = 'modal:to-finish',


}

const eventEmitter = new EventEmitter();


document.addEventListener('DOMContentLoaded', function() {
	eventEmitter.emit(Event.DOM_LOADED);
});


const api = new AppApi(API_URL, CDN_URL);
const productModel = new ProductsData(eventEmitter);
const orderModel = new OrdersData(eventEmitter);


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderFinishTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmitter);
const basket = new Basket('basket', cloneTemplate(basketTemplate), eventEmitter);
const orderPayment = new PaymentForm(cloneTemplate(orderTemplate), eventEmitter);
const orderContact = new ContactForm(cloneTemplate(contactTemplate), eventEmitter);
const orderFinish = new FinishForm(cloneTemplate(orderFinishTemplate), eventEmitter);


eventEmitter.on(Event.DOM_LOADED, () => {
	api.getProducts()
		.then(products => productModel.setProducts(products))
		.catch(console.error);
});


eventEmitter.on(Event.PRODUCTS_CHANGED, (products: IProduct[]) => {
		const productElements = products.map(product => {
			const productElement = new Product('card', cloneTemplate(cardCatalogTemplate), eventEmitter);
			return productElement.render(product);

		});
		page.gallery = productElements;
	},
);

eventEmitter.on(Event.PRODUCT_TO_CLICK, (el: { id: string }) => {
	productModel.setPreview(el.id);
});

eventEmitter.on(Event.PREVIEW_SET, (product: IProduct) => {
	const preview = new ProductPreview('card', cloneTemplate(cardPreviewTemplate), eventEmitter);
	modal.content = preview.render({ ...product, isOrdered: orderModel.isInOrder(product.id) });
	modal.open();
});

eventEmitter.on(Event.ORDER_OPEN, () => {
	const items = orderModel.items.map((item, index) => {
		const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), eventEmitter);
		return basketItem.render({ ...item, index: index + 1 });
	});

	modal.content = basket.render({
			items,
			total: orderModel.getTotal(),
		},
	);
	modal.open();
});

eventEmitter.on(Event.COUNTER_CHANGED, ({ count }: { count: number }) => {
	page.counter = count;
});

eventEmitter.on(Event.BASKET_REMOVE, (el: { id: string }) => {
	orderModel.removeItemFromOrder(el.id);
	const items = orderModel.items.map((item, index) => {
		const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), eventEmitter);
		return basketItem.render({ ...item, index: index + 1 });
	});

	modal.content = basket.render({
			items,
			total: orderModel.getTotal(),
		},
	);
});

eventEmitter.on(Event.ORDER_ADD_PRODUCT, (el: { id: string }) => {
	productModel.getById(el.id).then(product => {
			orderModel.addItemToOrder(product);
		},
	);
});

eventEmitter.on(Event.ORDER_REMOVE_PRODUCT, (el: { id: string }) => {
	productModel.getById(el.id).then(product => {
			orderModel.removeItemFromOrder(product.id);
		},
	);
});

eventEmitter.on(Event.MODAL_OPEN, () => {
	page.locked = true;
});

eventEmitter.on(Event.MODAL_CLOSE, () => {
	page.locked = false;
});


eventEmitter.on(Event.MODAL_TO_PAYMENT, () => {
	modal.content = orderPayment.render();
});
eventEmitter.on(Event.MODAL_TO_CONTACT, () => {
	modal.content = orderContact.render();
});
eventEmitter.on(Event.MODAL_TO_FINISH, () => {
	modal.content = orderFinish.render({totalPrice: orderModel.getTotal()});
});

eventEmitter.on(Event.PAYMENT_VALIDITY, (data: IPaymentModal) => {
	orderModel.setPaymentData(data.payment, data.address);
	const errors = orderModel.validatePayment();
	eventEmitter.emit(Event.PAYMENT_VALIDITY_RESULT, errors);
});

eventEmitter.on(Event.CONTACT_VALIDITY, (data: IContactModal) => {
	orderModel.setContactData(data.email, data.phone);
	const errors = orderModel.validateContact();
	eventEmitter.emit(Event.CONTACT_VALIDITY_RESULT, errors);
});

eventEmitter.on(Event.ORDER_FINISHED, () => {
// close modal and clear order
	modal.close();
	orderModel.resetOrder()
	// orderModel.clearOrder();
})


if (process.env.NODE_ENV === 'development') {
	eventEmitter.onAll(({ eventName, data }) => {

		if (data) {
			console.log(eventName, data);
		} else {
			console.log(eventName);
		}
	});
	(window as any).debug = {
		api,
		productModel,
		orderModel,
		page,
		modal,
		eventEmitter,
	};
}












