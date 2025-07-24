import './scss/styles.scss';
import { AppApi } from './components/api/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './data/products/ProductsData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/common/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IContactModal, IFormErrors, IOrderPostResponse, IPaymentModal, IProduct } from './types';
import { Product } from './components/views/product/Product';
import { OrdersData } from './data/orders/OrdersData';
import { Modal } from './components/common/Modal';
import { ProductPreview } from './components/views/product/ProductPreview';
import { Basket } from './components/views/basket/Basket';
import { BasketItem } from './components/views/basket/BasketItem';
import { PaymentForm } from './components/views/forms/PaymentForm';
import { ContactForm } from './components/views/forms/ContactForm';
import { FinishForm } from './components/views/modal/FinishForm';



export enum Event {
	DOM_LOADED = 'DOM:loaded',

	PRODUCTS_CHANGED = 'products:changed',
	PRODUCT_TO_CLICK = 'product:to-click',
	PRODUCT_GET_BY_ID = 'product:get-by-id',
	PRODUCTS_GET = 'products:get',
	PREVIEW_SET = 'preview:set',


	ORDER_OPEN = 'order:open',
	ORDER_RESET = 'order:reset',
	ORDER_PAYMENT_CHANGED = 'order:payment-changed',
	ORDER_CONTACT_CHANGED = 'order:contact-changed',
	BASKET_REMOVE = 'basket:remove',
	COUNTER_CHANGED = 'counter:changed',
	PAYMENT_VALIDITY = 'payment:validity',


	MODAL_OPENED = 'modal:opened',
	MODAL_CLOSED = 'modal:closed',

	PAYMENT_VALIDITY_RESULT = 'payment:validity-result',
	CONTACT_VALIDITY = 'contact:validity',
	CONTACT_VALIDITY_RESULT = 'contact:validity-result',
	ORDER_FINISHED = 'order:finished',
	MODAL_TO_PAYMENT = 'modal:to-payment',
	MODAL_TO_CONTACT = 'modal:to-contact',
	MODAL_TO_FINISH = 'modal:to-finish',

	ORDER_PRODUCT_CHANGE = 'order:product-change',
	CREATE_ORDER = 'order:create',
	MODAL_CLOSE ='modal:close',


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
const preview = new ProductPreview('card', cloneTemplate(cardPreviewTemplate), eventEmitter);
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


eventEmitter.on(Event.MODAL_OPENED, () => {
	page.locked = true;
});

eventEmitter.on(Event.MODAL_CLOSED, () => {
	page.locked = false;
});


eventEmitter.on(Event.MODAL_TO_PAYMENT, () => {
	modal.content = orderPayment.render();
});
eventEmitter.on(Event.MODAL_TO_CONTACT, () => {
	modal.content = orderContact.render();
});
eventEmitter.on(Event.MODAL_TO_FINISH, (data: IOrderPostResponse) => {
	modal.content = orderFinish.render({ totalPrice: data.total, id: data.id });
});

eventEmitter.on(Event.PAYMENT_VALIDITY, (data: IPaymentModal) => {
	orderModel.setPaymentData(data.payment, data.address);
	orderModel.validatePayment();
});

eventEmitter.on(Event.CONTACT_VALIDITY, (data: IContactModal) => {
	orderModel.setContactData(data.email, data.phone);
	orderModel.validateContact();
});


eventEmitter.on(Event.CONTACT_VALIDITY_RESULT, (errors: IFormErrors) => {
	if (Object.keys(errors).length > 0) {
		orderContact.showError(errors);
	} else {
		orderContact.clearErrors();
	}
});

eventEmitter.on(Event.PAYMENT_VALIDITY_RESULT, (errors: IFormErrors) => {
		if (Object.keys(errors).length > 0) {
			orderPayment.showError(errors);
		} else {
			orderPayment.clearErrors();
		}
	},
);


eventEmitter.on(Event.ORDER_FINISHED, () => {
	// modal.close();
	orderModel.resetOrder();
});

eventEmitter.on(Event.ORDER_FINISHED, () => {
	page.counter = 0;
});

eventEmitter.on(Event.ORDER_FINISHED, () => {
	orderPayment.clearForm();
});

eventEmitter.on(Event.ORDER_FINISHED, () => {
	orderContact.clearForm();
});

eventEmitter.on(Event.ORDER_PRODUCT_CHANGE, (data: { id: string }) => {
	const isOrdered = orderModel.isInOrder(data.id);
	if (isOrdered) {
		orderModel.removeItemFromOrder(data.id);
	} else {
		productModel.getById(data.id).then(
			result =>
				orderModel.addItemToOrder(result),
		);
	}
	preview.isOrdered = !isOrdered;

});

eventEmitter.on(Event.CREATE_ORDER, () => {
	api.createOrder({
		payment: orderModel.payment, // PaymentMethod enum используется напрямую
		email: orderModel.email,
		phone: orderModel.phone,
		address: orderModel.address,
		total: orderModel.getTotal(),
		items: orderModel.items.map(item => item.id),
	})
		.then(result => {
			console.log('Заказ создан:', result);
			eventEmitter.emit(Event.MODAL_TO_FINISH, result);
		})
		.catch(error => {
			console.error('Ошибка создания заказа:', error);
			modal.close();
		})
		.finally( () => {
			eventEmitter.emit(Event.ORDER_FINISHED);

		});
});


eventEmitter.on(Event.MODAL_CLOSE, () => {
	modal.close();
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












