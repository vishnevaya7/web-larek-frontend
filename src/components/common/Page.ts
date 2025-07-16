import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Event } from '../../index';

interface IPage {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _gallery: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._gallery = ensureElement<HTMLElement>('.gallery');

		this._basket.addEventListener('click', () => {
			this.events.emit(Event.ORDER_OPEN);
		});

	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}

}
