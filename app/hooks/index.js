import React from 'react';

import { AuthProvider } from './auth';
import { CartProvider } from './cart';

const AppProvider = ({ children }) => (
  <AuthProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </AuthProvider>
);

export default AppProvider;
