import { PostOrderReq } from '../../../types/dto/PostOrderReq';
import { IOrderApi } from '../IOrderApi';
import { PostOrderRes } from '../../../types/dto/PostOrderRes';

class FakeOrderApi implements IOrderApi {
	postOrder(order: PostOrderReq): Promise<PostOrderRes> {
		return Promise.resolve({
			id: '123',
			total: order.total,
		});
	}
}