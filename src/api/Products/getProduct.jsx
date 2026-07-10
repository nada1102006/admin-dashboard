import axios from 'axios';

const API_BASE_URL = '/api';

export default async function getProduct(productId) {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response?.data?.product || null;
}