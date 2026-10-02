import axios from 'axios';
import {
  loadCartProducts,
  loadWishlistProducts,
  showTost,
  toggleActiveClass,
  toggleTheme,
  updateLoadMoreBtn,
} from './helpers';
import { openModal } from './modal';
import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from './products-api';
import { refs } from './refs';
import {
  clearProductList,
  hideLoadMoreBtn,
  hideNotFound,
  renderCategories,
  renderProductInModal,
  renderProducts,
  showLoadMoreBtn,
  showLoadMoreBtnLoading,
  showNotFound,
  updateCartSummary,
  updateCounters,
} from './render-function';
import {
  addToCart,
  addToWishlist,
  getCartItems,
  getTheme,
  getWishlistItems,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromStorage,
  removeFromWishlist,
  saveTheme,
} from './storage';
import { STORAGE_KEYS } from './constants';

let currentProductId = null;
let currentPage = 1;

export async function initHomePage() {
  const userTheme = getTheme();
  toggleTheme(userTheme);
  try {
    updateCounters(getWishlistItems(), getCartItems());
    const categories = await getCategories();
    renderCategories(categories);

    const { products, total } = await getProducts(currentPage);
    renderProducts(products);

    showLoadMoreBtn();
    updateLoadMoreBtn(total, currentPage);
  } catch (err) {
    console.log(`Ошибка инициализации странички Home ${err}`);
  }
}

export async function initWishlistPage() {
  const userTheme = getTheme();
  toggleTheme(userTheme);
  updateCounters(getWishlistItems(), getCartItems());
  await loadWishlistProducts();
}

export async function initCartPage() {
  const userTheme = getTheme();
  toggleTheme(userTheme);
  updateCounters(getWishlistItems(), getCartItems());
  await loadCartProducts();
}

export async function handleCategoryClick(event) {
  const { target } = event;

  if (target.nodeName !== 'BUTTON') {
    return;
  }

  clearProductList();
  hideLoadMoreBtn();

  try {
    const category = target.textContent;

    const allCategoriesButtons = document.querySelectorAll('.categories__btn');
    toggleActiveClass(allCategoriesButtons, target, 'categories__btn--active');

    let productsData;

    if (category === 'All') {
      currentPage = 1;
      productsData = await getProducts(currentPage);
      showLoadMoreBtn();
    } else {
      productsData = await getProductsByCategory(category);
    }

    if (productsData.products.length > 0) {
      renderProducts(productsData.products);
      hideNotFound();
    } else {
      showNotFound();
    }
  } catch (err) {
    console.log(`Ошибка получения продуктов по категории ${err}`);
  }
}

export async function handleProductClick(event) {
  const productItem = event.target.closest('.products__item');
  if (!productItem) {
    return;
  }

  const productId = Number(productItem.dataset.id);
  currentProductId = productId;
  const product = await getProductById(productId);

  renderProductInModal(product);
  openModal();
}

export async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchValue.value.trim();

  if (!query) {
    showTost('Please enter a valid search query', 'warning');
    return;
  }

  clearProductList();
  hideLoadMoreBtn();

  try {
    const { products } = await searchProducts(query);
    if (products.length > 0) {
      renderProducts(products);
      hideNotFound();
    } else {
      showNotFound();
    }
  } catch (error) {
    showTost(`Ошибка получения продуктов по поиску ${error}`, 'error');
    console.log(`Ошибка получения продуктов по поиску ${error}`);
  }
}

export async function handleSearchClearBtn() {
  refs.searchFrom.reset();
  clearProductList();
  currentPage = 1;

  try {
    const { products, total } = await getProducts(currentPage);
    renderProducts(products);

    hideNotFound();
    showLoadMoreBtn();
    updateLoadMoreBtn(total, currentPage);

    const categorryEl = document.querySelector('.categories__btn');

    const allCategoriesBtn = document.querySelectorAll('.categories__btn');

    toggleActiveClass(allCategoriesBtn, categorryEl, 'categories__btn--active');
  } catch (err) {
    showTost(`fetching products ${err}`, 'error');
    console.log('Error fetching products', err);

    showNotFound();
  }
}

export function handleAddToWishListBtn() {
  if (!currentProductId) {
    return;
  }

  if (isInWishlist(currentProductId)) {
    removeFromWishlist(currentProductId);
    refs.addToWishListBtn.textContent = 'Add to Wishlist';
    showTost('Product has been removed from wishlist', 'info');
  } else {
    addToWishlist(currentProductId);
    refs.addToWishListBtn.textContent = 'Remove from Wishlist';
    showTost('Product has been added to wishlist', 'success');
  }
  updateCounters(getWishlistItems(), getCartItems());
}

export function handleAddToCartBtnClick() {
  if (!currentProductId) {
    return;
  }

  if (isInCart(currentProductId)) {
    removeFromCart(currentProductId);
    refs.addToCartBtn.textContent = 'Add to Cart';
    showTost('Product has been removed from cart', 'info');
  } else {
    addToCart(currentProductId);
    refs.addToCartBtn.textContent = 'Remove from cart';
    showTost('Product has been added to cart', 'success');
  }
  updateCounters(getWishlistItems(), getCartItems());
}

export async function handleLoadMoreBtnClick() {
  currentPage += 1;
  showLoadMoreBtnLoading();

  try {
    const { products, total } = await getProducts(currentPage);
    renderProducts(products);
    updateLoadMoreBtn(total, currentPage);
  } catch (err) {
    showTost(`Ошибка в нажатии в loadMoreBtn ${err}`, 'error');
    console.log('Ошибка в нажатии в loadMoreBtn', err);
  }
}

export function handleBuyProductsClick() {
  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    showTost('Your cart is empty', 'warning');
    return;
  }

  showTost('Thank for your purchase !', 'success');

  removeFromStorage(STORAGE_KEYS.CART);

  updateCounters(getWishlistItems(), []);

  updateCartSummary([]);

  window.location.reload();
}

export function handleScrollTop() {
  if (window.scrollY > 400) {
    refs.scrollToTopBtn.classList.add('scroll-top-btn--visible');
  } else {
    refs.scrollToTopBtn.classList.remove('scroll-top-btn--visible');
  }
}

export function handleScrollToTopBtnClick() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export function handleToggleThemeBtnClick() {
  const currentTheme = document.body.dataset.theme || 'light';

  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  toggleTheme(newTheme);
  saveTheme(newTheme);
}
