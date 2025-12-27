import { isEscKey, getCommentWordForm } from './util.js';

const COMMENTS_STEP = 5;

const bigPictureElement = document.querySelector('.big-picture');
const bigImageElement = bigPictureElement.querySelector('.big-picture__img img');
const socialCommentsContainerElement = bigPictureElement.querySelector('.social__comments');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const pictureCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentsCountElement = bigPictureElement.querySelector('.social__comment-count');
const loadCommentsButtonElement = bigPictureElement.querySelector('.comments-loader');
const closeButtonElement = bigPictureElement.querySelector('.big-picture__cancel');
const socialCommentTemplateElement = bigPictureElement.querySelector('.social__comment');


let visibleCommentsCount = COMMENTS_STEP;
let currentComments = [];

const commentFragment = document.createDocumentFragment();

const createCommentElement = (comment) => {
  const commentElement = socialCommentTemplateElement.cloneNode(true);
  const avatarElement = commentElement.querySelector('.social__picture');

  avatarElement.src = comment.avatar;
  avatarElement.alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  return commentElement;
};


const clearContainers = () => {
  socialCommentsContainerElement.innerHTML = '';
  socialCommentsCountElement.innerHTML = '';
};

const updateCommentsCounter = () => {
  if (visibleCommentsCount > currentComments.length) {
    visibleCommentsCount = currentComments.length;
  }

  const commentWord = getCommentWordForm(
    currentComments.length,
    'комментарий',
    'комментария',
    'комментариев'
  );

  socialCommentsCountElement.innerHTML = `${visibleCommentsCount} из <span class='comments-count'>${currentComments.length}</span> ${commentWord}`;
};

const updateLoadButtonVisibility = () => {
  const shouldHideButton = currentComments.length <= COMMENTS_STEP || visibleCommentsCount >= currentComments.length;
  loadCommentsButtonElement.classList.toggle('hidden', shouldHideButton);
};

const renderCommentsList = () => {
  for (let i = 0; i < visibleCommentsCount; i++) {
    commentFragment.appendChild(createCommentElement(currentComments[i]));
  }
  socialCommentsContainerElement.appendChild(commentFragment);
};

const renderComments = () => {
  clearContainers();
  updateCommentsCounter();
  renderCommentsList();
  updateLoadButtonVisibility();
};

const displayBigPicture = (picture) => {
  const { url, likes, description } = picture;
  likesCountElement.textContent = likes;
  pictureCaptionElement.textContent = description;
  bigImageElement.src = url;
};

const onLoadMoreCommentsClick = () => {
  visibleCommentsCount += COMMENTS_STEP;
  renderComments();
};

const onBigPictureEscKeyDown = (evt) => {
  if (isEscKey(evt)) {
    closeBigPicture();
  }
};

function closeBigPicture()  {
  visibleCommentsCount = COMMENTS_STEP;
  document.removeEventListener('keydown', onBigPictureEscKeyDown);
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

const onCloseBigPictureClick = () => {
  closeBigPicture();
};

const openBigPicture = (picture) => {
  currentComments = picture.comments.slice();
  displayBigPicture(picture);
  renderComments();
  document.addEventListener('keydown', onBigPictureEscKeyDown);
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

loadCommentsButtonElement.addEventListener('click', onLoadMoreCommentsClick);
closeButtonElement.addEventListener('click', onCloseBigPictureClick);

export { openBigPicture };
