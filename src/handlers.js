import Card from './modules/Card';
import Popup from './modules/Popup';
import PopupGallery from './modules/PopupGallery';
import PopupProfile from './modules/PopupProfile';
import PopupImage from './modules/PopupImage';
import PopupAvatar from './modules/PopupAvatar';

const placesList = document.querySelector('.places-list');
const popupGalleryButton = document.querySelector('.user-info__button');
const popupProfileButton = document.querySelector('.button_edit');
const galleryForm = document.forms.new;
const profileForm = document.forms.profile;
const popupAvatarButton = document.querySelector('.user-info__photo');
const avatarForm = document.forms.avatar;
const popup = new Popup();
const popupGallery = new PopupGallery();
const popupProfile = new PopupProfile();
const popupImage = new PopupImage();
const popupAvatar = new PopupAvatar();

const handlers = {
  addPopupClose(popupNode) {
    const closeButton = popupNode.querySelector('.popup__close');
    closeButton.addEventListener('click', popup.close);
  },
  removePopupClose(popupNode) {
    const closeButton = popupNode.querySelector('.popup__close');
    closeButton.removeEventListener('click', popup.close);
  },
  likeHandler() {
    placesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('place-card__like-icon')) {
        Card.like(event);
      }
    });
  },
  addGalleryHandlers() {
    galleryForm.addEventListener('submit', popupGallery.afterSubmit);
    galleryForm.addEventListener('input', popupGallery.check);
  },
  removeGalleryHandlers() {
    galleryForm.removeEventListener('submit', popupGallery.afterSubmit);
    galleryForm.removeEventListener('input', popupGallery.check);
  },
  addProfileHandlers() {
    profileForm.addEventListener('submit', popupProfile.afterSubmit);
    profileForm.addEventListener('input', popupProfile.check);
  },
  removeProfileHandlers() {
    profileForm.removeEventListener('submit', popupProfile.afterSubmit);
    profileForm.removeEventListener('input', popupProfile.check);
  },
  addAvatarHandlers() {
    avatarForm.addEventListener('submit', popupAvatar.afterSubmit);
    avatarForm.addEventListener('input', popupAvatar.check);
  },
  removeAvatarHandlers() {
    avatarForm.removeEventListener('submit', popupAvatar.afterSubmit);
    avatarForm.removeEventListener('input', popupAvatar.check);
  },
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
  imageOpenHandler() {
    placesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('place-card__image')) {
        const img = popupImage.getImage(event.target);
        popupImage.setImage(img);
        popupImage.openPopup();
      }
    });
  },
  start() {
    popupGalleryButton.addEventListener('click', popupGallery.openPopup);
    popupProfileButton.addEventListener('click', popupProfile.openPopup);
    popupAvatarButton.addEventListener('click', popupAvatar.openPopup);

    this.likeHandler();
    this.removeHandler();
    this.imageOpenHandler();
  }
};

export {
  handlers
};