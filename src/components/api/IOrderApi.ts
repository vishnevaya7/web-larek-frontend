import { PostOrderRes } from '../../types/dto/PostOrderRes';
import { PostOrderReq } from '../../types/dto/PostOrderReq';

export interface IOrderApi {
	postOrder(order: PostOrderReq): Promise<PostOrderRes>;
}