import { IPage } from '../types';
import { settings } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalogue: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		const getElement = (selector: string) =>
			ensureElement<HTMLElement>(selector, this.container);

		this._counter = getElement(settings.classes.headerBasketCounter);
		this._catalogue = getElement(settings.classes.gallery);
		this._wrapper = getElement(settings.classes.pageWrapper);
		this._basket = getElement(settings.classes.headerBasket);

		this._basket.addEventListener('click', () =>
			this.events.emit('basket:render')
		);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalogue(items: HTMLElement[]) {
		this._catalogue.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
