import {
  handleAddToCartBtnClick,
  handleAddToWishListBtn,
  handleBuyProductsClick,
  handleProductClick,
  handleScrollTop,
  handleScrollToTopBtnClick,
  handleToggleThemeBtnClick,
  initCartPage,
  initWishlistPage,
} from './js/handlers';
import { loadCartProducts, loadWishlistProducts } from './js/helpers';
import { refs } from './js/refs';

document.addEventListener('DOMContentLoaded', initCartPage);

refs.productsList.addEventListener('click', handleProductClick);

refs.addToWishListBtn.addEventListener('click', handleAddToWishListBtn);

refs.addToCartBtn.addEventListener('click', async () => {
  handleAddToCartBtnClick();
  await loadCartProducts();
});

refs.buyProductsBtn.addEventListener('click', handleBuyProductsClick);

window.addEventListener('scroll', handleScrollTop);

refs.scrollToTopBtn.addEventListener('click', handleScrollToTopBtnClick);

refs.toggleThemeBtn.addEventListener('click', handleToggleThemeBtnClick);
