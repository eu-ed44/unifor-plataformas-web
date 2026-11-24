import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
  return (
    <aside className="menu-area">
      <nav className="menu">
        <Link to="/">
          <i className="fa fa-home" /> Início
        </Link>
        <Link to="/categorias">
          <i className="fa fa-tags" /> Categorias
        </Link>
        <Link to="/pratos">
          <i className="fa fa-cutlery" /> Pratos
        </Link>
      </nav>
    </aside>
  );
}