export default class Api {
  constructor(options, elements) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
    this.profileName = elements.name;
    this.profileJob = elements.job;
    this.profilePhoto = elements.photo;
  }

  checkStatus(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }

  showError(err) {
    return console.error(err);
  }

  getInitialCards(cardList) {
    fetch(`${this.baseUrl}/cards`, {
        headers: this.headers
      })
      .then(this.checkStatus)
      .then(this.cardList = cardList)
      .then((result) => this.cardList.renderCards(result))
      .catch(this.showError);
  }

  getProfileInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers
      })
      .then(this.checkStatus)
      .then((result) => {
        this.profileName.textContent = result.name;
        this.profileJob.textContent = result.about;
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
        this.profileName.textContent = result.name;
        this.profileJob.textContent = result.about;
      })
      .catch(this.showError);
  }
  getAvatar() {
    fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers
      })
      .then(this.checkStatus)
      .then((result) => this.profilePhoto.style.backgroundImage = `url(${result.avatar})`)
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
      .then((result) => this.profilePhoto.style.backgroundImage = `url(${result.avatar})`)
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
      .then((result) => this.cardList.addCard({
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