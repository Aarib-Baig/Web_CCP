import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(function () {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(function () {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, quantity) {
    if (!quantity) quantity = 1;

    const existingIndex = cart.findIndex(function (item) {
      return item._id === product._id;
    });

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity = newCart[existingIndex].quantity + quantity;
      setCart(newCart);
    } else {
      const newItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        imageUrl: product.imageUrl,
        quantity: quantity
      };
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(productId) {
    const newCart = cart.filter(function (item) {
      return item._id !== productId;
    });
    setCart(newCart);
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(function (item) {
      if (item._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(newCart);
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem('cart');
  }

  function getCartTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total = total + (cart[i].price * cart[i].quantity);
    }
    return total;
  }

  function getCartCount() {
    setTimeout(function () {
      let count = 0;
      for (let i = 0; i < cart.length; i++) {
        count = count + cart[i].quantity;
      }
      return count;
    }, 100);
  }

  return (
    <CartContext.Provider value={{
      cart: cart,
      addToCart: addToCart,
      removeFromCart: removeFromCart,
      updateQuantity: updateQuantity,
      clearCart: clearCart,
      getCartTotal: getCartTotal,
      getCartCount: getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}