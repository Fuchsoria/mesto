(() => {
  'use strict';

  // Формы, инпуты и прочие элементы
  const cardTemplate = document.querySelector('#card-template');
  const placesList = document.querySelector('.places-list');
  const popupGalleryButton = document.querySelector('.user-info__button');
  const popupGalleryContent = document.querySelector('.popup_add-content');
  const popupProfileButton = document.querySelector('.button_edit');
  const popupProfileContent = document.querySelector('.popup_edit-profile');
  const profileName = document.querySelector('.user-info__name');
  const profileJob = document.querySelector('.user-info__job');
  const profilePhoto = document.querySelector('.user-info__photo');
  const galleryForm = document.forms.new;
  const galleryInputName = galleryForm.elements.name;
  const galleryInputLink = galleryForm.elements.link;
  const profileForm = document.forms.profile;
  const profileInputName = profileForm.elements.profileName;
  const profileInputJob = profileForm.elements.profileJob;
  const popupImage = document.querySelector('.popup_image');
  const popupImageContent = popupImage.querySelector('.popup__content-image');
  const popupAvatarButton = document.querySelector('.user-info__photo');
  const popupAvatarContent = document.querySelector('.popup_avatar');
  const avatarForm = document.forms.avatar;
  const avatarInputLink = avatarForm.elements.link;
  let ownerId, cardList;

  class Api {
    constructor(options) {
      this.baseUrl = options.baseUrl;
      this.headers = options.headers;
    }

    checkStatus(res) {
      return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
    }

    showError(err) {
      return console.error(err);
    }

    getInitialCards() {
      fetch(`${this.baseUrl}/cards`, {
          headers: this.headers
        })
        .then(this.checkStatus)
        .then((result) => cardList.renderCards(result))
        .catch(this.showError);
    }

    getProfileInfo() {
      return fetch(`${this.baseUrl}/users/me`, {
          headers: this.headers
        })
        .then(this.checkStatus)
        .then((result) => {
          profileName.textContent = result.name;
          profileJob.textContent = result.about;
          return result;
        })
        .catch(this.showError);
    }
    setProfileInfo(name, about) {
      return fetch(`${this.baseUrl}/users/me`, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            name,
            about
          })
        })
        .then(this.checkStatus)
        .then((result) => {
          profileName.textContent = result.name;
          profileJob.textContent = result.about;
        })
        .catch(this.showError);
    }
    getAvatar() {
      fetch(`${this.baseUrl}/users/me`, {
          headers: this.headers
        })
        .then(this.checkStatus)
        .then((result) => profilePhoto.style.backgroundImage = `url(${result.avatar})`)
        .catch(this.showError);
    }
    setAvatar(avatar) {
      return fetch(`${this.baseUrl}/users/me/avatar`, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            avatar
          })
        })
        .then(this.checkStatus)
        .then((result) => profilePhoto.style.backgroundImage = `url(${result.avatar})`)
        .catch(this.showError);
    }
    addCard(name, link) {
      return fetch(`${this.baseUrl}/cards`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            name,
            link
          })
        })
        .then(this.checkStatus)
        .then((result) => cardList.addCard({
          name: result.name,
          link: result.link,
          ownerId: result.owner._id,
          cardId: result._id
        }))
        .catch(this.showError);
    }
    removeCard(cardId) {
      fetch(`${this.baseUrl}/cards/${cardId}`, {
          method: 'DELETE',
          headers: this.headers,
          body: JSON.stringify({
            _id: cardId
          })
        })
        .then(this.checkStatus)
        .catch(this.showError);
    }
    addLike(cardId) {
      return fetch(`${this.baseUrl}/cards/like/${cardId}`, {
          method: 'PUT',
          headers: this.headers
        })
        .then(this.checkStatus)
        .then(result => result)
        .catch(this.showError);
    }
    removeLike(cardId) {
      return fetch(`${this.baseUrl}/cards/like/${cardId}`, {
          method: 'DELETE',
          headers: this.headers
        })
        .then(this.checkStatus)
        .then(result => result)
        .catch(this.showError);
    }
  }

  const API = new Api({
    baseUrl: 'http://95.216.175.5/cohort3',
    headers: {
      authorization: '705beead-7a33-410d-b927-b7a384dd6432',
      'Content-Type': 'application/json'
    }
  });

  /* Card
   * like изменяет состояние класса после нажатия и отправляет запрос на обновление на API сервер
   * remove удаляет карточку из API сервера
   * create создаёт элемент карточки и возвращает его
   */
  class Card {
    constructor(obj, container = placesList) {
      this.name = obj.name;
      this.link = obj.link;
      this.ownerId = obj.ownerId;
      this.cardId = obj.cardId;
      this.likes = obj.likes ? obj.likes : 0;
      this.isLiked = obj.isLiked;
      this.container = container;
      this.element = this.create();

      return this.element;
    }

    static like(event) {
      const card = event.target.closest('.place-card');
      const likeCount = card.querySelector('.place-card__like-count');
      const cardId = card.getAttribute('data-id');

      if (event.target.classList.contains('place-card__like-icon_liked')) {
        event.target.classList.remove('place-card__like-icon_liked');
        API.removeLike(cardId)
          .then(result => likeCount.textContent = result.likes.length);
      } else {
        event.target.classList.add('place-card__like-icon_liked');
        API.addLike(cardId)
          .then(result => likeCount.textContent = result.likes.length);
      }
    }

    static remove(event) {
      const card = event.target.closest('.place-card');
      const cardId = card.getAttribute('data-id');
      API.removeCard(cardId);
    }

    create() {
      const card = cardTemplate.content.cloneNode(true);
      const cardName = card.querySelector('.place-card__name');
      const cardImage = card.querySelector('.place-card__image');
      const cardLikes = card.querySelector('.place-card__like-count');
      const cardLike = card.querySelector('.place-card__like-icon');
      const cardElement = card.querySelector('.place-card');

      cardName.textContent = this.name;
      cardImage.style.backgroundImage = `url(${this.link})`;
      cardElement.setAttribute('data-owner', this.ownerId);
      cardElement.setAttribute('data-id', this.cardId);
      cardLikes.textContent = this.likes;

      if (this.ownerId === ownerId) {
        cardElement.classList.add('place-card_own');
      }

      if (this.isLiked) {
        cardLike.classList.add('place-card__like-icon_liked');
      }

      return card;
    }
  }

  /* CardList
   * addCard добавляет карточку в массив и отправляет в рендер
   * renderCards проходит по всем карточкам из массива и отправляет их в рендер
   */
  class CardList {
    constructor(container) {
      this.container = container;
    }

    addCard(obj) {
      this.render(obj);
    }

    render(obj) {
      const element = new Card(obj);
      this.container.appendChild(element);
    }

    renderCards(cards) {
      for (const {
          name,
          link,
          owner,
          _id,
          likes
        } of cards) {
        const isLiked = likes.some((user) => user._id === ownerId);
        this.render({
          name,
          link,
          ownerId: owner._id,
          cardId: _id,
          likes: likes.length,
          isLiked
        });
      }
    }
  }

  /* Checks
   * currentNode получает название popup по событию и возвращает ноду
   * textField проверяет поле ввода на корректность и возвращает результат и ошибку
   * urlField проверяет поле ввода на наличие ссылки и возвращает результат и ошибку
   * formUrl проверка является ли строка ссылкой
   */
  class Checks {
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
        REQUIRED: 'Это обязательное поле',
        LENGTH: 'Должно быть от 2 до 300 символов'
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
        LINK: 'Здесь должна быть ссылка'
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

  /* Popup
   * open открытие popup по ноде и запуск обработчиков
   * close закрытие popup по ноде и удаление обработчиков
   * errorContainer возвращает контейнер для отображения ошибок
   */
  class Popup {
    static open(popupNode) {
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

    static close(event, popupNode = Checks.currentNode(event)) {
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

    static errorContainer(target) {
      return target.closest('.label').querySelector('.input__error');
    }
  }

  /* PopupGallery
   * openPopup отправка ноды на открытие popup и препроверка полей
   * check проверка полей
   * afterSubmit действия после отправки формы
   */
  class PopupGallery extends Popup {
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

  /* PopupProfile
   * openPopup отправка ноды на открытие popup и препроверка полей
   * setInputs вставка текущих значений в поля ввода
   * update обновление текущих значений из полей ввода
   * check проверка полей
   * afterSubmit действия после отправки формы
   */
  class PopupProfile extends Popup {
    constructor(open, close, errorContainer) {
      super(open, close, errorContainer);
    }

    static openPopup() {
      PopupProfile.setInputs();
      PopupProfile.check();
      PopupProfile.open(popupProfileContent);
    }

    static setInputs() {
      profileInputName.value = profileName.textContent;
      profileInputJob.value = profileJob.textContent;
    }

    static update() {
      return API.setProfileInfo(profileInputName.value, profileInputJob.value);
    }

    static check() {
      const button = profileForm.querySelector('.popup__button');
      const nameError = PopupProfile.errorContainer(profileInputName);
      const jobError = PopupProfile.errorContainer(profileInputJob);
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

    static afterSubmit(event) {
      event.preventDefault();
      const button = document.forms.profile.querySelector('.popup__button');
      const profilePromise = Promise.resolve();

      profilePromise
        .then(() => {
          button.setAttribute('disabled', true);
          button.classList.add('popup__button_disabled');
          button.textContent = 'Сохранение...';
        })
        .then(() => PopupProfile.update())
        .then(() => PopupProfile.close(event))
        .catch((err) => console.error(err))
        .finally(() => button.textContent = 'Сохранить');
    }
  }

  /* PopupImage
   * openPopup отправка ноды на открытие popup
   * getImage получает изображение по ноде и отдаёт валидную ссылку
   * setImage устанавливает изображение в popup
   */
  class PopupImage extends Popup {
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

  /* PopupAvatar
   * openPopup отправка ноды на открытие popup и препроверка полей
   * check проверка полей
   * afterSubmit действия после отправки формы
   */
  class PopupAvatar extends Popup {
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

  // Обработчики
  const handlers = {
    // Добавление обработчика кнопки закрытия popup
    addPopupClose(popupNode) {
      const closeButton = popupNode.querySelector('.popup__close');
      closeButton.addEventListener('click', Popup.close);
    },
    // Удаление обработчика кнопки закрытия popup
    removePopupClose(popupNode) {
      const closeButton = popupNode.querySelector('.popup__close');
      closeButton.removeEventListener('click', Popup.close);
    },
    // Обработчик лайков
    likeHandler() {
      placesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('place-card__like-icon')) {
          Card.like(event);
        }
      });
    },
    // Добавление обработчиков формы галереи
    addGalleryHandlers() {
      galleryForm.addEventListener('submit', PopupGallery.afterSubmit);
      galleryForm.addEventListener('input', PopupGallery.check);
    },
    // Удаление обработчиков формы галереи
    removeGalleryHandlers() {
      galleryForm.removeEventListener('submit', PopupGallery.afterSubmit);
      galleryForm.removeEventListener('input', PopupGallery.check);
    },
    // Добавление обработчиков формы профиля
    addProfileHandlers() {
      profileForm.addEventListener('submit', PopupProfile.afterSubmit);
      profileForm.addEventListener('input', PopupProfile.check);
    },
    // Удаление обработчиков формы профиля
    removeProfileHandlers() {
      profileForm.removeEventListener('submit', PopupProfile.afterSubmit);
      profileForm.removeEventListener('input', PopupProfile.check);
    },
    // Добавление обработчиков формы профиля
    addAvatarHandlers() {
      avatarForm.addEventListener('submit', PopupAvatar.afterSubmit);
      avatarForm.addEventListener('input', PopupAvatar.check);
    },
    // Удаление обработчиков формы профиля
    removeAvatarHandlers() {
      avatarForm.removeEventListener('submit', PopupAvatar.afterSubmit);
      avatarForm.removeEventListener('input', PopupAvatar.check);
    },
    // Обработчик для удаления карточки из DOM и API
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
    // Обработчик открытия изображения и задачи ему src изображения
    imageOpenHandler() {
      placesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('place-card__image')) {
          const attribute = PopupImage.getImage(event.target);
          PopupImage.setImage(attribute);
          PopupImage.openPopup();
        }
      });
    },
    // Стартовые обработчики
    start() {
      popupGalleryButton.addEventListener('click', PopupGallery.openPopup);
      popupProfileButton.addEventListener('click', PopupProfile.openPopup);
      popupAvatarButton.addEventListener('click', PopupAvatar.openPopup);

      this.likeHandler();
      this.removeHandler();
      this.imageOpenHandler();
    }
  };

  // Старт приложения после загрузки DOM
  document.addEventListener('DOMContentLoaded', () => {
    const startPromise = Promise.resolve();

    startPromise
      .then(() => API.getProfileInfo().then(result => ownerId = result._id))
      .then(() => API.getAvatar())
      .then(() => cardList = new CardList(placesList))
      .then(() => API.getInitialCards())
      .then(() => handlers.start())
      .catch(err => console.error(err));
  });

})();