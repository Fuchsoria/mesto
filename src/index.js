import "./pages/index.css";
import Api from './modules/Api';
import Card from './modules/Card';
import CardList from './modules/CardList';
import Popup from './modules/Popup';
import PopupGallery from './modules/PopupGallery';
import PopupProfile from './modules/PopupProfile';
import PopupImage from './modules/PopupImage';
import PopupAvatar from './modules/PopupAvatar';

'use strict';

// Формы, инпуты и прочие элементы
const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort3' : 'https://praktikum.tk/cohort3';
const placesList = document.querySelector('.places-list');
const popupGalleryButton = document.querySelector('.user-info__button');
const popupProfileButton = document.querySelector('.button_edit');
const galleryForm = document.forms.new;
const profileForm = document.forms.profile;
const popupAvatarButton = document.querySelector('.user-info__photo');
const avatarForm = document.forms.avatar;
let ownerId, cardList;

const API = new Api({
  baseUrl: serverUrl,
  headers: {
    authorization: '705beead-7a33-410d-b927-b7a384dd6432',
    'Content-Type': 'application/json'
  }
});

// Обработчики
const handlers = {
  // Добавление обработчика кнопки закрытия popup
  addPopupClose(popupNode) {
    const closeButton = popupNode.querySelector('.popup__close');
    closeButton.addEventListener('click', Popup.close);
  },
  // Удаление обработчика кнопки закрытия popup
  removePopupClose(popupNode) {
    const closeButton = popupNode.querySelector('.popup__close');
    closeButton.removeEventListener('click', Popup.close);
  },
  // Обработчик лайков
  likeHandler() {
    placesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('place-card__like-icon')) {
        Card.like(event);
      }
    });
  },
  // Добавление обработчиков формы галереи
  addGalleryHandlers() {
    galleryForm.addEventListener('submit', PopupGallery.afterSubmit);
    galleryForm.addEventListener('input', PopupGallery.check);
  },
  // Удаление обработчиков формы галереи
  removeGalleryHandlers() {
    galleryForm.removeEventListener('submit', PopupGallery.afterSubmit);
    galleryForm.removeEventListener('input', PopupGallery.check);
  },
  // Добавление обработчиков формы профиля
  addProfileHandlers() {
    profileForm.addEventListener('submit', PopupProfile.afterSubmit);
    profileForm.addEventListener('input', PopupProfile.check);
  },
  // Удаление обработчиков формы профиля
  removeProfileHandlers() {
    profileForm.removeEventListener('submit', PopupProfile.afterSubmit);
    profileForm.removeEventListener('input', PopupProfile.check);
  },
  // Добавление обработчиков формы профиля
  addAvatarHandlers() {
    avatarForm.addEventListener('submit', PopupAvatar.afterSubmit);
    avatarForm.addEventListener('input', PopupAvatar.check);
  },
  // Удаление обработчиков формы профиля
  removeAvatarHandlers() {
    avatarForm.removeEventListener('submit', PopupAvatar.afterSubmit);
    avatarForm.removeEventListener('input', PopupAvatar.check);
  },
  // Обработчик для удаления карточки из DOM и API
  removeHandler() {
    placesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('place-card__delete-icon')) {
        const placeCard = event.target.closest('.place-card');
        const removePromise = new Promise((resolve, reject) => {
          if (window.confirm('Удалить карточку?')) {
            resolve();
          } else {
            reject();
          }
        });

        removePromise
          .then(() => Card.remove(event))
          .then(() => placeCard.remove())
          .catch(err => console.error(err));
      }
    });
  },
  // Обработчик открытия изображения и задачи ему src изображения
  imageOpenHandler() {
    placesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('place-card__image')) {
        const attribute = PopupImage.getImage(event.target);
        PopupImage.setImage(attribute);
        PopupImage.openPopup();
      }
    });
  },
  // Стартовые обработчики
  start() {
    popupGalleryButton.addEventListener('click', PopupGallery.openPopup);
    popupProfileButton.addEventListener('click', PopupProfile.openPopup);
    popupAvatarButton.addEventListener('click', PopupAvatar.openPopup);

    this.likeHandler();
    this.removeHandler();
    this.imageOpenHandler();
  }
};

// Старт приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const startPromise = Promise.resolve();

  startPromise
    .then(() => API.getProfileInfo().then(result => ownerId = result._id))
    .then(() => API.getAvatar())
    .then(() => cardList = new CardList(placesList))
    .then(() => API.getInitialCards())
    .then(() => handlers.start())
    .catch(err => console.error(err));
});

export {
  ownerId,
  cardList,
  handlers,
  API
};