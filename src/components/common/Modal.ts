import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Event } from '../../index';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.close();
		});

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
		this.events.emit(Event.MODAL_CLOSE);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}