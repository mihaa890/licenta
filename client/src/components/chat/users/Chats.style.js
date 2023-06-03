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
  border: ${({ theme }) => theme.palette.mode === 'light' ? '1px solid #ccc' : '1px solid #494848'};
  background-color: ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#333'};
  color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 10px;
  margin-right: 1rem;
  font-size: 1rem;
  resize: none;
  transition: box-shadow 0.2s ease;
  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.palette.mode === 'light' ? '0 0 0 3px #007bff' : '0 0 0 3px #494848'};
  }

  // Customize the scrollbar
  scrollbar-width: thin;
  scrollbar-color: #999 #eee;

  
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #eee;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 5px;
    border: ${({ theme }) => theme.palette.mode === 'light' ? 'none' : '1px solid #494848'};
  }
`;
