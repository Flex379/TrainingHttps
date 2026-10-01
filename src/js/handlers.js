import axios from 'axios';
import { showTost, toggleActiveClass } from './helpers';
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
  hideNotFound,
  renderCategories,
  renderProductInModal,
  renderProducts,
  showNotFound,
  updateCounters,
} from './render-function';
import {
  addToCart,
  addToWishlist,
  getCartItems,
  getWishlistItems,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromWishlist,
} from './storage';

let currentProductId = null;

export async function initHomePage() {
  try {
    updateCounters(getWishlistItems(), getCartItems());
    const categories = await getCategories();
    renderCategories(categories);

    const { products } = await getProducts();
    renderProducts(products);
  } catch (err) {
    console.log(`Ошибка инициализации странички Home ${err}`);
  }
}

export async function handleCategoryClick(event) {
  const { target } = event;

  if (target.nodeName !== 'BUTTON') {
    return;
  }

  clearProductList();

  try {
    const category = target.textContent;

    const allCategoriesButtons = document.querySelectorAll('.categories__btn');
    toggleActiveClass(allCategoriesButtons, target, 'categories__btn--active');

    let productsData;

    if (category === 'All') {
      productsData = await getProducts();
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

  try {
    const { products } = await getProducts();
    await renderProducts(products);

    hideNotFound();
  } catch (err) {
    showTost(`fetching products ${err}`, 'error');
    console.log('Error fetching products', err);

    showNotFound();
  }
}

export function handleAddToWishListBtn(event) {
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

export function handleAddToCartBtnClick(event) {
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
