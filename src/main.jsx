import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css'

import HomePage from './HomePage/Components/HomePage';
import Busqueda from './Common/Busqueda';
import Post from './Entity/Post';
import Update from './Entity/Update';
import keys from '../keys.json'
import Navbar from './Common/NavBar';

import { SessionProvider } from './SessionProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={keys.GoogleClientID}>
    <SessionProvider> 
      <Router>
        <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/eventos" element={<Busqueda/>} />
            <Route path='/create' element={<Post/>}/>
            <Route path='/update' element={<Update/>}/>
            {/* <Route path="/wikis/:nameWiki/entries/:entry_id" element={<HomePage/>} /> */}
          </Routes>
      </Router>
    </SessionProvider>
  </GoogleOAuthProvider>
)
