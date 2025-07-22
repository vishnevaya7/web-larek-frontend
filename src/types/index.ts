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
export type IProductModal = IProduct & {isOrdered: boolean};
export type IProductShort = Pick<IProduct, 'id' | 'title' | 'price'> & { index?: number };
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
	items: IProduct[];
	addItemToOrder(product: IProduct): void;
	removeItemFromOrder(id: string): void;
	isInOrder(id: string): boolean;
	getItemsCount(): number;
	getTotal(): number;

	payment: string | null;
	email: string | null;
	phone: string | null;
	address: string | null;

	setPaymentData(payment: string, address: string): void;
	setContactData(email: string, phone: string): void;

	validatePayment(): IFormErrors | null;
	validateContact(): IFormErrors | null;

	createOrder(): IOrder;
	resetOrder(): void;
}