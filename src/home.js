import {
  handleCategoryClick,
  handleProductClick,
  handleSearchSubmit,
  initHomePage,
} from './js/handlers';
import { showTost } from './js/helpers';
import { refs } from './js/refs';

document.addEventListener('DOMContentLoaded', initHomePage);

refs.categoriesList.addEventListener('click', handleCategoryClick);

refs.productsList.addEventListener('click', handleProductClick);

refs.searchFrom.addEventListener('submit', handleSearchSubmit);
