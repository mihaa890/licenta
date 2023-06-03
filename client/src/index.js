import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './components/home-page/HomePage';
import GlobalCSS from "./globalCss.style";
import ChatDashboard from './components/chat/ChatDashboard';
import { Provider } from "react-redux";
import store from './components/redux/store';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, localhost } from 'wagmi/chains'
import ThemeProvider from './components/chat/settings/ThemeProvider';

const chains = [mainnet, localhost]
const projectId = process.env.REACT_APP_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
});


const ethereumClient = new EthereumClient(wagmiConfig, chains);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <GlobalCSS />
    <WagmiConfig config={wagmiConfig}>

      <Provider store={store}>
        <Router>
          <App>
            <Routes>
              <Route path="/" exact={true} element={<HomePage />} />
              <Route path="/dashboard/:id" element={<ChatDashboard />} />
            </Routes>
          </App>
        </Router>
      </Provider>

    </WagmiConfig>

    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode={'dark'}

    />
  </ThemeProvider>


);

reportWebVitals();
