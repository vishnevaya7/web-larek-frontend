// import { Component } from '../../base/Component';
// import { EventEmitter } from '../../base/events';
// import { createElement, ensureElement, formatNumber, isEmpty } from '../../../utils/utils';
// import { Event } from '../../../index';
// import { BasketItem } from './BasketItem';
//
// export interface IBasket {
// 	items: HTMLElement[];
// 	total: number;
// }
//
// export class Basket extends Component<IBasket> {
// 	protected _list: HTMLElement;
// 	protected _total: HTMLElement;
// 	protected _button: HTMLElement;
//
// 	constructor(container: HTMLElement, protected events: EventEmitter) {
// 		super(container);
//
// 		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
// 		this._total = this.container.querySelector('.basket__price');
// 		this._button = this.container.querySelector('.basket__button');
//
// 		// if (this._button) {
// 		// 	this._button.addEventListener('click', () => {
// 		// 		events.emit(Event.ORDER_OPEN);
// 		// 	});
// 		// }
//
//
// 	}
//
// 	set items(items: HTMLElement[]) {
// 		this.items = items;
// 	}
//
// 	get items(): HTMLElement[] {
// 		return this.items
// 	}
// }

import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';
import {  formatNumber, cloneTemplate } from '../../../utils/utils';
import { IProduct } from '../../../types';
import { BasketItem } from './BasketItem';

export interface IBasketView {
	items: IProduct[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _emptyMessage: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = this.getFromContainer<HTMLElement>('.basket__list');
		this._total = this.getFromContainer<HTMLElement>('.basket__price');
		this._button = this.getFromContainer<HTMLButtonElement>('.basket__button');

		// Создаем элемент для сообщения о пустой корзине
		this._emptyMessage = document.createElement('li');
		this._emptyMessage.textContent = 'Корзина пуста';

		this._button.addEventListener('click', () => {
			this.events.emit('basket:order', {});
		});
	}

	set items(items: IProduct[]) {
		if (items.length === 0) {
			this._list.innerHTML = '';
			this._list.appendChild(this._emptyMessage);
			this.setDisabled(this._button, true);
		} else {
			this._list.innerHTML = '';
			this.setDisabled(this._button, false);

			items.forEach((item, index) => {
				const basketItemElement = this.createBasketItem(item, index + 1);
				this._list.appendChild(basketItemElement);
			});
		}
	}

	set total(value: number) {
		this.setText(this._total, formatNumber(value) + ' синапсов');
	}

	set isEmpty(value: boolean) {
		this.setDisabled(this._button, value);
	}

	protected createBasketItem(product: IProduct, index: number): HTMLElement {
		const template = this.getFromContainer<HTMLTemplateElement>('#card-basket');
		const basketItemElement = cloneTemplate(template);

		const basketItem = new BasketItem(basketItemElement, this.events);


		basketItem.id = product.id;
		basketItem.title = product.title;
		basketItem.price = product.price;


		const indexElement = this.getFromContainer<HTMLElement>('.basket__item-index');
		this.setText(indexElement, index.toString());

		return basketItemElement;
	}

	render(data: Partial<IBasketView>): HTMLElement {
		Object.assign(this, data);
		return this.container;
	}
}