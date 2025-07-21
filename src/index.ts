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


export enum Event {
	DOM_LOADED = 'DOM:loaded',

	PRODUCTS_CHANGED = 'products:changed',
	PRODUCT_TO_CLICK = 'product:to-click',
	PRODUCT_GET_BY_ID = 'product:get-by-id',
	PRODUCTS_GET = 'products:get',
	PREVIEW_SET = 'preview:set',
	PRODUCT_SELECTED = 'product:select',
	PRODUCT_PREVIEW_BUTTON_CLICK = 'product:preview-button-click',

	ORDER_OPEN = 'basket:order',
	ORDER_CHANGE = 'order:items-changed',
	ORDER_RESET = 'order:reset',
	ORDER_PAYMENT_CHANGED = 'order:payment-changed',
	ORDER_CONTACT_CHANGED = 'order:contact-changed',
	BASKET_REMOVE = 'basket:remove',


	MODAL_OPEN = 'modal:open',



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
const orderModel = new OrdersData(eventEmitter);




const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const page = new Page(document.body, eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmitter);


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

eventEmitter.on(Event.PREVIEW_SET, (product:IProduct) => {
	const preview = new ProductPreview('card', cloneTemplate(cardPreviewTemplate), eventEmitter);
	preview.render(product);
	modal.content = preview.render();
	modal.open();
});

// eventEmitter.on(Event.MODAL_CLOSE, () => {
// 	modal.close();
// })
(window as any).debug = {
	api,


	page,
	modal,

	eventEmitter
};












