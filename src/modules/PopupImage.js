import Popup from './Popup';

const popupImage = document.querySelector('.popup_image');
const popupImageContent = popupImage.querySelector('.popup__content-image');

export default class PopupImage extends Popup {
  constructor(open) {
    super(open);
    this.openPopup = this.openPopup.bind(this);
  }

  openPopup() {
    this.open(popupImage);
  }

  getImage(target) {
    const style = target.getAttribute('style');
    let imageSrc = style.match(/"(.*)"/gi)[0].replace(/"/gi, '');
    return imageSrc;
  }

  setImage(img) {
    popupImageContent.setAttribute('src', img);
  }
}