import './scss/styles.scss';
import { AppApi } from './components/api/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './data/products/ProductsData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/common/Page';
import * as events from 'node:events';
import { Modal } from './components/common/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductPreview } from './components/views/product/ProductPreview';
import { IOrder, IOrderModal, IProduct } from './types';
import { Product } from './components/views/product/Product';
import { Cart, IBasket } from './components/views/cart/Cart';


export enum Event {
	DOM_LOADED = 'DOM:loaded',
	PRODUCTS_CHANGED = 'products:changed',
	PRODUCT_ADDED_TO_CART = 'product:add-to-cart',
	PRODUCT_REMOVED_FROM_CART = 'product:remove-from-cart',
	PRODUCT_SELECTED = 'product:select',
	PREVIEW_SET = 'preview:set',
	ORDER_OPEN = 'order:open',
	ORDER_CLOSE = 'order:close',
	ORDER_SUBMIT = 'order:submit',
	ORDER_SUCCESS = 'order:success',
	ORDER_ERROR = 'order:error',
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
	PRODUCTS_GET = 'products:get',
	PRODUCT_GET_BY_ID = 'product:get-by-id',
	BASKET_OPEN = 'basket:open',
}


const eventEmitter = new EventEmitter();

if (process.env.NODE_ENV === 'development') {
	eventEmitter.onAll(({ eventName, data }) => {

		if (data) {
			console.log(eventName, data);
		} else {
			console.log(eventName);
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	eventEmitter.emit(Event.DOM_LOADED);
});


const api = new AppApi(API_URL, CDN_URL);
const productModel = new ProductsData(eventEmitter);

eventEmitter.on(Event.DOM_LOADED, () => {
	api.getProducts().then(products => productModel.setProducts(products));
});

const page = new Page(document.body, eventEmitter);
const modal = new Modal(ensureElement('#modal-container'), eventEmitter);


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const productPreview = new ProductPreview(cloneTemplate(cardPreviewTemplate), {
	onClick: () => {
		eventEmitter.emit(Event.PRODUCT_ADDED_TO_CART, productPreview);
		modal.close();
	},
});

const card = new Cart(cloneTemplate(basketTemplate), eventEmitter);


eventEmitter.on(Event.DOM_LOADED, () => {
	api.getProducts()
		.then(products => productModel.setProducts(products))
		.catch(console.error);
});


eventEmitter.on(Event.PRODUCTS_CHANGED, (products: IProduct[]) => {
	const productElements = products.map(product => {
		const productElement = new Product('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => eventEmitter.emit(Event.PRODUCT_SELECTED, product),
		});
		return productElement.render(product);
	});

	page.gallery = productElements;
});

eventEmitter.on(Event.PRODUCT_SELECTED, (product: IProduct) => {

		modal.content = productPreview.render(product);

		modal.open();
	},
);

// eventEmitter.on(Event.ORDER_OPEN, (order: IBasket) => {
// 	modal.content = card.render(order);
// 	modal.open();
// });