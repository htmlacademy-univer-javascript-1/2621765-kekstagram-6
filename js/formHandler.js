/*Изучите, что значит загрузка изображения, и как, когда и каким образом показывается форма редактирования изображения.
Напишите код и добавьте необходимые обработчики для реализации этого пункта техзадания. В работе вы можете опираться на код показа
окна с полноразмерной фотографией, который вы, возможно, уже написали в предыдущей домашней работе.*/

/*Выбор изображения для загрузки осуществляется с помощью стандартного контрола загрузки файла .img-upload__input, который
стилизован под букву «О» в логотипе.
После выбора изображения (изменения значения поля .img-upload__input), показывается форма редактирования изображения.
У элемента .img-upload__overlay удаляется класс hidden, а body задаётся класс modal-open.

После выбора изображения пользователем с помощью стандартного контрола загрузки файла .img-upload__input, нужно подставить
 его в форму редактирования вместо тестового изображения в блок предварительного просмотра и в превью эффектов.

1.3 Закрытие формы редактирования изображения производится либо нажатием на кнопку .img-upload__cancel, либо нажатием клавиши
 Esc. Элементу .img-upload__overlay возвращается класс hidden. У элемента body удаляется класс modal-open.*/
//import{isEscKey} from './util.js';
const imgInput=document.querySelector('.img-upload__input');
const imgOverlay=document.querySelector('.img-upload__overlay');
const imgCancel=document.querySelector('.img-upload__cancel');


imgInput.addEventListener('change',()=>{
  imgOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

});


imgCancel.addEventListener('click',()=>{
  imgOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

/*function formHandlerEscKeyDown(evt){
  if (isEscKey(evt)){
    imgOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
}*/
imgCancel.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    imgOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
});
