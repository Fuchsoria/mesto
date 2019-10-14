import {
  cardList
} from '../index';


const profileName = document.querySelector('.user-info__name');
const profileJob = document.querySelector('.user-info__job');
const profilePhoto = document.querySelector('.user-info__photo');


export default class Api {
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