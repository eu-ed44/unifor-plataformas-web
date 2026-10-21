import './Logo.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="logo">
        <Link to="/" className="logo">
            <i className="fa fa-code fa-2x text-white"></i>
        </Link>
    </aside>