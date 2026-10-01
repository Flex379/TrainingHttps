import {
  handleAddToCartBtnClick,
  handleAddToWishListBtn,
  handleCategoryClick,
  handleProductClick,
  handleSearchClearBtn,
  handleSearchSubmit,
  initHomePage,
} from './js/handlers';
import { showTost } from './js/helpers';
import { refs } from './js/refs';

document.addEventListener('DOMContentLoaded', initHomePage);

refs.categoriesList.addEventListener('click', handleCategoryClick);

refs.productsList.addEventListener('click', handleProductClick);

refs.searchFrom.addEventListener('submit', handleSearchSubmit);

refs.clearSearchBtn.addEventListener('click', handleSearchClearBtn);

refs.addToWishListBtn.addEventListener('click', handleAddToWishListBtn);

refs.addToCartBtn.addEventListener('click', handleAddToCartBtnClick);
