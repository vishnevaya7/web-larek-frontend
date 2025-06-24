
import { GetProductListRes } from '../../../types/dto/GetProductListRes';
import { IProductApi } from '../IProductApi';
import { Api } from '../../base/api';
import { GetProductRes } from '../../../types/dto/GetProductRes';

class ProductApi implements IProductApi {
    private api: Api;
    constructor()  {
        this.api = new Api('http://localhost:3000');
    }
    getProductList(): Promise<GetProductListRes> {
        return this.api.get('/products') as Promise<GetProductListRes>
    }
    getProductItem(id: string): Promise<GetProductRes> {
        return this.api.get(`/products/${id}`) as Promise<GetProductRes>
    }
}