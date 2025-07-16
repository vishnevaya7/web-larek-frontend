import { IProductShort } from '../../../types';
import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';

export class CartItem extends Component<IProductShort> {

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
	}

	get price():number {
		return this.price
	}
}
