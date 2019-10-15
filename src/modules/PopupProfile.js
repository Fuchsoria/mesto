import Popup from './Popup';
import Checks from './Checks';
import {
  GLOBAL
} from '../Global'

const popupProfileContent = document.querySelector('.popup_edit-profile');
const profileName = document.querySelector('.user-info__name');
const profileJob = document.querySelector('.user-info__job');
const profileForm = document.forms.profile;
const profileInputName = profileForm.elements.profileName;
const profileInputJob = profileForm.elements.profileJob;

/* PopupProfile
 * openPopup отправка ноды на открытие popup и препроверка полей
 * setInputs вставка текущих значений в поля ввода
 * update обновление текущих значений из полей ввода
 * check проверка полей
 * afterSubmit действия после отправки формы
 */
export default class PopupProfile extends Popup {
  constructor(open, close, errorContainer) {
    super(open, close, errorContainer);
    this.openPopup = this.openPopup.bind(this);
    this.check = this.check.bind(this);
    this.afterSubmit = this.afterSubmit.bind(this);
  }

  openPopup() {
    this.setInputs();
    this.check();
    this.open(popupProfileContent);
  }

  setInputs() {
    profileInputName.value = profileName.textContent;
    profileInputJob.value = profileJob.textContent;
  }

  update() {
    return GLOBAL.api.setProfileInfo(profileInputName.value, profileInputJob.value);
  }

  check() {
    const button = profileForm.querySelector('.popup__button');
    const nameError = this.errorContainer(profileInputName);
    const jobError = this.errorContainer(profileInputJob);
    const nameValidate = Checks.textField(profileInputName);
    const jobValidate = Checks.textField(profileInputJob);

    if (!nameValidate.valid) {
      nameError.textContent = nameValidate.error;
    } else {
      nameError.textContent = '';
    }

    if (!jobValidate.valid) {
      jobError.textContent = jobValidate.error;
    } else {
      jobError.textContent = '';
    }

    if (nameValidate.valid && jobValidate.valid) {
      button.removeAttribute('disabled');
      button.classList.remove('popup__button_disabled');
    } else {
      button.setAttribute('disabled', true);
      button.classList.add('popup__button_disabled');
    }
  }

  afterSubmit(event) {
    event.preventDefault();
    const button = document.forms.profile.querySelector('.popup__button');
    const profilePromise = Promise.resolve();

    profilePromise
      .then(() => {
        button.setAttribute('disabled', true);
        button.classList.add('popup__button_disabled');
        button.textContent = 'Сохранение...';
      })
      .then(() => this.update())
      .then(() => this.close(event))
      .catch((err) => console.error(err))
      .finally(() => button.textContent = 'Сохранить');
  }
}