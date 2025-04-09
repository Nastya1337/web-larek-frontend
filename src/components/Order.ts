import { IActions, IBasket } from '../types';
import { TXT_BASKET_IS_EMPTY, TXT_CURRENCY } from '../utils/constants';
import { createElement, ensureElement } from '../utils/utils';
import { Card } from './Card';
import { Component } from './base/component';
import { EventEmitter } from './base/events';

export class Order extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () => {
			events.emit('orderPaymentInfo:render');
		});

		this.items = [];
	}

	get items(): HTMLElement[] {
		return Array.from(this._list.children) as HTMLElement[];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: TXT_BASKET_IS_EMPTY,
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(
			this._total,
			(total !== null ? total : 0) + ' ' + TXT_CURRENCY
		);
	}
}

export type IBasketIndex = {
	index: number;
};

export class BasketItem extends Card<IBasketIndex> {
	protected _index: HTMLElement;
	protected _btn: HTMLButtonElement;
	constructor(container: HTMLElement, actions?: IActions) {
		super('card', container);

		this._index = container.querySelector('.basket__item-index');
		this._btn = container.querySelector('.basket__item-delete');
		this._btn.addEventListener('click', actions.onClick);
	}
	set index(value: number) {
		this.setText(this._index, value);
	}
}
