import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { ITEMS_PER_PAGE } from './constants';
import {
  clearProductList,
  hideLoadMoreBtn,
  hideLoadMoreBtnLoading,
  hideNotFound,
  renderProducts,
  showNotFound,
  updateCartSummary,
} from './render-function';
import { getCartItems, getTheme, getWishlistItems } from './storage';
import { getProductsByIds } from './products-api';
import { refs } from './refs';

export function toggleActiveClass(elements, activeElement, activeClass) {
  elements.forEach(element => {
    element.classList.remove(activeClass);
  });
  activeElement.classList.add(activeClass);
}

export function showTost(message, type = 'success') {
  const options = {
    message,
    position: 'topRight',
    timeout: 5000,
  };
  switch (type) {
    case 'success':
      iziToast.success(options);
      break;
    case 'error':
      iziToast.error(options);
      break;
    case 'warning':
      iziToast.warning(options);
      break;
    case 'info':
      iziToast.info(options);
      break;

    default:
      iziToast.error({
        message: 'Invalid Type Of toast',
        position: 'topRight',
        timeout: 5000,
      });
  }
}

export function updateLoadMoreBtn(total, currentPage) {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (currentPage === totalPages) {
    hideLoadMoreBtn();
    showTost('No more products to load', 'info');
  } else {
    hideLoadMoreBtnLoading();
  }
}

export async function loadWishlistProducts() {
  const wishList = getWishlistItems();
  clearProductList();

  if (wishList.length === 0) {
    showNotFound();
    return;
  }

  hideNotFound();
  try {
    const products = await getProductsByIds(wishList);
    renderProducts(products);
  } catch (err) {
    console.log(`Error loading wishlist products ${err}`);
    showTost(`Error loading wishlist products ${err}`, 'error');
  }
}

export async function loadCartProducts() {
  const cart = getCartItems();
  clearProductList();

  if (cart.length === 0) {
    showNotFound();

    updateCartSummary([]);
    return;
  }

  hideNotFound();

  try {
    const products = await getProductsByIds(cart);
    renderProducts(products);
    updateCartSummary(products);
  } catch (err) {
    console.log(`Error loading cart products ${err}`);
    showTost(`Error loading cart products ${err}`, 'error');
  }
}

export function toggleTheme(theme) {
  document.body.dataset.theme = theme;
  refs.toggleThemeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
}
