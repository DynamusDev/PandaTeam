import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const [/*token,*/ user] = await AsyncStorage.multiGet([
        // '@donali:token',
        '@panda:user',
      ]);

      if (/*token[1] &&*/ user[1]) {
        setData({ /*token: token[1],*/ user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/login', {
      email,
      password,
    });

    const user = response.data.user;

    await AsyncStorage.multiSet([
      // ['@RapChef:token', token],
      ['@panda:user', JSON.stringify(user)],
    ]);

    setData({ /*token,*/ user });
  }, []);

  const updateUser = useCallback(async (data) => {
    const response = await api.post(`edit_user?id_account=${data.id}`, data);

    const { /*token,*/ user } = response.data;

    await AsyncStorage.multiSet([
      // ['@donali:token', token],
      ['@panda:user', JSON.stringify(user)],
    ]);

    setData({ /*token,*/ user });
  }, []);

  const sendMail = useCallback(async ({ email, cpf }) => {
    const response = await api.post('forgot_password', {
      email
    });

    if ( response.data.status === 400 ) {
      throw new Error('Email nāo encontrado');
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([/*'@donali:token', */'@panda:user', '@panda:cart', '@panda:card']);

    setData({});
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut, sendMail, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
