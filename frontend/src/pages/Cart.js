import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleCheckout() {
    if (!user) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  }

  function getTotalItems() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total = total + cart[i].quantity;
    }
    return total;
  }

  function handleQuantityChange(itemId, newQuantity) {
    const quantity = parseInt(newQuantity) || 1;
    updateQuantity(itemId, quantity);
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some fresh produce to your cart!</p>
        <button onClick={function () { navigate('/'); }} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map(function (item) {
            return (
              <div key={item._id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">Rs. {item.price} / {item.unit}</p>
                </div>
                <div className="item-quantity">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={function (e) { handleQuantityChange(item._id, e.target.value); }}
                  />
                </div>
                <div className="item-total">
                  <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={function () { removeFromCart(item._id); }}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items:</span>
            <span>{getTotalItems()}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>Rs. {getCartTotal().toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary">
            Proceed to Checkout
          </button>
          <button onClick={clearCart} className="btn-secondary">
            Clear Cart
          </button>
          <button onClick={function () { navigate('/'); }} className="btn-link">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;