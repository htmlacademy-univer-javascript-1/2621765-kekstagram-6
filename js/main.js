import './util.js';
import './thumbnail-renderer.js';
import './big-picture.js';
import './form-handler.js';
import './filters.js';

import { renderPhotos } from './thumbnail-renderer.js';
import { loadData } from './fetch.js';

let photos = [];

const onSuccess = (data) => {
  photos = data.slice();
  renderPhotos(data.slice());
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
};

const onFail = () => {
  const messageAlert = document.createElement('div');
  messageAlert.style.position = 'absolute';
  messageAlert.style.left = 0;
  messageAlert.style.top = 0;
  messageAlert.style.right = 0;
  messageAlert.style.fontSize = '30px';
  messageAlert.style.backgroundColor ='red';
  messageAlert.style.textAlign = 'center' ;
  messageAlert.textContent ='Ошибка загрузки фотографий';
  document.body.append(messageAlert);
};

loadData(onSuccess,onFail);

const getPhotos = () => photos.slice();

export{ getPhotos };

