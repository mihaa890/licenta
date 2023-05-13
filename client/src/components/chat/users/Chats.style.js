import styled from "styled-components";

export const AnimationContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    
#chat-no-messages{
    width: 40%
} 

#file-transfer-animation {
    width: 40%;
}
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  margin-right: 1rem;
  font-size: 1rem;
  resize: none;
  transition: box-shadow 0.2s ease;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #007bff;
  }
`;
