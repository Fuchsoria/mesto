import Card from './Card';
import {
  GLOBAL
} from '../Global';

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
      const isLiked = likes.some((user) => user._id === GLOBAL.ownerId);
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