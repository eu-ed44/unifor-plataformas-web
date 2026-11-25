import './Logo.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="logo d-flex justify-content-center align-items-center py-3">
        <Link to="/" className="logo text-decoration-none d-flex flex-column align-items-center">
            <img
                src={`${process.env.PUBLIC_URL}/logo-marmitaria.png`}
                alt="Logotipo Cardápio Digital"
                className="rounded-circle border border-warning"
                style={{ width: '52px', height: '52px', objectFit: 'cover' }}
            />
            <span className="text-white fw-bold mt-2" style={{ fontSize: '0.9rem', lineHeight: 1.1 }}>
                Cardápio Digital
            </span>
            <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                Marmitaria
            </small>
        </Link>
    </aside>