const bigPicture = document.querySelector('.big-picture');
const bigImg = bigPicture.querySelector('.big-picture__img img');
const socialComments = bigPicture.querySelector('.social__comments');
const likesCount = bigPicture.querySelector('.likes-count');
const pictureCaption = bigPicture.querySelector('.social__caption');
const socialCommentsCount = bigPicture.querySelector('.social__comment-count');
const loadButton = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const socialComment = bigPicture.querySelector('.social__comment');

const commentFragment = document.createDocumentFragment();

const COMMENTS_STEP = 5;
let commentsCount = COMMENTS_STEP;
let currentComments = [];

const renderComment = (comment) => {
  const newComment = socialComment.cloneNode(true);

  const avatar = newComment.querySelector('.social__picture');

  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  newComment.querySelector('.social__text').textContent = comment.message;
  return newComment;
};

function numDecline(number, one, two, five) {
  number = Math.abs(number) % 100;
  const n1 = number % 10;
  if (number > 10 && number < 20) {
    return five;
  }
  if (n1 > 1 && n1 < 5) {
    return two;
  }
  if (n1 === 1) {
    return one;
  }
  return five;
}

const renderComments = () => {
  socialComments.innerHTML = '';
  socialCommentsCount.innerHTML = '';

  if (commentsCount > currentComments.length) {
    commentsCount = currentComments.length;
  }

  socialCommentsCount.innerHTML = `${commentsCount} из <span class='comments-count'>${currentComments.length}</span> ${numDecline(currentComments.length, 'комментарий', 'комментария', 'комментариев')}`;

  for (let i = 0; i < commentsCount; i++) {
    commentFragment.appendChild(renderComment(currentComments[i]));
  }

  if (currentComments.length <= COMMENTS_STEP || commentsCount >= currentComments.length) {
    loadButton.classList.add('hidden');
  } else {
    loadButton.classList.remove('hidden');
  }

  socialComments.appendChild(commentFragment);
};

const show = (picture) => {
  const { url, likes, description } = picture;
  likesCount.textContent = likes;
  pictureCaption.textContent = description;
  bigImg.src = url;
};

const onLoadButtonButtonClick = () => {
  commentsCount += COMMENTS_STEP;
  renderComments();
};

function isEscKey(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc' || evt.keyCode === 27;
}

function onBigPictureEscKeyDown(evt) {
  if (isEscKey(evt)) {
    closeBigPicture();
  }
}

function closeBigPicture() {
  commentsCount = COMMENTS_STEP;
  document.removeEventListener('keydown', onBigPictureEscKeyDown);
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

const onCloseBigPictureClick = () => {
  closeBigPicture();
};

const openBigPicture = (picture) => {
  currentComments = picture.comments.slice();
  show(picture);
  renderComments();
  document.addEventListener('keydown', onBigPictureEscKeyDown);
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

loadButton.addEventListener('click', onLoadButtonButtonClick);
closeButton.addEventListener('click', onCloseBigPictureClick);

export { openBigPicture };
