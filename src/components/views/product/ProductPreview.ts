import { Component } from '../../base/Component';
import { IProductModal } from '../../../types';
import { ensureElement } from '../../../utils/utils';


interface ISuccessActions {
	onClick: () => void;
}

export class ProductPreview extends Component<IProductModal>{
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	// protected _id: string;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;


	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		// this._id = ensureElement<HTMLElement>('.card__id', container).textContent || '';
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		if (actions.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}

		if (actions.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		this.setDisabled(this._button, !value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${value}`;
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	// set id(value: string) {
	// 	this._id = value;
	// }
	//
	// get id(): string {
	// 	return this._id;
	// }
}