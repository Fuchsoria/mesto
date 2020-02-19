const popupGalleryContent = document.querySelector('.popup_add-content');
const popupProfileContent = document.querySelector('.popup_edit-profile');
const popupImage = document.querySelector('.popup_image');
const popupAvatarContent = document.querySelector('.popup_avatar');

export default class Checks {
  static currentNode(event) {
    const popupAttribute = event.target.closest('.popup').getAttribute('popupname');
    const nodes = {
      'popupGalleryContent': popupGalleryContent,
      'popupProfileContent': popupProfileContent,
      'popupImageContent': popupImage,
      'popupAvatarContent': popupAvatarContent
    };

    return nodes[popupAttribute];
  }

  static textField(field) {
    const MESSAGE = {
      REQUIRED: 'This is a required field',
      LENGTH: 'Must be 2 to 300 characters'
    };
    const empty = field.value.length === 0;
    const checkLength = field.value.length < 2 || field.value.length > 300;

    return {
      valid: !empty && !checkLength,
      error: empty ? MESSAGE.REQUIRED : checkLength ? MESSAGE.LENGTH : '',
    };
  }

  static urlField(field) {
    const MESSAGE = {
      LINK: 'There should be a link'
    };
    const urlCheck = Checks.formUrl(field.value);

    return {
      valid: urlCheck,
      error: !urlCheck ? MESSAGE.LINK : ''
    };
  }

  static formUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
}