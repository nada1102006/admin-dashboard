import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import getProduct from '../api/Products/getProduct';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProductById = useCallback(async (id) => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getProduct(id);
            setProduct(data);
        } catch (err) {
            setError(err?.message || 'Unable to load product details');
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo(
        () => ({ product, loading, error, fetchProductById, setProduct }),
        [product, loading, error, fetchProductById]
    );

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }

    return context;
}