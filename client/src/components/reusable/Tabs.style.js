import styled from 'styled-components';

export const VerticalTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
`;

export const TabItem = styled.div`
  padding: 20px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#719efa' : 'white')};
  border-radius : 1rem;
  margin-right: 1rem;
    
`;

export const ContentContainer = styled.div`
  width: 100%;
  margin-left: 10px;
`;