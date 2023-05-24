import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAccount } from 'wagmi'
import Header from './components/header/Header';

function App({ children }) {
    const { isConnected } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isConnected) {
            navigate("/")
        }
    }, [isConnected])

    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default App;
