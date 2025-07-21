import { Component } from '../../base/Component';
import { IProductModal } from '../../../types';
import { ensureElement, getCategoryKind } from '../../../utils/utils';
import { Event } from '../../../index';
import { IEvents } from '../../base/events';


export class ProductPreview extends Component<IProductModal>{
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;


	constructor(private blockName: string, container: HTMLElement, protected events: IEvents) {
		super(container);
		this._title = this.getFromContainer<HTMLElement>(`.${blockName}__title`);
		this._price = this.getFromContainer<HTMLElement>(`.${blockName}__price`);
		this._image = this.getFromContainer<HTMLImageElement>(`.${blockName}__image`);
		this._category = this.getFromContainer<HTMLElement>(`.${blockName}__category`);
		this._description = this.getFromContainer<HTMLElement>(`.${blockName}__text`);
		this._button = this.getFromContainer<HTMLButtonElement>(`.${blockName}__button`);


		this._button.addEventListener('click', () => {
			this.events.emit(Event.PRODUCT_PREVIEW_BUTTON_CLICK)
		});


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
		this._category.classList.add(`${this.blockName}__category_${getCategoryKind(value)}`)
	}
	set description(value: string) {
		this.setText(this._description, value);
	}


}