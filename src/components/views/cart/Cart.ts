import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';
import { createElement, ensureElement, formatNumber } from '../../../utils/utils';
import { Event } from '../../../index';
import { IOrderModal } from '../../../types';
import { CartItem } from './CartItem';

export interface IBasket {
	items: HTMLElement[];
	total: number;
}

export class Cart extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(Event.ORDER_OPEN);
			});
		}

		this.items = [];

	}

	set items(items: CartItem[]) {
		if (items.length) {
			this._list.replaceChildren(...items.map(item => item.render()));
			this.setDisabled(this._button, false);
			this.setText(this._total,
				formatNumber(
					items.reduce((total, item) => total + Number(item.price), 0),
				)
			);

		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			}));
			this.setText(this._total, formatNumber(0));
			this.setDisabled(this._button, true);
		}
	}


}