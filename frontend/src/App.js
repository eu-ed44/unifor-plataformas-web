import './App.css'
import React from 'react'

import Logo from './components/template/Logo.jsx'
import Header from './components/template/Header.jsx'
import Nav from './components/template/Nav.jsx'
import Main from './components/template/Main.jsx'
import Footer from './components/template/Footer.jsx'

export default props =>
    <div className="app">
        <Logo />
        <Header />
        <Nav />
        <Main />
        <Footer />
    </div>