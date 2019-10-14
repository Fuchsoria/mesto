import {
  ownerId,
  API
} from '../index';

const cardTemplate = document.querySelector('#card-template');
const placesList = document.querySelector('.places-list');

/* Card
 * like изменяет состояние класса после нажатия и отправляет запрос на обновление на API сервер
 * remove удаляет карточку из API сервера
 * create создаёт элемент карточки и возвращает его
 */
export default class Card {
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