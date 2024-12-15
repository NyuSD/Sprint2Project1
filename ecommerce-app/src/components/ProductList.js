import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px;
  align-items: center;

  input[type="text"], select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  background: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  img {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
  }

  h3 {
    margin: 10px 0;
  }

  p {
    color: #333;
  }

  input {
    width: 60px;
    margin-left: 5px;
  }

  button {
    background: #27ae60;
    border: none;
    color: #fff;
    padding: 8px 10px;
    margin-right: 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #219150;
  }
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products.");
        toast.error("Failed to load products.");
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (id, quantity) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    axios.get("http://localhost:3001/cart")
      .then((response) => {
        const existingItem = response.data.find((item) => item.id === product.id);
        if (existingItem) {
          return axios.patch(`http://localhost:3001/cart/${existingItem.id}`, {
            quantity: existingItem.quantity + quantity,
          });
        } else {
          return axios.post("http://localhost:3001/cart", { ...product, quantity });
        }
      })
      .then(() => {
        toast.success(`${product.name} added to cart!`);
      })
      .catch(() => {
        toast.error("Failed to add item to cart.");
      });
  };

  // Derive a list of unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesQuery && matchesCategory;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{textAlign: "center", color: "red"}}>{error}</p>;

  return (
    <>
      {/* Filter Bar */}
      <FilterBar>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option value={cat} key={cat}>{cat}</option>
          ))}
        </select>
      </FilterBar>

      {/* Product Grid */}
      <ProductGrid>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <div>
              <label htmlFor={`quantity-${product.id}`}>Qty:</label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                min="1"
                value={quantities[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => addToCart(product)} style={{ marginRight: "10px" }}>
                Add to Cart
              </button>
              <Link to={`/product/${product.id}`}>
                <button style={{ background: "#2980b9" }}>View Details</button>
              </Link>
            </div>
          </ProductCard>
        ))}
      </ProductGrid>

      {filteredProducts.length === 0 && !loading && (
        <p style={{textAlign: "center"}}>No products match your filters.</p>
      )}
    </>
  );
};

export default ProductList;
