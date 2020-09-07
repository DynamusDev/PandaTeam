import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const storagedProducts = await AsyncStorage.getItem(
        '@KinaFeijaoVerde:cart',
      );

      if (storagedProducts) {
        const parsedProduct = JSON.parse(storagedProducts);

        setProducts(parsedProduct);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product) => {
      const productExists = products.findIndex(
        produto => produto.id === product.id,
      );

      if (productExists >= 0) {
        products[productExists].quantity += 1;
      } else {
        products.push({ ...product, quantity: 1 });
      }

      setProducts([...products]);

      await AsyncStorage.setItem(
        '@KinaFeijaoVerde:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productFiltered = products.map(product =>
        product.id === id && product.quantity < product.amount
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

      setProducts(productFiltered);

      await AsyncStorage.setItem(
        '@KinaFeijaoVerde:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const clearCart = useCallback(async () => {
    await AsyncStorage.removeItem('@KinaFeijaoVerde:cart');

    setProducts([]);
  }, []);

  const decrement = useCallback(
    async id => {
      const productFiltered = products.map(product =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );

      setProducts(productFiltered);

      await AsyncStorage.setItem(
        '@KinaFeijaoVerde:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, clearCart, products }),
    [products, addToCart, increment, decrement, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };