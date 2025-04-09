export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

export const TXT_CURRENCY = 'синапсов';
export const TXT_NO_PRICE = 'Бесценно';
export const TXT_DO_SHOPPING = 'Купить';
export const TXT_REJECT = 'Убрать';
export const TXT_TO_BASKET = 'В корзину';
export const TXT_BASKET_IS_EMPTY = 'Ваша корзина пуста';
export const TXT_ACTION =  'Списано';
export const TXT_ERROR_ORDER =  'Извините, заказ отклонен по следующей причине:';

export const settings = {
  cardCatalogTemplate: 'card-catalog',
  cardPreviewTemplate: 'card-preview',
  cardBasketTemplate: 'card-basket',
  basketTemplate: 'basket',
  orderTemplate: 'order',
  contactsTemplate: 'contacts',
  successTemplate: 'success',
  modalTemplate: 'modal',
  modalContainer: 'modal-container',

  classes: {
    headerBasketCounter: '.header__basket-counter',
    gallery: '.gallery',
    pageWrapper: '.page__wrapper',
    headerBasket: '.header__basket'
  },

  cardElements: {
    image: '.card__image',
    title: '.card__title',
    category: '.card__category',
    price: '.card__price'
  }
};

const skillCategories = {
  additional: 'дополнительное',
  button: 'кнопка',
  hard: 'хард-скил',
  soft: 'софт-скил', 
  other: 'другое',  
};

export const categories: Record<string, string> = {
  [skillCategories.additional]: 'additional',
  [skillCategories.button]: 'button',
  [skillCategories.hard]: 'hard',
  [skillCategories.soft]: 'soft',
  [skillCategories.other]: 'other',
};