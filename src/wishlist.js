import {
  handleAddToCartBtnClick,
  handleAddToWishListBtn,
  handleProductClick,
  handleScrollTop,
  handleScrollToTopBtnClick,
  handleToggleThemeBtnClick,
  initWishlistPage,
} from './js/handlers';
import { loadWishlistProducts } from './js/helpers';
import { refs } from './js/refs';

document.addEventListener('DOMContentLoaded', initWishlistPage);

refs.productsList.addEventListener('click', handleProductClick);

refs.addToWishListBtn.addEventListener('click', async () => {
  handleAddToWishListBtn();
  await loadWishlistProducts();
});

refs.addToCartBtn.addEventListener('click', handleAddToCartBtnClick);

window.addEventListener('scroll', handleScrollTop);

refs.scrollToTopBtn.addEventListener('click', handleScrollToTopBtnClick);

refs.toggleThemeBtn.addEventListener('click', handleToggleThemeBtnClick);
