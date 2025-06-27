// получение от API одного товара
import { ApiListResponse } from '../components/base/api';
import { IEvents } from '../components/base/events';

export interface IProduct {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: string;
}

// запрос на создание заказа
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: IProduct[];
}


export interface IProductsData {
	products: IProduct[];
	preview: string|null;
	getAll(): Promise<void>;
	getById(id: string): Promise<IProduct>;
	setPreview(id: string | null): void;
}

export interface IOrdersData {
	order: IOrder;
	orderModalStage: 'closed' | 'orders' | 'payment' | 'contact' | 'finish';
	addItemToOrder(product: IProduct): void;
	removeItemFromOrder(id: string): void;
	toPayOrder(): void;
	openCart(): void;
	closeCart(): void;
	checkValidation(data: IPaymentModal): boolean;
}

//API
export interface IOrderPostResponse {
	id: string;
	total: number;
}
export type IOrderPostRequest = Omit<IOrder, 'items'> & { items: string[] };


export interface IApiApi {
	getProducts(): Promise<ApiListResponse<IProduct>>;

	getProductById(id: string): Promise<IProduct>;

	createOrder(order: IOrderPostRequest): Promise<IOrderPostResponse>;
}

export interface IProductView {
	id: string;
	template: HTMLElement;
	events: IEvents;
	setData(productData: IProduct): void;
	render(): HTMLElement;
}

export enum ModalStage {
	Closed = 'closed',
	Orders = 'orders',
	Payment = 'payment',
	Contact = 'contact',
	Finish = 'finish'
}

export interface IOrderView {
	template: HTMLElement;
	events: IEvents;
	setData(order: IOrder): void;
	render(stage: ModalStage): HTMLElement;
	updateStage(stage: ModalStage): void;
}

export type IProductCard = Omit<IProduct, 'description'>;
export type IProductModal = IProduct;
export type IProductShort = Pick<IProduct, 'id' | 'title' | 'price'>;
export type IOrderModal = Pick<IOrder, 'total'> & { items: IProductShort[] };

export type IPaymentModal = Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>;





#### Класс Product
Отвечает за отображение карточки, задавая в карточке данные названия, изображения. Класс используется для отображения карточек на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:
	- setData(productData: IProduct): void - заполняет атрибуты элементов карточки продукта данными
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями


