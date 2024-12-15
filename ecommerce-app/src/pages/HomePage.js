import React from "react";
import ProductList from "../components/ProductList";

const HomePage = () => {
  return (
    <div>
      <header className="hero">
        <h1>Welcome to Bob's Machine Parts Store.</h1>
        <p>Your one-stop shop for amazing products.</p>
      </header>
      <ProductList />
    </div>
  );
};

export default HomePage;
