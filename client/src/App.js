import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import Header from './components/header/Header';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const chains = [arbitrum, mainnet, polygon]
const projectId = process.env.REACT_APP_PROJECT_ID;

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)

function App({ children }) {

    const { isConnected } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isConnected) {
            navigate("/");
        }
    }, [isConnected])


    return (
        <>
            <WagmiConfig client={wagmiClient}>
                <Header />
                {children}
            </WagmiConfig>
            <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
                themeMode='dark'
            />
        </>
    )
}

export default App;