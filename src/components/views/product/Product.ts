import { Component } from '../../base/Component';
import { IProductCard } from '../../../types';
import { ensureElement } from '../../../utils/utils';


interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProductCard>{
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: IProductActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = ensureElement<HTMLElement>(`.${blockName}__category_soft`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
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
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: string) {
		this.setText(this._price, value);
	}

	get price(): string {
		return this._price.textContent || '';
	}

}