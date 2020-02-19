import {
  handlers
} from '../handlers';
import Checks from './Checks';

export default class Popup {
  open(popupNode) {
    const popupName = popupNode.getAttribute('popupname');
    popupNode.classList.add('popup_is-opened');
    handlers.addPopupClose(popupNode);

    if (popupName === 'popupGalleryContent') {
      handlers.addGalleryHandlers();
    } else if (popupName === 'popupProfileContent') {
      handlers.addProfileHandlers();
    } else if (popupName === 'popupAvatarContent') {
      handlers.addAvatarHandlers();
    }
  }

  close(event, popupNode = Checks.currentNode(event)) {
    const popupName = popupNode.getAttribute('popupname');
    popupNode.classList.remove('popup_is-opened');
    handlers.removePopupClose(popupNode);

    if (popupName === 'popupGalleryContent') {
      handlers.removeGalleryHandlers();
    } else if (popupName === 'popupProfileContent') {
      handlers.removeProfileHandlers();
    } else if (popupName === 'popupAvatarContent') {
      handlers.removeAvatarHandlers();
    }
  }

  errorContainer(target) {
    return target.closest('.label').querySelector('.input__error');
  }
}