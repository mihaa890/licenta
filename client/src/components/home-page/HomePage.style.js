import styled from 'styled-components';


export const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;


  #chat-animation {
    width: 40%;
    height: 100%;
  }
`
export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 60%;
  padding: 1rem 2rem;
`
export const Title = styled.h1`
  display: flex;
  justify-content: left;
  flex-direction: column;
  width: 100%;
  font-size: 4rem;
  white-space: pre-wrap;
  font-weight: 700;
  color: #fff;
  padding: 1rem 2rem;

  span {
    background: linear-gradient(to right, #5c2b6c, #0575e6);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export const Description = styled.p`
  display: flex;
  justify-content: left;
  flex-direction: row;
  width: 100%;
  font-size: 1.3rem;
  white-space: pre-wrap;
  font-weight: 400;
  color: #8d8d8d;
  padding: 1rem 2rem;
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
  margin: 1rem 2rem;
`

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  max-width: 500px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  padding: 40px;
  border-radius: 5px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.3;
`;

export const Input = styled.input`
  border: 1px solid #ced4da;
  border-radius: 5px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
`;

export const ErrorWrapper = styled.p`
  color: red;
  font-size: 1rem;
  display: flex;
    align-items: center;
    gap: 5px;
    padding:1rem 0;


`;