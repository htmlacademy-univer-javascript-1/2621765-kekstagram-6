import { isEscKey } from './util.js';
import { uploadData } from './fetch.js';

const MAX_SYMBOLS = 20;
const MAX_COMMENT_SYMBOLS = 140;
const MAX_HASHTAGS = 5;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const INITIAL_SCALE = 100;
const DEFAULT_EFFECT_LEVEL = 100;

const imageInputElement = document.querySelector('.img-upload__input');
const imageOverlayElement = document.querySelector('.img-upload__overlay');
const cancelButtonElement = document.querySelector('.img-upload__cancel');
const uploadFormElement = document.querySelector('.img-upload__form');
const hashtagsInputElement = document.querySelector('.text__hashtags');
const submitButtonElement = document.querySelector('.img-upload__submit');
const commentTextareaElement = document.querySelector('.text__description');

const sliderContainerElement = document.querySelector('.img-upload__effect-level');
const effectSliderElement = document.querySelector('.effect-level__slider');
const effectValueInputElement = document.querySelector('.effect-level__value');

const noneEffectRadioElement = document.querySelector('#effect-none');
const chromeEffectRadioElement = document.querySelector('#effect-chrome');
const sepiaEffectRadioElement = document.querySelector('#effect-sepia');
const marvinEffectRadioElement = document.querySelector('#effect-marvin');
const phobosEffectRadioElement = document.querySelector('#effect-phobos');
const heatEffectRadioElement = document.querySelector('#effect-heat');

const scaleSmallerButtonElement = document.querySelector('.scale__control--smaller');
const scaleBiggerButtonElement = document.querySelector('.scale__control--bigger');
const scaleValueElement = document.querySelector('.scale__control--value');

const imagePreviewElement = document.querySelector('.img-upload__preview img');
const effectsPreviewElements = document.querySelectorAll('.effects__preview');

const successTemplateElement = document.querySelector('#success').content.querySelector('.success');
const errorTemplateElement = document.querySelector('#error').content.querySelector('.error');

const pristineValidator = new Pristine(uploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__item--invalid',
  successClass: 'img-upload__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
  errorTextTag: 'div',
});

let currentScale = INITIAL_SCALE;
let errorMessage = '';

const getErrorMessage = () => errorMessage;

const createHashtagsArray = (value) => value.toLowerCase().trim().split(/\s+/);

const getHashtagValidationRules = (hashtagsArray) => [
  {
    check: hashtagsArray.some((item) => item.indexOf('#', 1) >= 1),
    error: 'Хэш-теги разделяются пробелами',
  },
  {
    check: hashtagsArray.some((item) => item[0] !== '#'),
    error: 'Хэш-тег должен начинаться с символа #',
  },
  {
    check: hashtagsArray.some((item, index, array) => array.includes(item, index + 1)),
    error: 'Хэш-теги не должны повторяться',
  },
  {
    check: hashtagsArray.some((item) => item.length > MAX_SYMBOLS),
    error: `Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`,
  },
  {
    check: hashtagsArray.length > MAX_HASHTAGS,
    error: `Нельзя указать больше ${MAX_HASHTAGS} хэш-тегов`,
  },
  {
    check: hashtagsArray.some((item) => !/^#[a-zа-яё0-9]{1,19}$/iu.test(item)),
    error: 'Хэш-тег содержит недопустимые символы',
  },
];

const validateHashtags = (value) => {
  errorMessage = '';
  const inputText = value.trim();

  if (!inputText) {
    return true;
  }

  const hashtagsArray = createHashtagsArray(value);
  const validationRules = getHashtagValidationRules(hashtagsArray);

  return validationRules.every((rule) => {
    if (rule.check) {
      errorMessage = rule.error;
      return false;
    }
    return true;
  });
};

const validateComments = (value) => value.length <= MAX_COMMENT_SYMBOLS;

const setupPristineValidators = () => {
  pristineValidator.addValidator(
    commentTextareaElement,
    validateComments,
    `Максимальная длина комментария ${MAX_COMMENT_SYMBOLS} символов`,
    1,
    false
  );

  pristineValidator.addValidator(
    hashtagsInputElement,
    validateHashtags,
    getErrorMessage,
    2,
    false
  );
};

const updateSubmitButtonState = () => {
  submitButtonElement.disabled = !pristineValidator.validate();
};

const onMessageEscKeyDown = (evt) => {
  if (isEscKey(evt)) {
    evt.preventDefault();
    const successMessageElement = document.querySelector('.success');
    const errorMessageElement = document.querySelector('.error');

    if (successMessageElement) {
      successMessageElement.remove();
    } else if (errorMessageElement) {
      errorMessageElement.remove();
    }

    document.removeEventListener('keydown', onMessageEscKeyDown);
    document.removeEventListener('click', onMessageOverlayClick);
  }
};

function onMessageOverlayClick(evt) {
  const button = evt.target.closest('button');
  if (!button && evt.target.closest('.success, .error')) {
    const messageElement = document.querySelector('.success, .error');
    messageElement.remove();
    document.removeEventListener('click', onMessageOverlayClick);
    document.removeEventListener('keydown', onMessageEscKeyDown);
  }
}

const showMessage = (template, buttonClass) => {
  const messageElement = template.cloneNode(true);
  document.body.append(messageElement);

  const closeButton = messageElement.querySelector(buttonClass);
  closeButton.addEventListener('click', () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageEscKeyDown);
    document.removeEventListener('click', onMessageOverlayClick);
  });

  document.addEventListener('keydown', onMessageEscKeyDown);
  document.addEventListener('click', onMessageOverlayClick);
};

