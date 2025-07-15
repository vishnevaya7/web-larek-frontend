import { Api, ApiListResponse } from '../base/api';
import { IOrder, IOrderPostResponse, IProduct } from '../../types';

export interface IApiApi {
	getProducts(): Promise<IProduct[]>;

	getProductById(id: string): Promise<IProduct>;

	createOrder(order: IOrder): Promise<IOrderPostResponse>;
}

export class AppApi extends Api implements IApiApi {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product')
			.then((data: ApiListResponse<IProduct>) => {
				if (!data || !data.items) {
					throw new Error('Invalid response format');
				}
				return data.items.map(item => ({
					...item,
					image: `${this.cdn}${item.image}`
				}));
			})
			.catch((error: Error) => {
				console.error('Error fetching products:', error);
				throw error;
			});
	}

	getProductById(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`) as Promise<IProduct>;
	}

	createOrder(order: IOrder): Promise<IOrderPostResponse> {
		return this.post('/order', order) as Promise<IOrderPostResponse>;
	}
}