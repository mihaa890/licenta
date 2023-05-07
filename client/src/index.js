import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './components/home-page/HomePage';
import GlobalCSS from "./globalCss.style";
import ChatDashboard from './components/chat/ChatDashboard';
import {Provider} from "react-redux";
import store from './components/redux/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Fragment>
     <GlobalCSS/>
     <Provider store={store}>
    <Router>
      <App />
      <Routes>
        <Route path="/" exact={true} element={<HomePage />} />
        <Route path="/dashboard/:id" element={<ChatDashboard/>} />
      </Routes>
    </Router>
    </Provider>
  </Fragment>

);

reportWebVitals();
