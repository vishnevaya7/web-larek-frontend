import { Model } from '../../components/base/Model';
import { IOrdersData, IProduct, IOrder, IFormErrors, PaymentMethod } from '../../types';
import { EventEmitter } from '../../components/base/events';
import { Event } from '../../index';

export class OrdersData extends Model implements IOrdersData {
	protected _items: IProduct[] = [];
	protected _payment: PaymentMethod | null = null;
	protected _email: string | null = null;
	protected _phone: string | null = null;
	protected _address: string | null = null;

	constructor(events: EventEmitter) {
		super(events);
	}

	get items(): IProduct[] {
		return this._items;
	}

	get payment(): string | null {
		return this._payment;
	}

	get email(): string | null {
		return this._email;
	}

	get phone(): string | null {
		return this._phone;
	}

	get address(): string | null {
		return this._address;
	}

	addItemToOrder(product: IProduct): void {
		if (!this.isInOrder(product.id)) {
			this._items.push(product);
		}
		this.emitChanges(Event.COUNTER_CHANGED, { count: this._items.length });
	}

	removeItemFromOrder(id: string): void {
		const index = this._items.findIndex(item => item.id === id);
		if (index !== -1) {
			this._items.splice(index, 1);
		}
		this.emitChanges(Event.COUNTER_CHANGED, { count: this._items.length });
	}


	isInOrder(id: string): boolean {
		return this._items.some(item => item.id === id);
	}

	getItemsCount(): number {
		return this._items.length;
	}

	getTotal(): number {
		return this._items.reduce((total, item) => {
			return total + (item.price || 0);
		}, 0);
	}

	setPaymentData(payment: PaymentMethod, address: string): void {
		this._payment = payment;
		this._address = address;
		this.emitChanges(Event.ORDER_PAYMENT_CHANGED, {
			payment: this._payment,
			address: this._address,
		});
	}

	setContactData(email: string, phone: string): void {
		this._email = email;
		this._phone = phone;
		this.emitChanges(Event.ORDER_CONTACT_CHANGED, {
			email: this._email,
			phone: this._phone,
		});
	}


	validatePayment() {
		const errors: IFormErrors = {};

		if (!this._payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		if (!this._address) {
			errors.address = 'Необходимо указать адрес доставки';
		}

		this.emitChanges(Event.PAYMENT_VALIDITY_RESULT, errors);

	}

	validateContact() {
		const errors: IFormErrors = {};

		if (!this._email) {
			errors.email = 'Необходимо указать email';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) {
			errors.email = 'Некорректный формат email';
		}

		if (!this._phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!/^\+7\d{10}$/.test(this._phone.replace(/\s/g, ''))) {
			errors.phone = 'Некорректный формат телефона';
		}

		this.emitChanges(Event.CONTACT_VALIDITY_RESULT, errors);
	}

	createOrder(): IOrder {
		if (!this._payment || !this._email || !this._phone || !this._address) {
			throw new Error('Не все данные заказа заполнены');
		}

		if (this._items.length === 0) {
			throw new Error('Корзина пуста');
		}

		return {
			payment: this._payment,
			email: this._email,
			phone: this._phone,
			address: this._address,
			total: this.getTotal(),
			items: [...this._items],
		};
	}

	resetOrder(): void {
		this._items = [];
		this._payment = null;
		this._email = null;
		this._phone = null;
		this._address = null;
		this.emitChanges(Event.ORDER_RESET);
	}

}