import { IActions, IProduct } from '../types';
import {
	TXT_CURRENCY,
	TXT_DO_SHOPPING,
	TXT_NO_PRICE,
	TXT_REJECT,
	TXT_TO_BASKET,
	categories,
} from '../utils/constants';
import { bem, ensureElement } from '../utils/utils';
import { Component } from './base/component';


export class Card<T extends IProduct | {}> extends Component<T | IProduct> {
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;

	protected _buttonModal?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);

		const getElement = (selector: string) =>
			ensureElement<HTMLElement>(selector, container);

		this._description = container.querySelector(`.${blockName}__text`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._title = getElement(`.${blockName}__title`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = getElement(`.${blockName}__price`);
		this._buttonModal = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._buttonModal) {
				this._buttonModal.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	public isEmpty(value: boolean) {
		return value
			? this.setText(this._buttonModal, TXT_TO_BASKET)
			: this.setText(this._buttonModal, TXT_DO_SHOPPING);
	}

	get id() {
		return this.container.dataset.id || '';
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get title() {
		return this._title.textContent || '';
	}
	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this._image.setAttribute('src', value);
	}

	set price(value: number) {
		if (value === null || isNaN(value)) {
			this.setText(this._price, TXT_NO_PRICE);
		} else {
			this.setText(this._price, value + ' ' + TXT_CURRENCY);
		}
	}

	set category(value: string) {
		const categoryClass = bem(
			this.blockName,
			'category',
			categories[value]
		).name;
		this.setText(this._category, value);
		this.toggleClass(this._category, categoryClass, true);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description
				?.querySelectorAll('.description-item')
				.forEach((element: HTMLElement, index: number) => {
					this.setText(element, value[index]);
				});
		} else {
			this.setText(this._description, value);
		}
	}

	set reserved(value: boolean) {
		if (value) {
			this.setText(this._buttonModal, TXT_REJECT);
		} else {
			this.setText(this._buttonModal, TXT_DO_SHOPPING);
		}
	}
}
