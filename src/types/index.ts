export interface IProduct {
	id: string
	title: string
	price: number | null
	description: string
	image: string
	category: string
}

export interface IOrder {
	payment: string
	email: string
	phone: string
	address: string
	total: number
	items: IProduct[]
}

export interface IOrderPostResponse {
	id: string
	total: number
	items: IProduct[]
}

export type IProductCard = Omit<IProduct, 'description' | 'id'>;
export type IProductModal = IProduct;
export type IProductShort = Pick<IProduct, 'id' | 'title' | 'price'> ;
export type IOrderModal = Pick<IOrder, 'total'> & { items: IProductShort[] }
export type IPaymentModal = Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>;
export type IFormErrors = Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>>;


export interface IProductsData {
	getAll(): Promise<IProduct[]>;
	getById(id: string): Promise<IProduct>;
	setPreview(id: string | null): void;
}

export enum ModalStage {
	Closed = 'closed',
	Orders = 'orders',
	Payment = 'payment',
	Contact = 'contact',
	Finish = 'finish'
}

export interface IOrdersData {
	addItemToOrder(product: IProduct): void;
	removeItemFromOrder(id: string): void;
	toPayOrder(payment: string, address: string): void;
	getTotal(): number;
	checkValidation(data: IPaymentModal): IFormErrors | null;
}