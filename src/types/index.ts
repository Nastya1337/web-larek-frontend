export interface IPage {
	counter: number;
	catalogue: HTMLElement[];
	locked: boolean;
}

export interface IModal {
	content: HTMLElement;
}

export interface IForm {
	valid: boolean;
	errors: string[];
}

export interface IBasket {
	items: HTMLElement[];
	total: number;
	button: string[];
}

export interface IProductNote {
	id: string;
	title: string;
	price: number | null;
}

export interface IProductCard extends IProductNote {
	category: string;
	image: string;
}

export interface IProduct extends IProductCard {
	description: string;
}

export type payment = 'online' | 'offline';
export interface IPaymentInfo {
	payment: payment;
	address: string;
}

export interface IContactsInfo {
	email: string;
	phone: string;
}

export interface IOrder extends IPaymentInfo, IContactsInfo {
	id: string;
	total: number;
	notes: IProductNote[];
  items: string[];
}

export interface IOrderResult { 
  id: string;
  total: number;
}

export type PaymentFormErrors = {
	address?: string;
	payment?: string;
};

export type ContactsFormErrors = {
	email?: string;
	phone?: string;
};

export interface IOrderFormError
	extends PaymentFormErrors,
		ContactsFormErrors {}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
	price: number;
	errorMessage: string;
}

export interface IAppState {
	setInitialStore(items: IProduct[]): void;

	setProduct(item: IProductCard): void;

	getProduct(): IProduct | null;

	initialOrder(): IOrder;

	addProductToBasket(value: IProductNote): void;

	removeProductFromBasket(value: IProductNote): void;

	existsProductInBasket(value: IProductNote): boolean;

	getTotalBasketPrice(): number;

	setOrderInfoField(field: keyof IOrderFormError, value: string): void;

	setPaymentInfo(payment: payment, address: string): void;

	validatePaymentInfo(): boolean;

	setContactsInfo(email: string, phone: string): void;

	validateContactsInfo(): boolean;

	pay(): void;

	clearOrder(): void;

}
