import './scss/styles.scss';
import { AppApi } from './components/api/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './data/products/ProductsData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/common/Page';
import { Modal } from './components/common/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductPreview } from './components/views/product/ProductPreview';
import { IProduct } from './types';
import { Product } from './components/views/product/Product';
import { Basket} from './components/views/basket/Basket';
import { BasketItem } from './components/views/basket/BasketItem';


export enum Event {
	DOM_LOADED = 'DOM:loaded',
	PRODUCTS_CHANGED = 'products:changed',
	ORDER_OPEN = 'basket:order',
	ORDER_CHANGE = 'order:items-changed',


	PRODUCT_ADDED_TO_CART = 'product:add-to-cart',
	PRODUCT_SELECTED = 'product:select',
	PREVIEW_SET = 'preview:set',
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
	PRODUCTS_GET = 'products:get',
	PRODUCT_GET_BY_ID = 'product:get-by-id',
	BASKET_REMOVE = 'basket:remove',
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


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const page = new Page(document.body, eventEmitter);
const modal = new Modal(ensureElement('#modal-container'), eventEmitter);


const basket = new Basket(cloneTemplate(basketTemplate), eventEmitter);


eventEmitter.on(Event.PRODUCT_SELECTED, (product: IProduct) => {

	const productPreview = new ProductPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			eventEmitter.emit(Event.PRODUCT_ADDED_TO_CART, product);
		},
	});

	modal.content = productPreview.render(product);
	modal.open();
});

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


eventEmitter.on(Event.BASKET_REMOVE, (el: { id: string }) => {
	const index = basket.items.findIndex(item => item.id === el.id);
	if (index !== -1) {
		// basketItems.splice(index, 1);
		// updateBasket();
		basket.items = basket.items.filter(item => item.id !== el.id);
	}

});

eventEmitter.on(Event.PRODUCT_ADDED_TO_CART, (product: IProduct) => {

	const existingItem = basket.items.find(item => item.id === product.id);
	if (existingItem) {
		return;
	}
	const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), eventEmitter);

	basketItem.id = product.id;
	basketItem.title = product.title;
	basketItem.price = product.price;

	basket.addItem(basketItem);
	page.counter = basket.items.length;

});



eventEmitter.on(Event.ORDER_OPEN, (order: IBasket) => {
	modal.content = basket.render(order);
	modal.open();
});

