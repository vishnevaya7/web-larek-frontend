import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';
import { formatNumber} from '../../../utils/utils';
import { Event } from '../../../index';

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _emptyMessage: HTMLElement;

	constructor(private blockName: string, container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = this.getFromContainer<HTMLElement>(`.${blockName}__list`);
		this._total = this.getFromContainer<HTMLElement>(`.${blockName}__price`);
		this._button = this.getFromContainer<HTMLButtonElement>(`.${blockName}__button`);


		this._emptyMessage = document.createElement('p');
		this._emptyMessage.textContent = 'Корзина пуста';
		this._emptyMessage.className = `${blockName}__empty`;

		this._button.addEventListener('click', () => {
			this.events.emit(Event.BASKET_TO_CLICK, {});
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length === 0) {
			this._list.innerHTML = '';
			this._list.appendChild(this._emptyMessage);
			this.setDisabled(this._button, true);
		} else {
			this._list.innerHTML = '';
			this.setDisabled(this._button, false);
			this._list.replaceChildren(...items);

		}
	}

	set total(value: number) {
		this.setText(this._total, formatNumber(value) + ' синапсов');
	}

}