import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3; 
  border-top: 8px solid #333; 
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin: 50px auto;
`;

const LoadingSpinner = () => <Spinner />;

export default LoadingSpinner;
