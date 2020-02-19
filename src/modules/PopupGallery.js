import Popup from './Popup';
import Checks from './Checks';
import {
  GLOBAL
} from '../Global';

const popupGalleryContent = document.querySelector('.popup_add-content');
const galleryForm = document.forms.new;
const galleryInputName = galleryForm.elements.name;
const galleryInputLink = galleryForm.elements.link;

export default class PopupGallery extends Popup {
  constructor(open, close, errorContainer) {
    super(open, close, errorContainer);
    this.openPopup = this.openPopup.bind(this);
    this.check = this.check.bind(this);
    this.afterSubmit = this.afterSubmit.bind(this);
  }

  openPopup() {
    this.check();
    this.open(popupGalleryContent);
  }
  check() {
    const button = galleryForm.querySelector('.popup__button');
    const nameError = this.errorContainer(galleryInputName);
    const linkError = this.errorContainer(galleryInputLink);
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

  afterSubmit(event) {
    event.preventDefault();
    const name = galleryForm.elements.name;
    const link = galleryForm.elements.link;
    const button = document.forms.new.querySelector('.popup__button');
    const galleryPromise = Promise.resolve();

    galleryPromise
      .then(() => {
        button.setAttribute('disabled', true);
        button.classList.add('popup__button_disabled');
        button.textContent = 'Saving...';
      })
      .then(() => GLOBAL.api.addCard(name.value, link.value))
      .then(() => this.close(event))
      .then(() => galleryForm.reset())
      .catch((err) => console.error(err))
      .finally(() => button.textContent = '+');
  }
}