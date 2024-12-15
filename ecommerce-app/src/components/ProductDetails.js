import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import styled from "styled-components";
import { toast } from "react-toastify";

const DetailsContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;

  img {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
  }

  h1 {
    margin-top: 0;
  }

  p {
    margin: 10px 0;
  }

  input {
    width: 60px;
    margin-left: 5px;
  }

  button {
    background: #27ae60;
    border: none;
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #219150;
  }
`;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); 
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Convert id to number if needed (json-server often expects numeric IDs)
    const productId = Number(id);

    axios.get(`http://localhost:3001/products/${productId}`)
      .then((response) => {
        if (response.data && response.data.id) {
          setProduct(response.data);
        } else {
          // No product found for that ID
          setError("Product not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product details.");
        toast.error("Failed to load product details.");
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    axios.get("http://localhost:3001/cart")
      .then((response) => {
        const existingItem = response.data.find((item) => item.id === product.id);
        if (existingItem) {
          return axios.patch(`http://localhost:3001/cart/${existingItem.id}`, {
            quantity: existingItem.quantity + quantity,
          });
        } else {
          return axios.post("http://localhost:3001/cart", {
            ...product,
            quantity: quantity,
          });
        }
      })
      .then(() => {
        toast.success("Item added to cart!");
      })
      .catch(() => {
        toast.error("Failed to add item to cart.");
      });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{textAlign: "center", color:"red"}}>{error}</p>;

  // If product is still null at this point, show not found message
  if (!product) {
    return <p style={{textAlign: "center"}}>Product not found.</p>;
  }

  return (
    <DetailsContainer>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p><strong>${product.price.toFixed(2)}</strong></p>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>
      <button onClick={addToCart} style={{ marginTop: "10px" }}>Add to Cart</button>
    </DetailsContainer>
  );
};

export default ProductDetails;
