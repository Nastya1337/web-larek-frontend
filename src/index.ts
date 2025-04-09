import { AppData } from './components/AppData';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { BasketItem, Order } from './components/Order';
import { OrderContactInfo } from './components/OrderContactInfo';
import { OrderPaymentInfo } from './components/OrderPaymentInfo';
import { Page } from './components/Page';
import { ProductAPI } from './components/ProductAPI';
import { Success } from './components/Success';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import {
	IContactsInfo,
	IOrder,
	IOrderFormError,
	IOrderResult,
	IPaymentInfo,
	IProduct,
	IProductNote,
} from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

const basketTemplate = ensureElement<HTMLTemplateElement>(
	`#${settings.basketTemplate}`
);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(
	`#${settings.cardCatalogTemplate}`
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
	`#${settings.cardPreviewTemplate}`
);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(
	`#${settings.cardBasketTemplate}`
);

const orderTemplate = ensureElement<HTMLTemplateElement>(
	`#${settings.orderTemplate}`
);

const contactsTemplate = ensureElement<HTMLTemplateElement>(
	`#${settings.contactsTemplate}`
);

const successTemplate = ensureElement<HTMLTemplateElement>(
	`#${settings.successTemplate}`
);

const events = new EventEmitter();
const appData = new AppData(events);
const api = new ProductAPI(CDN_URL, API_URL);
const page = new Page(document.body, events);

const modal = new Modal(
	ensureElement<HTMLElement>(`#${settings.modalContainer}`),
	events
);

const orderBasket = new Order(cloneTemplate(basketTemplate), events);
const orderPayment = new OrderPaymentInfo(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContactInfo(
	cloneTemplate(contactsTemplate),
	events
);

events.on('store:render', (store: IProduct[]) => {
	page.catalogue = store.map((item) => {
		const card = new Card(`card`, cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:click', item);
			},
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
	events.emit('basketCounter:render');
});

events.on('basketCounter:render', () => {
	page.counter = appData.order.notes.length;
});

events.on('card:click', (item: IProduct) => {
	appData.setProduct(item);
});

events.on('card:render', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		const existsInBasket = appData.existsProductInBasket(item);
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (existsInBasket) {
					events.emit('basket:remove', item);
				} else {
					events.emit('basket:add', item);
				}
			},
		});
		modal.render({
			content: card.render({
				category: item.category,
				title: item.title,
				image: item.image,
				price: item.price,
				description: item.description,
				reserved: existsInBasket,
			}),
		});
	};

	if (item) {
		showItem(item);
	} else {
		modal.close();
	}
});

events.on('basket:add', (value: IProductNote) => {
	appData.addProductToBasket(value);
	modal.close();
});

events.on('basket:remove', (value: IProductNote) => {
	appData.removeProductFromBasket(value);
	modal.close();
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:render', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			orderBasket.render({
				items: appData.order.notes.map((item, i) => {
					const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
						onClick: () => {
							events.emit('basket:remove', item);
							events.emit('basket:render');
						},
					});
					return card.render({
						id: item.id,
						title: item.title,
						price: item.price,
						index: i + 1,
					});
				}),
				total: appData.getTotalBasketPrice(),
			}),
		]),
	});
});

events.on('orderPaymentInfo:render', () => {
	modal.render({
		content: orderPayment.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appData.setOrderInfoField(
		'payment',
		orderPayment.getPayment() === 'online' ? 'online' : 'offline'
	);
	appData.setOrderInfoField('address', orderPayment.getAddress());
	orderPayment.valid = appData.validatePaymentInfo();
});

events.on(
	'orderPaymentInfo:change',
	(data: { field: keyof IOrderFormError; value: string }) => {
		appData.setOrderInfoField(data.field, data.value);
		orderPayment.valid = appData.validatePaymentInfo();
	}
);

events.on('orderPaymentInfo:submit', () => {
	events.emit('orderContact:render');
});

events.on('orderContact:render', () => {
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
	appData.setOrderInfoField('email', orderContacts.getEmail());
	appData.setOrderInfoField('phone', orderContacts.getPhone());
	orderContacts.valid = appData.validateContactsInfo();
});

events.on(
	'orderContactsInfo:change',
	(data: { field: keyof IOrderFormError; value: string }) => {
		appData.setOrderInfoField(data.field, data.value);
		orderContacts.valid = appData.validateContactsInfo();
	}
);

events.on('paymentFormErrors:change', (errors: Partial<IPaymentInfo>) => {
	const { payment, address } = errors;
	orderPayment.valid = !payment || !address;
	orderPayment.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<IContactsInfo>) => {
	const { email, phone } = errors;
	orderContacts.valid = !email || !phone;
	orderContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('orderContactsInfo:submit', () => {
	appData.pay();
});

events.on('order:pay', (value: IOrder) => {
	api
		.orderProduct(value)
		.then((order) => {
			events.emit('success:render', order);
		})
		.catch((err) => {
			console.error(err);
			events.emit('success:error', err);
		});
});

events.on('success:render', (value: IOrderResult) => {
	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => {
			modal.close();
		},
	});
	modal.render({
		content: success.render({
			price: value !== undefined ? value.total : 0,
		}),
	});
});

events.on('success:error', (value) => {
	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => {
			modal.close();
		},
	});
	modal.render({
		content: success.render({
			errorMessage: value as unknown as string,
		}),
	});
});

api
	.getProductList()
	.then(appData.setInitialStore.bind(appData))
	.catch((err) => {
		console.error(err);
	});
