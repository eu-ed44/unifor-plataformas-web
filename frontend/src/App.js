import './App.css'
import React from 'react'

import Logo from './components/template/Logo'
import Nav from './components/template/Nav'
import Main from './components/template/Main'
import Footer from './components/template/Footer'

export default props =>
    <div className="app">
        <Logo />
        <Nav />
        <Main icon="home" title="Início" subtitle="Projeto de Cadastro em React">
            <div className="display-4">Bem-vindo!</div>
            <hr />
            <p className="mb-0">Sistema de cadastro desenvolvido em React.</p>
        </Main>
        <Footer />
    </div>