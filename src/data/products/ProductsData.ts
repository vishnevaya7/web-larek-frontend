import { Model } from '../../components/base/Model';
import { IProduct, IProductsData } from '../../types';
import { EventEmitter } from '../../components/base/events';


export class ProductsData extends Model implements IProductsData {
	private products: IProduct[];
	private preview: IProduct | undefined;

	constructor(events: EventEmitter) {

		super(events);
	}

	setProducts(products: IProduct[]) {
		this.emitChanges('products:set', products);
		this.products = products;
	}

	getAll(): Promise<IProduct[]> {
		this.emitChanges('products:get');
		return new Promise((resolve, reject) => {
			if (this.products) {
				resolve(this.products);
			} else {
				reject(new Error('Products not found'));
			}
		});
	}

	getById(id: string): Promise<IProduct> {
		this.emitChanges('products:getById');
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
			this.emitChanges('preview:set', res);
		});
	}
}