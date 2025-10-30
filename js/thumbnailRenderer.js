import {generatePhotoDescriptions} from './data.js';

const pictures=document.querySelector('.pictures');
const picture=document.querySelector('#picture').content.querySelector('.picture');

const renderPhoto = (photo) => {
  const {url, comments, likes, description} = photo;
  const clonedElement = picture.cloneNode(true);
  clonedElement.querySelector('.picture__likes').textContent = likes;
  clonedElement.querySelector('.picture__comments').textContent = comments.length;
  const img = clonedElement.querySelector('.picture__img');
  img.src = url;
  img.alt = description;

  clonedElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    generatePhotoDescriptions(photo);
  });

  return clonedElement;
};

const fragment=document.createDocumentFragment();

const clearPhotos=() =>{
  pictures.innerHTML='';
};

const renderPhotos = (obj) => {
  clearPhotos();
  obj.forEach((i) => {
    fragment.appendChild(renderPhoto(i));
  });
  pictures.appendChild(fragment);
};
const photos = generatePhotoDescriptions();
renderPhotos(photos);

