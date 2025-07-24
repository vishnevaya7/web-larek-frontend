export interface IProduct {
	id: string;
	title: string;
	price: number | null;
	description: string;
	image: string;
	category: string;
}

export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: IProduct[];
}

export enum PaymentMethod {
	Online = 'online',
	Receive = 'receive'
}

export interface IOrderPostResponse {
	id: string;
	total: number;
}

export type IOrderPostRequest  = Omit<IOrder, 'items'> & { items: string[] };

export type IProductCard = Omit<IProduct, 'description' | 'id'>;
export type IProductModal = IProduct & { isOrdered: boolean };
export type IProductShort = Pick<IProduct, 'id' | 'title' | 'price'> & { index?: number };
export type IOrderModal = Pick<IOrder, 'total'> & { items: IProductShort[] }
export type IPaymentModal = Pick<IOrder, 'payment' | 'address'>;
export type IContactModal = Pick<IOrder, 'email' | 'phone'>;
// export type IPaymentModal = Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>;
export type IFormErrors = Partial<Pick<Record<keyof IOrder, string>, 'payment' | 'email' | 'phone' | 'address'>>;


export interface IProductsData {
	getAll(): Promise<IProduct[]>;

	getById(id: string): Promise<IProduct>;

	setPreview(id: string | null): void;
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

	validatePayment(): void;

	validateContact(): void;


	resetOrder(): void;
}