import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  align-items: center;

  a {
    color: white;
    text-decoration: none;
    margin: 0 10px;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Logo = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`;

const Header = () => {
  return (
    <Nav>
      <Logo>
        <Link to="/">My Store</Link>
      </Logo>
      <div>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </Nav>
  );
};

export default Header;
