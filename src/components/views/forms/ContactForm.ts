import { Component } from '../../base/Component';
import { IContactModal, IFormErrors } from '../../../types';
import { IEvents } from '../../base/events';
import { Event } from '../../../index';

export class ContactForm extends Component<IContactModal> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	protected _submit: HTMLButtonElement;
	private _formErrors: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);

		const elements = container.elements;

		this._email = elements.namedItem('email') as HTMLInputElement;
		this._phone = elements.namedItem('phone') as HTMLInputElement;
		this._submit = this.getFromContainer<HTMLInputElement>('.button');
		this._formErrors = this.getFromContainer<HTMLInputElement>('.form__errors');

		this._email.addEventListener('input', () => {
			this.sendValidity();
		});

		this._phone.addEventListener('input', () => {
			this.sendValidity();
		});

		this.events.on(Event.CONTACT_VALIDITY_RESULT, (errors: IFormErrors) => {
				if(errors) {
					this.setDisabled(this._submit, true);
					this._formErrors.innerHTML = errors.email || errors.phone;
				} else {
					this.setDisabled(this._submit, false);
					this._formErrors.innerHTML = '';
				}
			},
		);

		this._submit.addEventListener('click', () => {
			this.events.emit(Event.MODAL_TO_FINISH);
		});

		this.events.on(Event.ORDER_FINISHED, () => {
			this.clearForm ();
		});
	}

	get email(): string {
		return this._email.value;
	}

	get phone(): string {
		return this._phone.value;
	}

	sendValidity() {
		this.events.emit(Event.CONTACT_VALIDITY, {
			email: this.email,
			phone: this.phone
		});
	}

	private clearForm() {
		this._email.value = '';
		this._phone.value= '';
		this.setDisabled(this._submit, true);
	}
}