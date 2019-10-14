import Popup from './Popup';
import Checks from './Checks';
import {
  API
} from '../index';

const popupAvatarContent = document.querySelector('.popup_avatar');
const avatarForm = document.forms.avatar;
const avatarInputLink = avatarForm.elements.link;

/* PopupAvatar
 * openPopup отправка ноды на открытие popup и препроверка полей
 * check проверка полей
 * afterSubmit действия после отправки формы
 */
export default class PopupAvatar extends Popup {
  constructor(open, close, errorContainer) {
    super(open, close, errorContainer);
  }

  static openPopup() {
    PopupAvatar.check();
    PopupAvatar.open(popupAvatarContent);
  }
  static check() {
    const button = avatarForm.querySelector('.popup__button');
    const linkError = PopupAvatar.errorContainer(avatarInputLink);
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

  static afterSubmit(event) {
    event.preventDefault();
    const link = avatarForm.elements.link;
    const button = document.forms.avatar.querySelector('.popup__button');
    const avatarPromise = Promise.resolve();

    avatarPromise
      .then(() => {
        button.setAttribute('disabled', true);
        button.classList.add('popup__button_disabled');
        button.textContent = 'Сохранение...';
      })
      .then(() => API.setAvatar(link.value))
      .then(() => PopupAvatar.close(event))
      .then(() => avatarForm.reset())
      .catch((err) => console.error(err))
      .finally(() => button.textContent = 'Сохранить');
  }
}