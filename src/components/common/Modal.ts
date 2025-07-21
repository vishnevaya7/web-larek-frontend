import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { Event } from '../../index';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = this.getFromContainer<HTMLButtonElement>('.modal__close');
		this._content = this.getFromContainer<HTMLElement>('.modal__content');

		this._closeButton.addEventListener('click', this.close.bind(this));

		this.container.addEventListener('click', this.close.bind(this));

		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit(Event.MODAL_OPEN);
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}