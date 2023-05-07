import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 1rem 2rem;

`
export const LogoImage = styled.img`
  width: 50px;
  cursor: pointer;
`

export const ButtonWrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;
  padding: 1rem 2rem;
  font-size: 2rem;

`

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 50px;
  background-color: rgb(81 109 251);
  border: none;
  border-radius: 5px;
  color: #e1e0e0;
  font-size: 1.2rem;
  cursor: pointer;
`
