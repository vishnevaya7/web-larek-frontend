import { Component } from '../../base/Component';
import { IEvents } from '../../base/events';
import { Event } from '../../../index';

export class FinishForm extends Component<any> {
	protected _totalPrice: HTMLElement;
	protected _button: HTMLButtonElement;


	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._totalPrice = this.getFromContainer<HTMLElement>('.order-success__description');
		this._button = this.getFromContainer<HTMLButtonElement>('.order-success__close');
		this._button.addEventListener('click', () => {
			this.events.emit(Event.ORDER_FINISHED);
		});

	}

	set totalPrice(value: number) {
		this._totalPrice.textContent = `Списано ${value.toString()} синапсов`;
	}

}

