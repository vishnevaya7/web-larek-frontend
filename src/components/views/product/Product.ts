import { Component } from '../../base/Component';
import { IProductCard } from '../../../types';
import { ensureElement, getCategoryKind } from '../../../utils/utils';
import { IEvents } from '../../base/events';
import { Event } from '../../../index';




export class Product extends Component<IProductCard>{
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, protected events: IEvents) {
		super(container);

		this._title = this.getFromContainer<HTMLElement>(`.${blockName}__title`);
		this._price = this.getFromContainer<HTMLElement>(`.${blockName}__price`);
		this._category = this.getFromContainer<HTMLElement>(`.${blockName}__category`);
		this._image = this.getFromContainer<HTMLImageElement>(`.${blockName}__image`);


		this.container.addEventListener('click', () => {
			this.events.emit(Event.PRODUCT_TO_CLICK, { id: this.id })
		});

	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title)
	}


	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(`${this.blockName}__category_${getCategoryKind(value)}`)
	}

	set price(value: string) {
		if(!value) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}

	}

	get price(): string {
		return this._price.textContent || '';
	}

}