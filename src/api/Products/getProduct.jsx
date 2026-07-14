import api from '../api';

export default async function getProduct(productId) {
    // Use the shared client so this request has the same base URL and
    // authorization header as the products list request.
    const response = await api.get(`/products/${productId}`);
    return response?.data?.product || null;
}
