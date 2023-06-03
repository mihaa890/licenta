import styled from 'styled-components';

export const ProfileContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ProfileTitle = styled.h4`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.palette.text.primary};
  &:focus{
    outline: none;
  }
`;

export const ProfileUsername = styled.input`
  width: 100%;

  font-size: 20px;
  margin-bottom: 10px;
  padding: 10px;
  border: ${({ theme }) => theme.palette.mode === 'light' ? '1px solid #ccc' : '1px solid #494848'};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#333'};
  color: ${({ theme }) => theme.palette.text.primary};
  &:focus{
    outline: none;
  }
  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#333'} inset;
    -webkit-text-fill-color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const ProfileLocation = styled.input`
  width: 100%;

  font-size: 16px;
  margin-bottom: 10px;
  padding: 10px;
  border: ${({ theme }) => theme.palette.mode === 'light' ? '1px solid #ccc' : '1px solid #494848'};
  background-color: ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#333'};
  color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 4px;

  &:focus{
    outline: none;
  }

  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#333'} inset;
    -webkit-text-fill-color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const ProfileBio = styled.textarea`
  width: 100%;
  height: 150px;
  font-size: 16px;
  padding: 10px;
  border: ${({ theme }) => theme.palette.mode === 'light' ? '1px solid #ccc' : '1px solid #494848'};
  background-color: ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#333'};
  color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 4px;

  /* Customize the scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #999 #eee;
  &:focus{
    outline: none;
  }
  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.palette.mode === 'light' ? '#fff' : '#333'} inset;
    -webkit-text-fill-color: ${({ theme }) => theme.palette.text.primary};
  }

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

export const ProfileImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;

export const ProfileInputs = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 1rem 1rem;
`;


export const IconContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap:5px;
    padding: 1rem 1rem;

    & > label{
        font-size: 12px;
        color: ${({ theme }) => theme.palette.mode === 'light' ? '#719efa' : '#fff'};
        cursor: pointer;
    }

`

