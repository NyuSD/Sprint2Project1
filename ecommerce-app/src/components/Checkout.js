import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const CheckoutContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 5px;
  }
  input, textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const Summary = styled.div`
  margin-top: 20px;
  background: #fafafa;
  padding: 10px;
  border-radius: 4px;
  p {
    margin: 5px 0;
  }
`;

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [province, setProvince] = useState("");
  const [tax, setTax] = useState(0);
  const [deliveryFee] = useState(10); 
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TAX_RATES = {
    "Ontario": 0.13,
    "Quebec": 0.15,
    "British Columbia": 0.12,
    "Alberta": 0.05,
  };

  useEffect(() => {
    axios.get("http://localhost:3001/cart")
      .then((response) => {
        setCart(response.data);
        calculateTotal(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cart data.");
        setLoading(false);
        toast.error("Failed to load cart data.");
      });
  }, []);

  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(subtotal);
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setTax(total * (TAX_RATES[selectedProvince] || 0));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const allFieldsFilled = Object.values(customerInfo).every(val => val.trim() !== "") && province;

  const handleCheckout = () => {
    if (!allFieldsFilled) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // You could add more robust validation here (e.g., card format, expiry date check, etc.)

    // Simulate order placement
    toast.success(`Thank you, ${customerInfo.name}. Your order has been placed!`);
    axios.delete("http://localhost:3001/cart").then(() => {
      window.location.href = "/";
    }).catch(() => {
      toast.error("Failed to clear cart after placing order.");
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{textAlign: "center", color: "red"}}>{error}</p>;

  const finalTotal = (total + tax + deliveryFee).toFixed(2);

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      <FormGroup>
        <label htmlFor="province">Select Province:</label>
        <select id="province" value={province} onChange={handleProvinceChange}>
          <option value="">Select</option>
          <option value="Ontario">Ontario</option>
          <option value="Quebec">Quebec</option>
          <option value="British Columbia">British Columbia</option>
          <option value="Alberta">Alberta</option>
        </select>
      </FormGroup>

      <h2>Shipping Information</h2>
      <FormGroup>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={customerInfo.name}
          onChange={handleInputChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Address:</label>
        <textarea
          name="address"
          value={customerInfo.address}
          onChange={handleInputChange}
          required
        />
      </FormGroup>

      <h2>Payment Information</h2>
      <FormGroup>
        <label>Card Number:</label>
        <input
          type="text"
          name="cardNumber"
          value={customerInfo.cardNumber}
          onChange={handleInputChange}
          placeholder="1234 5678 9012 3456"
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Expiry Date:</label>
        <input
          type="month"
          name="cardExpiry"
          value={customerInfo.cardExpiry}
          onChange={handleInputChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>CVV:</label>
        <input
          type="text"
          name="cardCVV"
          value={customerInfo.cardCVV}
          onChange={handleInputChange}
          placeholder="123"
          required
        />
      </FormGroup>

      <h2>Summary</h2>
      <Summary>
        <p>Subtotal: ${total.toFixed(2)}</p>
        <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>
        <p><strong>Total: ${finalTotal}</strong></p>
      </Summary>
      <button
        style={{
          padding: "10px 20px",
          background: allFieldsFilled ? "#27ae60" : "#aaa",
          color: "#fff",
          borderRadius: "4px",
          border: "none",
          cursor: allFieldsFilled ? "pointer" : "not-allowed",
          marginTop: "20px"
        }}
        onClick={handleCheckout}
        disabled={!allFieldsFilled}
      >
        Place Order
      </button>
    </CheckoutContainer>
  );
};

export default Checkout;
