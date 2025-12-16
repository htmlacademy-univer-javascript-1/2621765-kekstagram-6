import {isEscKey} from './util.js';
import {uploadData} from './fetch.js';

const MAX_SYMBOLS=20;
const MAX_COMMENT_SYMBOLS=140;
const MAX_HASHTAGS=5;

const imgInput=document.querySelector('.img-upload__input');
const imgOverlay=document.querySelector('.img-upload__overlay');
const imgCancel=document.querySelector('.img-upload__cancel');
const imgForm=document.querySelector('.img-upload__form');
const textHashtags=document.querySelector('.text__hashtags');
const imgSubmit=document.querySelector('.img-upload__submit');
const comments=document.querySelector('.text__description');


imgInput.addEventListener('change',()=>{
  imgOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetSlider();
});

const pristine = new Pristine(imgForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__item--invalid',
  successClass: 'img-upload__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
  errorTextTag: 'div',
});
const  imgPreview=document.querySelector('.img-upload__preview img');
let currentScale = 100;

imgCancel.addEventListener('click',()=>{
  imgInput.value = '';
  imgForm.reset();
  pristine.reset();
  imgPreview.style.transform = '';
  currentScale = 100;
  imgOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

document.addEventListener('keydown', (evt) => {
  if (!isEscKey(evt)) {
    return;
  }

  if (document.querySelector('.success, .error')) {
    return;
  }

  evt.preventDefault();
  imgInput.value = '';
  imgForm.reset();
  pristine.reset();
  imgPreview.style.transform = '';
  currentScale = 100;
  imgOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
});


let errorMessage='';

const error=()=>errorMessage;

const hashtagsHandler=(value)=>{
  errorMessage='';

  const inputText=value.toLowerCase().trim();

  if (!inputText){
    return true;
  }

  const inputArray=inputText.split(/\s+/);

  const rules=[
    {
      check:inputArray.some((item)=>item.indexOf('#',1)>=1),
      error:'Хэш-теги разделяются пробелами',
    },
    {
      check:inputArray.some((item)=>item[0]!=='#'),
      error:'Хэш-тег должен начинаться с символа #',
    },
    {
      check:inputArray.some((item,num,arr)=>arr.includes(item,num+1)),
      error:'Хэш-теги не должны повторяться',
    },
    {
      check:inputArray.some((item)=>item.length > MAX_SYMBOLS),
      error:`Максимальная длина одного хэш-тега ${MAX_SYMBOLS} символов, включая решётку`,
    },
    {
      check:inputArray.length > MAX_HASHTAGS,
      error:`Нелзя указать больше ${MAX_HASHTAGS} хэш-тегов`,
    },
    {
      check:inputArray.some((item)=>!/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
      error:'Хэш-теш содержит недопустимые символы',
    },
  ];

  return rules.every((rule)=>{
    const isInvalid=rule.check;
    if(isInvalid){
      errorMessage=rule.error;
    }
    return !isInvalid;
  });
};

const commentsHandler=(value)=>{
  errorMessage='';
  const inputText=value.toLowerCase().trim();

  if (!inputText){
    return true;
  }
  const inputArray=inputText.split(/\s+/);

  const rules=[
    {
      check:inputArray.some((item)=>item.length > MAX_COMMENT_SYMBOLS),
      error:`Максимальная длина комментария ${MAX_COMMENT_SYMBOLS} символов`,
    },
  ];

  return rules.every((rule)=>{
    const isInvalid=rule.check;
    if(isInvalid){
      errorMessage=rule.error;
    }
    return !isInvalid;
  });
};

pristine.addValidator(comments,commentsHandler,error,1,false);
pristine.addValidator(textHashtags,hashtagsHandler,error,2,false);


const onContentInput=()=>{
  if(pristine.validate()){
    imgSubmit.disabled = false;
  }else{
    imgSubmit.disabled = true;
  }
};

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const onMessageEscKeydown = (evt) => {
  if (isEscKey(evt)) {
    evt.preventDefault();
    const successMsg = document.querySelector('.success');
    const errorMsg = document.querySelector('.error');

    if (successMsg) {
      successMsg.remove();
    } else if (errorMsg) {
      errorMsg.remove();
    }

    document.removeEventListener('keydown', onMessageEscKeydown);
    document.removeEventListener('click', onMessageOverlayClick);
  }
};

function onMessageOverlayClick (evt) {
  const button = evt.target.closest('button');
  if (!button && evt.target.closest('.success, .error')) {
    const message = document.querySelector('.success, .error');
    message.remove();
    document.removeEventListener('click', onMessageOverlayClick);
    document.removeEventListener('keydown', onMessageEscKeydown);
  }
}

const showSuccessMessage = () => {
  const clonedSuccess = successTemplate.cloneNode(true);
  document.body.append(clonedSuccess);

  const closeBtn = clonedSuccess.querySelector('.success__button');
  closeBtn.addEventListener('click', () => {
    clonedSuccess.remove();
    document.removeEventListener('keydown', onMessageEscKeydown);
    document.removeEventListener('click', onMessageOverlayClick);
  });

  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onMessageOverlayClick);
};

const showErrorMessage = () => {
  const clonedError = errorTemplate.cloneNode(true);
  document.body.append(clonedError);

  const closeBtn = clonedError.querySelector('.error__button');
  closeBtn.addEventListener('click', () => {
    clonedError.remove();
    document.removeEventListener('keydown', onMessageEscKeydown);
    document.removeEventListener('click', onMessageOverlayClick);
  });

  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onMessageOverlayClick);
};

imgForm.addEventListener('submit', (evt) => {
  if(pristine.validate()){
    evt.preventDefault();

    uploadData(
      () => {
        imgInput.value = '';
        imgForm.reset();
        pristine.reset();
        imgPreview.style.transform = '';
        currentScale = 100;
        imgOverlay.classList.add('hidden');
        document.body.classList.remove('modal-open');
        showSuccessMessage();
      },
      () => {
        showErrorMessage();
      },
      'POST',
      new FormData(imgForm)
    );
  }
});

comments.addEventListener('keydown', (evt) => {
  if (isEscKey(evt)) {
    evt.stopPropagation();
  }
});

textHashtags.addEventListener('keydown', (evt) => {
  if (isEscKey(evt)) {
    evt.stopPropagation();
  }
});


comments.addEventListener('input',onContentInput);
textHashtags.addEventListener('input',onContentInput);


const controlSmaller=document.querySelector(' .scale__control--smaller');
const controlBigger=document.querySelector('.scale__control--bigger');
const controlValue=document.querySelector('.scale__control--value');


const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP=25;


controlSmaller.addEventListener('click', () => {
  if (currentScale > MIN_SCALE) {
    currentScale -= STEP;
    controlValue.value = `${currentScale}%`;
    const scaleNumber = currentScale / 100;
    imgPreview.style.transform = `scale(${scaleNumber})`;
  }
});

controlBigger.addEventListener('click', () => {
  if (currentScale < MAX_SCALE) {
    currentScale += STEP;
    controlValue.value = `${currentScale}%`;
    const scaleNumber = currentScale / 100;
    imgPreview.style.transform = `scale(${scaleNumber})`;
  }
});


const sliderElement = document.querySelector('.img-upload__effect-level');
const effectSlider=document.querySelector('.effect-level__slider');
const effectValueInput = document.querySelector('.effect-level__value');

const effectsNone=document.querySelector('#effect-none');
const effectsChrome=document.querySelector('#effect-chrome');
const effectsSepia=document.querySelector('#effect-sepia');
const effectsMarvin=document.querySelector('#effect-marvin');
const effectsPhobos=document.querySelector('#effect-phobos');
const effectsHeat=document.querySelector('#effect-heat');

function resetSlider() {
  if (effectSlider.noUiSlider) {
    effectSlider.noUiSlider.destroy();
  }
  sliderElement.style.display = 'none';
  imgPreview.style.filter = '';
  effectValueInput.value = '';
}


function createrSliders(min,max,start,step,filterFunction){
  resetSlider();
  sliderElement.style.display = 'block';

  noUiSlider.create(effectSlider, {
    range: {
      min: min,
      max: max,
    },
    start: start,
    step: step,
    connect: 'lower',
  });
  effectValueInput.value = start;
  effectSlider.noUiSlider.off('update');
  effectSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValueInput.value = value;
    imgPreview.style.filter = filterFunction(value);
  });
}


effectsNone.addEventListener('change', resetSlider);

effectsChrome.addEventListener('change', () =>
  createrSliders(0, 1, 1, 0.1, (value) => `grayscale(${value})`)
);

effectsSepia.addEventListener('change', () =>
  createrSliders(0, 1, 1, 0.1, (value) => `sepia(${value})`)
);

effectsMarvin.addEventListener('change', () =>
  createrSliders(0, 100, 100, 1, (value) => `invert(${value})`)
);

effectsPhobos.addEventListener('change', () =>
  createrSliders(0, 3, 3, 0.1, (value) => `blur(${value}px)`)
);

effectsHeat.addEventListener('change', () =>
  createrSliders(1, 3, 3, 0.1, (value) => `brightness(${value})`)
);


const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const effectsPreviews=document.querySelectorAll('.effects__preview');

imgInput.addEventListener('change', () => {
  const file = imgInput.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  imgPreview.style.transform = '';
  currentScale = 100;
  if (matches) {
    imgPreview.src = URL.createObjectURL(file);
    const imageUrl=imgPreview.src;

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${imageUrl})`;
    });
  }
});
