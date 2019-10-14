import Popup from './Popup';
import Checks from './Checks';
import {
  API
} from '../index';

const popupGalleryContent = document.querySelector('.popup_add-content');
const galleryForm = document.forms.new;
const galleryInputName = galleryForm.elements.name;
const galleryInputLink = galleryForm.elements.link;

/* PopupGallery
 * openPopup отправка ноды на открытие popup и препроверка полей
 * check проверка полей
 * afterSubmit действия после отправки формы
 */
export default class PopupGallery extends Popup {
  constructor(open, close, errorContainer) {
    super(open, close, errorContainer);
  }

  static openPopup() {
    PopupGallery.check();
    PopupGallery.open(popupGalleryContent);
  }
  static check() {
    const button = galleryForm.querySelector('.popup__button');
    const nameError = PopupGallery.errorContainer(galleryInputName);
    const linkError = PopupGallery.errorContainer(galleryInputLink);
    const nameValidate = Checks.textField(galleryInputName);
    const linkLengthValidate = Checks.textField(galleryInputLink);
    const urlValidate = Checks.urlField(galleryInputLink);

    if (!nameValidate.valid) {
      nameError.textContent = nameValidate.error;
    } else {
      nameError.textContent = '';
    }

    if (!linkLengthValidate.valid) {
      linkError.textContent = linkLengthValidate.error;
    } else if (!urlValidate.valid) {
      linkError.textContent = urlValidate.error;
    } else {
      linkError.textContent = '';
    }

    if (nameValidate.valid && linkLengthValidate.valid && urlValidate.valid) {
      button.removeAttribute('disabled');
      button.classList.remove('popup__button_disabled');
    } else {
      button.setAttribute('disabled', true);
      button.classList.add('popup__button_disabled');
    }
  }

  static afterSubmit(event) {
    event.preventDefault();
    const name = galleryForm.elements.name;
    const link = galleryForm.elements.link;
    const button = document.forms.new.querySelector('.popup__button');
    const galleryPromise = Promise.resolve();

    galleryPromise
      .then(() => {
        button.setAttribute('disabled', true);
        button.classList.add('popup__button_disabled');
        button.textContent = 'Сохранение...';
      })
      .then(() => API.addCard(name.value, link.value))
      .then(() => PopupGallery.close(event))
      .then(() => galleryForm.reset())
      .catch((err) => console.error(err))
      .finally(() => button.textContent = '+');
  }
}