const MAX_SYMBOLS=20;
const MAX_COMMENT_SYMBOLS=140;
const MAX_HASHTAGS=5;

const imgInput=document.querySelector('.img-upload__input');
const imgOverlay=document.querySelector('.img-upload__overlay');
const imgCancel=document.querySelector('.img-upload__cancel');
//const imgPreview=document.querySelector('.img-upload__preview');
const imgForm=document.querySelector('.img-upload__form');
const textHashtags=document.querySelector('.text__hashtags');
const imgSubmit=document.querySelector('.img-upload__submit');
const comments=document.querySelector('.text__description');

imgInput.addEventListener('change',()=>{
  imgOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
});


imgCancel.addEventListener('click',()=>{
  imgInput.value = '';
  imgForm.reset();
  imgOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    imgInput.value = '';
    imgForm.reset();
    imgOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
});

const pristine = new Pristine(imgForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__item--invalid',
  successClass: 'img-upload__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
  errorTextTag: 'div',
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
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

textHashtags.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});


comments.addEventListener('input',onContentInput);
textHashtags.addEventListener('input',onContentInput);

