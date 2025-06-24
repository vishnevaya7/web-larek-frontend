// получение от API одного товара
export interface Product {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: string;
}

// запрос на создание заказа
export interface Order {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: Product[];
}