import { debounce, shuffleArray } from './util.js';
import { renderPhotos, removePictures } from './thumbnail-renderer.js';
import { getPhotos } from './main.js';

const FILTERED_PHOTOS_COUNT = 10;
const ACTIVE_CLASS = 'img-filters__button--active';

const imgFilters = document.querySelector('.img-filters');
const imgFiltersForm = imgFilters.querySelector('.img-filters__form');

const getFilteredPhotos = (filterId) => {
  const photos = getPhotos();

  switch (filterId) {
    case 'filter-default':
      return photos;
    case 'filter-random':
      return shuffleArray(photos.slice(0, FILTERED_PHOTOS_COUNT));
    case 'filter-discussed':
      return [...photos].sort((first, second) =>
        second.comments.length - first.comments.length
      );
    default:
      return photos;
  }
};

const isButton = (evt) => evt.target.tagName === 'BUTTON';

const updateActiveButton = (clickedButton) => {
  const activeButton = imgFiltersForm.querySelector(`.${ACTIVE_CLASS}`);

  if (activeButton) {
    activeButton.classList.remove(ACTIVE_CLASS);
  }

  clickedButton.classList.add(ACTIVE_CLASS);
};

const onFiltersFormClick = debounce((evt) => {
  if (!isButton(evt)) {
    return;
  }

  const button = evt.target;
  const filterId = button.id;

  updateActiveButton(button);

  removePictures();
  const filteredPhotos = getFilteredPhotos(filterId);
  renderPhotos(filteredPhotos);
});

imgFiltersForm.addEventListener('click', onFiltersFormClick);
