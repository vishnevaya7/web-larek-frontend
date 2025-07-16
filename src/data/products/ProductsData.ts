import { Model } from '../../components/base/Model';
import { IProduct, IProductsData } from '../../types';
import { EventEmitter } from '../../components/base/events';
import { Event } from '../../index';


export class ProductsData extends Model implements IProductsData {
	private products: IProduct[];
	private preview: IProduct | undefined;

	constructor(events: EventEmitter) {

		super(events);
	}

	setProducts(products: IProduct[]) {
		this.products = products;
		this.emitChanges(Event.PRODUCTS_CHANGED, products);
	}

	getAll(): Promise<IProduct[]> {
		this.emitChanges(Event.PRODUCTS_GET);
		return new Promise((resolve, reject) => {
			if (this.products) {
				resolve(this.products);
			} else {
				reject(new Error('Products not found'));
			}
		});
	}

	getById(id: string): Promise<IProduct> {
		this.emitChanges(Event.PRODUCT_GET_BY_ID);
		return new Promise((resolve, reject) => {
			const product = this.products.find(el => el.id === id);
			if (!product) {
				reject(new Error('Product not found'));
			} else {
				resolve(product);
			}
		});
	}

	setPreview(id: string): void {
		this.getById(id).then(res => {
			this.preview = res;
			this.emitChanges(Event.PREVIEW_SET, res);
		});
	}
}