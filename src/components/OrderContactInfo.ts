import { IContactsInfo } from '../types';
import { Form } from './Form';
import { IEvents } from './base/events';

export class OrderContactInfo extends Form<IContactsInfo> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._email = this.container.querySelector('[name="email"]');
		this._phone = this.container.querySelector('[name="phone"]');

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`orderContactsInfo:submit`);
		});
	}

	protected onInputChange(field: keyof IContactsInfo, value: string) {
		this.events.emit('orderContactsInfo:change', {
			field,
			value,
		});
	}

	getEmail(): string {
		return this._email.value;
	}

	getPhone(): string {
		return this._phone.value;
	}
}
