import { IProductShort } from '../../../types';
import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';
import { Event } from '../../../index';

export class BasketItem extends Component<IProductShort> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _productPrice: number | null = null;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._index = this.getFromContainer<HTMLElement>('.basket__item-index');
		this._title = this.getFromContainer<HTMLElement>('.card__title');
		this._price = this.getFromContainer<HTMLElement>('.card__price');
		this._button = this.getFromContainer<HTMLButtonElement>('.basket__item-delete');

		this._button.addEventListener('click', () => {
			const id = this.container.dataset.id;
			if (id) {
				this.events.emit(Event.BASKET_REMOVE, { id });
			}
		});
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		this._productPrice = value;
		this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
	}

	get price(): number {
		return this._productPrice || 0;
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

}