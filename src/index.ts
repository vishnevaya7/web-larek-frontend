import './scss/styles.scss';
import { AppApi } from './components/api/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsData } from './data/products/ProductsData';
import { EventEmitter } from './components/base/events';



const eventEmitter = new EventEmitter();

if (process.env.NODE_ENV === 'development') {
	eventEmitter.onAll(({ eventName, data }) => {

		if (data){
			console.log(eventName, data);
		}
		else {
			console.log(eventName);
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	eventEmitter.emit('DOM:loaded');
});


const api = new AppApi(API_URL, CDN_URL);
const productModel = new ProductsData(eventEmitter);

eventEmitter.on('DOM:loaded', () => {
	api.getProducts().then(products => productModel.setProducts(products))
})