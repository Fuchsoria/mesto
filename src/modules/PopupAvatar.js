import Popup from './Popup';
import Checks from './Checks';
import {
  GLOBAL
} from '../Global'

const popupAvatarContent = document.querySelector('.popup_avatar');
const avatarForm = document.forms.avatar;
const avatarInputLink = avatarForm.elements.link;

export default class PopupAvatar extends Popup {
  constructor(open, close, errorContainer) {
    super(open, close, errorContainer);
    this.openPopup = this.openPopup.bind(this);
    this.check = this.check.bind(this);
  }

  openPopup() {
    this.check();
    this.open(popupAvatarContent);
  }
  check() {
    const button = avatarForm.querySelector('.popup__button');
    const linkError = this.errorContainer(avatarInputLink);
    const linkLengthValidate = Checks.textField(avatarInputLink);
    const urlValidate = Checks.urlField(avatarInputLink);

    if (!linkLengthValidate.valid) {
      linkError.textContent = linkLengthValidate.error;
    } else if (!urlValidate.valid) {
      linkError.textContent = urlValidate.error;
    } else {
      linkError.textContent = '';
    }

    if (linkLengthValidate.valid && urlValidate.valid) {
      button.removeAttribute('disabled');
      button.classList.remove('popup__button_disabled');
    } else {
      button.setAttribute('disabled', true);
      button.classList.add('popup__button_disabled');
    }
  }

  afterSubmit(event) {
    event.preventDefault();
    const link = avatarForm.elements.link;
    const button = document.forms.avatar.querySelector('.popup__button');
    const avatarPromise = Promise.resolve();

    avatarPromise
      .then(() => {
        button.setAttribute('disabled', true);
        button.classList.add('popup__button_disabled');
        button.textContent = 'Saving...';
      })
      .then(() => GLOBAL.api.setAvatar(link.value))
      .then(() => GLOBAL.popupAvatar.close(event))
      .then(() => avatarForm.reset())
      .catch((err) => console.error(err))
      .finally(() => button.textContent = 'Save');
  }
}