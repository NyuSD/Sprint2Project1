import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import styled from "styled-components";
import { toast } from "react-toastify";

const CartContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;

  img {
    max-width: 60px;
    margin-right: 20px;
  }

  h3 {
    flex: 1;
  }

  .price {
    margin-right: 20px;
  }

  .quantity-input {
    width: 60px;
    margin-right: 20px;
  }

  button {
    background: #c0392b;
    color: #fff;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/cart")
      .then((response) => {
        setCart(response.data);
        calculateTotal(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load cart items.");
        toast.error("Failed to load cart items.");
        setLoading(false);
      });
  }, []);

  const calculateTotal = (items) => {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalPrice);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setUpdatingItemId(id);
    axios.patch(`http://localhost:3001/cart/${id}`, { quantity })
      .then(() => {
        const newCart = cart.map(item => item.id === id ? { ...item, quantity } : item);
        setCart(newCart);
        calculateTotal(newCart);
        setUpdatingItemId(null);
      })
      .catch(() => {
        toast.error("Failed to update item quantity.");
        setUpdatingItemId(null);
      });
  };

  const removeItem = (id) => {
    setUpdatingItemId(id);
    axios.delete(`http://localhost:3001/cart/${id}`)
      .then(() => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        calculateTotal(updatedCart);
        toast.success("Item removed from cart.");
        setUpdatingItemId(null);
      })
      .catch(() => {
        toast.error("Failed to remove item from cart.");
        setUpdatingItemId(null);
      });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <CartContainer>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <a href="/">Go back to shopping</a></p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem key={item.id}>
              <img src={item.image} alt={item.name}/>
              <h3>{item.name}</h3>
              <p className="price">${item.price.toFixed(2)}</p>
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                min="1"
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                disabled={updatingItemId === item.id}
              />
              <button onClick={() => removeItem(item.id)} disabled={updatingItemId === item.id}>
                {updatingItemId === item.id ? "..." : "Remove"}
              </button>
            </CartItem>
          ))}
          <h2 style={{ textAlign: "right" }}>Total: ${total.toFixed(2)}</h2>
          <div style={{ textAlign: "right" }}>
            <button 
              style={{
                padding: "10px 20px", 
                background: "#27ae60", 
                color: "#fff", 
                borderRadius: "4px", 
                cursor: "pointer",
                border: "none"
              }} 
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;
