import {openBigPicture} from './bigPicture.js';


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
    openBigPicture(photo);
  });

  return clonedElement;
};

const fragment=document.createDocumentFragment();

const renderPhotos = (obj) => {

  obj.forEach((i) => {
    fragment.appendChild(renderPhoto(i));
  });
  pictures.appendChild(fragment);
};

const photos=pictures.getElementsByClassName('picture');

const removePictures=()=>{
  if (photos){
    Array.from(photos).forEach((photo) => photo.remove());
  }
};

export{renderPhotos,removePictures};


