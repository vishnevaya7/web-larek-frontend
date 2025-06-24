import { IOrderApi } from '../IOrderApi';
import { PostOrderReq } from '../../../types/dto/PostOrderReq';
import { PostOrderRes } from '../../../types/dto/PostOrderRes';
import { Api } from '../../base/api';

class OrderApi implements IOrderApi {
	private api: Api;

	constructor() {
		this.api = new Api('http://localhost:3000');
	}

	postOrder(order: PostOrderReq): Promise<PostOrderRes> {
		return this.api.post('/order', order) as Promise<PostOrderRes>;
	}
}