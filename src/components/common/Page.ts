import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
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

	}
}