const showSuccessMessage = () => showMessage(successTemplateElement, '.success__button');
const showErrorMessage = () => showMessage(errorTemplateElement, '.error__button');

const onFormEscKeyDown = (evt) => {
  if (!isEscKey(evt)) {
    return;
  }

  if (document.querySelector('.success, .error')) {
    return;
  }

  evt.preventDefault();
  closeForm();
};

function closeForm() {
  imageInputElement.value = '';
  uploadFormElement.reset();
  pristineValidator.reset();
  imagePreviewElement.style.transform = '';
  currentScale = INITIAL_SCALE;
  resetEffectSlider();
  imagePreviewElement.style.filter = 'none';

  noneEffectRadioElement.checked = true;
  imageOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onFormEscKeyDown);
}

function resetEffectSlider()  {
  if (effectSliderElement.noUiSlider) {
    effectSliderElement.noUiSlider.destroy();
  }
  sliderContainerElement.style.display = 'none';
  imagePreviewElement.style.filter = '';
  effectValueInputElement.value = DEFAULT_EFFECT_LEVEL.toString();
}

const createEffectSlider = (min, max, start, step, filterFunction) => {
  resetEffectSlider();
  sliderContainerElement.style.display = 'block';

  noUiSlider.create(effectSliderElement, {
    range: {
      min,
      max,
    },
    start,
    step,
    connect: 'lower',
  });

  effectValueInputElement.value = start.toString();
  effectSliderElement.noUiSlider.off('update');
  effectSliderElement.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValueInputElement.value = value;
    imagePreviewElement.style.filter = filterFunction(value);
  });
};

const handleEffectChange = (effectFunction, ...args) => {
  resetEffectSlider();
  setTimeout(() => effectFunction(...args), 10);
};

const setupEffectListeners = () => {
  noneEffectRadioElement.addEventListener('change', () => handleEffectChange(resetEffectSlider));

  chromeEffectRadioElement.addEventListener('change', () => {
    handleEffectChange(
      createEffectSlider,
      0,
      1,
      1,
      0.1,
      (value) => `grayscale(${value})`
    );
  });

  sepiaEffectRadioElement.addEventListener('change', () => {
    handleEffectChange(
      createEffectSlider,
      0,
      1,
      1,
      0.1,
      (value) => `sepia(${value})`
    );
  });

  marvinEffectRadioElement.addEventListener('change', () => {
    handleEffectChange(
      createEffectSlider,
      0,
      100,
      100,
      1,
      (value) => `invert(${value}%)`
    );
  });

  phobosEffectRadioElement.addEventListener('change', () => {
    handleEffectChange(
      createEffectSlider,
      0,
      3,
      3,
      0.1,
      (value) => `blur(${value}px)`
    );
  });

  heatEffectRadioElement.addEventListener('change', () => {
    handleEffectChange(
      createEffectSlider,
      1,
      3,
      3,
      0.1,
      (value) => `brightness(${value})`
    );
  });
};

const setupScaleControls = () => {
  scaleSmallerButtonElement.addEventListener('click', () => {
    if (currentScale > MIN_SCALE) {
      currentScale -= SCALE_STEP;
      scaleValueElement.value = `${currentScale}%`;
      const scaleNumber = currentScale / 100;
      imagePreviewElement.style.transform = `scale(${scaleNumber})`;
    }
  });

  scaleBiggerButtonElement.addEventListener('click', () => {
    if (currentScale < MAX_SCALE) {
      currentScale += SCALE_STEP;
      scaleValueElement.value = `${currentScale}%`;
      const scaleNumber = currentScale / 100;
      imagePreviewElement.style.transform = `scale(${scaleNumber})`;
    }
  });
};

const onImageInputChange = () => {
  imageOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeyDown);
  resetEffectSlider();

  noneEffectRadioElement.checked = true;
  imagePreviewElement.style.filter = 'none';
  effectValueInputElement.value = '';

  const file = imageInputElement.files[0];
  if (file) {
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((extension) => fileName.endsWith(extension));

    if (matches) {
      const imageUrl = URL.createObjectURL(file);
      imagePreviewElement.src = imageUrl;

      effectsPreviewElements.forEach((preview) => {
        preview.style.backgroundImage = `url(${imageUrl})`;
      });
    }
  }
};

const setupFormSubmit = () => {
  uploadFormElement.addEventListener('submit', (evt) => {
    if (pristineValidator.validate()) {
      evt.preventDefault();

      uploadData(
        () => {
          closeForm();
          showSuccessMessage();
        },
        () => {
          showErrorMessage();
        },
        'POST',
        new FormData(uploadFormElement)
      );
    }
  });
};

const setupInputEventListeners = () => {
  commentTextareaElement.addEventListener('keydown', (evt) => {
    if (isEscKey(evt)) {
      evt.stopPropagation();
    }
  });

  hashtagsInputElement.addEventListener('keydown', (evt) => {
    if (isEscKey(evt)) {
      evt.stopPropagation();
    }
  });

  commentTextareaElement.addEventListener('input', updateSubmitButtonState);
  hashtagsInputElement.addEventListener('input', updateSubmitButtonState);
};

const init = () => {
  setupPristineValidators();
  setupEffectListeners();
  setupScaleControls();
  setupFormSubmit();
  setupInputEventListeners();

  cancelButtonElement.addEventListener('click', closeForm);
  imageInputElement.addEventListener('change', onImageInputChange);
};


init();
