import { IProductShort } from '../../../types';
import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';
import { ensureElement } from '../../../utils/utils';
import { Event } from '../../../index';

export interface ICartItemActions {
	onClick: (id: string) => void;
}

export class BasketItem extends Component<IProductShort> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _productPrice: number | null = null;

	constructor(container: HTMLElement, protected events: EventEmitter, actions?: ICartItemActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

		if (actions?.onClick) {
			this._button.addEventListener('click', () => {
				const id = this.container.dataset.id;
				if (id) {
					this.events.emit(Event.BASKET_REMOVE, { id });
					actions.onClick(id);
				}
			});
		}
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

	setIndex(index: number): void {
		this.setText(this._index, index.toString());
	}
}