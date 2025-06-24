import { GetProductListRes } from '../../types/dto/GetProductListRes';
import { GetProductRes } from '../../types/dto/GetProductRes';

export interface IProductApi {
	getProductList(): Promise<GetProductListRes>;
	getProductItem(id: string): Promise<GetProductRes>;
}