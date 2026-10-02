import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ITEMS_PER_PAGE } from './constants';

axios.defaults.baseURL = API_BASE_URL;

export async function getProducts(currentPage = 1) {
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data } = await axios(
    `${API_ENDPOINTS.PRODUCTS}?limit=${ITEMS_PER_PAGE}&skip=${skip}`
  );
  return data;
}

export async function getCategories() {
  const { data } = await axios(API_ENDPOINTS.CATEGORIES);
  return data;
}

export async function getProductsByCategory(category) {
  const { data } = await axios(
    `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY}${category}`
  );
  return data;
}

export async function getProductById(productId) {
  const { data } = await axios(`${API_ENDPOINTS.PRODUCT_BY_ID}${productId}`);
  return data;
}

export async function searchProducts(query) {
  const { data } = await axios(`${API_ENDPOINTS.SEARCH}?q=${query}`);
  return data;
}

export async function getProductsByIds(ids) {
  return Promise.all(ids.map(id => getProductById(id)));
}
