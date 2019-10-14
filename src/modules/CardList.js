import {
  ownerId
} from '../index';
import Card from './Card';

/* CardList
 * addCard добавляет карточку в массив и отправляет в рендер
 * renderCards проходит по всем карточкам из массива и отправляет их в рендер
 */
export default class CardList {
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