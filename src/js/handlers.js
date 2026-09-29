import { showTost, toggleActiveClass } from './helpers';
import { openModal } from './modal';
import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from './products-api';
import {
  clearProductList,
  hideNotFound,
  renderCategories,
  renderProductInModal,
  renderProducts,
  showNotFound,
} from './render-function';

export async function initHomePage() {
  try {
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
