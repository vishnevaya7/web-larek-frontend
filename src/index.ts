import './scss/styles.scss';
import { AppApi } from './components/api/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './data/products/ProductsData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/common/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types';
import { Product } from './components/views/product/Product';
import { OrdersData } from './data/orders/OrdersData';
import { Modal } from './components/common/Modal';
import { ProductPreview } from './components/views/product/ProductPreview';
import { Basket } from './components/views/basket/Basket';
import { BasketItem } from './components/views/basket/BasketItem';


export enum Event {
	DOM_LOADED = 'DOM:loaded',

	PRODUCTS_CHANGED = 'products:changed',
	PRODUCT_TO_CLICK = 'product:to-click',
	PRODUCT_GET_BY_ID = 'product:get-by-id',
	PRODUCTS_GET = 'products:get',
	PREVIEW_SET = 'preview:set',
	ORDER_ADD_PRODUCT = 'order:add-product',
	BASKET_TO_CLICK = 'basket:to-click',

	ORDER_OPEN = 'order:open',
	ORDER_RESET = 'order:reset',
	ORDER_PAYMENT_CHANGED = 'order:payment-changed',
	ORDER_CONTACT_CHANGED = 'order:contact-changed',
	BASKET_REMOVE = 'basket:remove',


	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
	ORDER_REMOVE_PRODUCT = 'order:remove-product',


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

const page = new Page(document.body, eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmitter);
const basket = new Basket('basket', cloneTemplate(basketTemplate), eventEmitter);

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
	modal.content = preview.render({...product, isOrdered: orderModel.isInOrder(product.id)});
	modal.open();
});

eventEmitter.on(Event.ORDER_OPEN, () => {
	const items = orderModel.items.map((item, index) => {
		const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), eventEmitter);
		return basketItem.render({ ...item, index: index + 1 });
	});

	modal.content = basket.render({
			items,
			total: orderModel.getTotal()
		},
	);
	modal.open();
});

eventEmitter.on(Event.BASKET_REMOVE, (el: { id: string }) => {
	orderModel.removeItemFromOrder(el.id);
	const items = orderModel.items.map((item, index) => {
		const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), eventEmitter);
		return basketItem.render({ ...item, index: index + 1 });
	});

	modal.content = basket.render({
			items,
			total: orderModel.getTotal()
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












