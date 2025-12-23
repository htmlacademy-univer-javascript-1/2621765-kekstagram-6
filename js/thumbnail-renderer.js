import { openBigPicture } from './big-picture.js';


const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createPhotoElement = (photo) => {
  const { url, comments, likes, description } = photo;
  const photoElement = pictureTemplate.cloneNode(true);

  photoElement.querySelector('.picture__likes').textContent = likes;
  photoElement.querySelector('.picture__comments').textContent = comments.length;
  const img = photoElement.querySelector('.picture__img');
  img.src = url;
  img.alt = description;

  photoElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photo);
  });

  return photoElement;
};

const fragment = document.createDocumentFragment();

const renderPhotos = (obj) => {

  obj.forEach((i) => {
    fragment.appendChild(createPhotoElement(i));
  });
  picturesContainer.appendChild(fragment);
};

const photos = picturesContainer.getElementsByClassName('picture');

const removePictures = () => {
  if (photos){
    Array.from(photos).forEach((photo) => photo.remove());
  }
};

export{ renderPhotos,removePictures };


