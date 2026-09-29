import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './constants';

axios.defaults.baseURL = API_BASE_URL;

export async function getProducts() {
  const { data } = await axios(API_ENDPOINTS.PRODUCTS);
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
