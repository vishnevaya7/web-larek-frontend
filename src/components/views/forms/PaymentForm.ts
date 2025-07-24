import { Component } from '../../base/Component';
import { IFormErrors, IPaymentModal, PaymentMethod } from '../../../types';
import { IEvents } from '../../base/events';
import { Event } from '../../../index';


export class PaymentForm extends Component<IPaymentModal> {
	protected _payment: HTMLElement;
	protected _address: HTMLInputElement;
	protected _online_button: HTMLButtonElement;
	protected _receive_button: HTMLButtonElement;
	protected _submit: HTMLButtonElement;
	protected _formErrors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._payment = this.getFromContainer<HTMLElement>('.order__buttons');
		this._address = this.getFromContainer<HTMLInputElement>('.form__input');
		this._submit = this.getFromContainer<HTMLInputElement>('.order__button');
		this._formErrors = this.getFromContainer<HTMLInputElement>('.form__errors');


		Array.from(this._payment.children)
			.map((el: HTMLButtonElement) => {
					const name = el.getAttribute('name');
					if (name === PaymentMethod.Online) {
						this._online_button = el;
					}
					if (name === PaymentMethod.Receive) {
						this._receive_button = el;
					}
					return el;
				},
			)
			.forEach((item) => {
				item.addEventListener('click', () => {
					this.payment = item.getAttribute('name') as PaymentMethod;
				});
			});

		this._address.addEventListener('input', () => {
			this.sendValidity();
		});
		this._submit.addEventListener('click', (evt) => {
			evt.preventDefault();
			events.emit(Event.MODAL_TO_CONTACT);
		});

	}

	clearErrors() {
		this.setDisabled(this._submit, false);
		this._formErrors.innerHTML = '';
	}

	showError(errors: IFormErrors) {
		this.setDisabled(this._submit, true);
		this._formErrors.innerHTML = errors.address || errors.payment;
	}

	clearForm() {
		this._online_button.classList.remove('button_alt-active');
		this._receive_button.classList.remove('button_alt-active');
		this._address.value = '';
		this.setDisabled(this._submit, true);
	}

	set payment(value: PaymentMethod) {
		if (value === PaymentMethod.Online) {
			this._online_button.classList.add('button_alt-active');
			this._receive_button.classList.remove('button_alt-active');
		}
		if (value === PaymentMethod.Receive) {
			this._receive_button.classList.add('button_alt-active');
			this._online_button.classList.remove('button_alt-active');
		}
		this.sendValidity();
	}

	get payment(): PaymentMethod | null {
		const activeButton = this.container.querySelector('.button_alt-active');
		return activeButton?.getAttribute('name') as PaymentMethod || null;
	}

	sendValidity() {
		this.events.emit(Event.PAYMENT_VALIDITY, {
			payment: this.payment,
			address: this.address,
		});
	}

	get address(): string {
		return this._address.value;
	}

}

