import Popup from './Popup';

const popupImage = document.querySelector('.popup_image');
const popupImageContent = popupImage.querySelector('.popup__content-image');
const avatarForm = document.forms.avatar;

/* PopupImage
 * openPopup отправка ноды на открытие popup
 * getImage получает изображение по ноде и отдаёт валидную ссылку
 * setImage устанавливает изображение в popup
 */
export default class PopupImage extends Popup {
  constructor(open) {
    super(open);
  }

  static openPopup() {
    PopupImage.open(popupImage);
  }

  static getImage(target) {
    const style = target.getAttribute('style');
    let imageSrc = style.match(/"(.*)"/gi)[0].replace(/"/gi, '');
    return imageSrc;
  }

  static setImage(attribute) {
    popupImageContent.setAttribute('src', attribute);
  }
}