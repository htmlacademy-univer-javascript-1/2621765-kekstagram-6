import {isEscKey} from './util.js';

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

imgCancel.addEventListener('click',()=>{
  imgInput.value = '';
  imgForm.reset();
  pristine.reset();
  imgOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

document.addEventListener('keydown', (evt) => {
  if (isEscKey(evt)) {
    evt.preventDefault();
    imgInput.value = '';
    imgForm.reset();
    pristine.reset();
    imgOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
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
const  imgPreview=document.querySelector('.img-upload__preview');

const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP=25;

let currentScale = 100;
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

effectsNone.addEventListener('change', resetSlider);

effectsChrome.addEventListener('change',()=>{
  resetSlider();
  sliderElement.style.display = 'block';

  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
    connect: 'lower',
  });
  effectValueInput.value = 1;
  effectSlider.noUiSlider.off('update');
  effectSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValueInput.value = value;
    imgPreview.style.filter = `grayscale(${value})`;
  });
});

effectsSepia.addEventListener('change',()=>{
  resetSlider();
  sliderElement.style.display = 'block';
  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
    connect: 'lower',
  });
  effectSlider.noUiSlider.off('update');
  effectSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValueInput.value = value;
    imgPreview.style.filter = `sepia(${value})`;
  });
});

effectsMarvin.addEventListener('change',()=>{
  resetSlider();
  sliderElement.style.display = 'block';
  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
  });
  effectSlider.noUiSlider.off('update');
  effectSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValueInput.value = value;
    imgPreview.style.filter = `invert(${value})`;
  });
});


effectsPhobos.addEventListener('change',()=>{
  resetSlider();
  sliderElement.style.display = 'block';
  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 3,
    },
    start: 3,
    step: 0.1,
    connect: 'lower',
  });
  effectSlider.noUiSlider.off('update');
  effectSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValueInput.value = value;
    imgPreview.style.filter = `blur(${value}px)`;
  });
});

effectsHeat.addEventListener('change',()=>{
  resetSlider();
  sliderElement.style.display = 'block';
  noUiSlider.create(effectSlider, {
    range: {
      min: 1,
      max: 3,
    },
    start: 3,
    step: 0.1,
    connect: 'lower',
  });
  effectSlider.noUiSlider.off('update');
  effectSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValueInput.value = value;
    imgPreview.style.filter = `brightness(${value})`;
  });
});
