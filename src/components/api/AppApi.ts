import { Api, ApiListResponse } from '../base/api';
import { IApiApi, IOrderPostResponse, IOrderPostRequest, IProduct } from '../../types';


export class AppApi implements IApiApi {
	private api: Api;

	constructor(baseUrl: string, options?: RequestInit) {
		this.api = new Api(baseUrl, options);
	}

	getProducts(): Promise<ApiListResponse<IProduct>> {
		return this.api.get('/products') as Promise<ApiListResponse<IProduct>>;
	}


	getProductById(id: string): Promise<IProduct> {
		return this.api.get(`/products/${id}`) as Promise<IProduct>;
	}

	createOrder(order: IOrderPostRequest): Promise<IOrderPostResponse> {
		return this.api.post('/orders', order, 'POST') as Promise<IOrderPostResponse>;
	}
}
