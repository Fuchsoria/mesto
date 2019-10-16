import "./pages/index.css";
import Api from './modules/Api';
import CardList from './modules/CardList';

import {
  handlers
} from './handlers';

import {
  GLOBAL
} from './Global';

// Формы, инпуты и прочие элементы
const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort3' : 'https://praktikum.tk/cohort3';
const placesList = document.querySelector('.places-list');
const profileName = document.querySelector('.user-info__name');
const profileJob = document.querySelector('.user-info__job');
const profilePhoto = document.querySelector('.user-info__photo');

GLOBAL.api = new Api({
  baseUrl: serverUrl,
  headers: {
    authorization: '705beead-7a33-410d-b927-b7a384dd6432',
    'Content-Type': 'application/json'
  }
}, {
  name: profileName,
  job: profileJob,
  photo: profilePhoto
});

// Старт приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const startPromise = Promise.resolve();
  startPromise
    .then(() => GLOBAL.api.getProfileInfo().then(result => GLOBAL.ownerId = result._id))
    .then(() => GLOBAL.api.getAvatar())
    .then(() => GLOBAL.api.getInitialCards(new CardList(placesList)))
    .then(() => handlers.start())
    .catch(err => console.error(err));
});

export {
  handlers
};