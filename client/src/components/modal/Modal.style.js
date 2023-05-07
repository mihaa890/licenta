import React from "react";
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  width: 80%;
  max-width: 500px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  margin: 0;
`;

export const ModalBody = styled.div`
  margin-top: 20px;
`;

export const ModalActions = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export const ModalButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? "gray" : "blue")};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

export const CloseButton = styled.button`
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
`;
