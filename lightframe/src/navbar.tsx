import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import './css/navbar.css';

const Navbar = () => {
    const [showNav, setShowNav] = useState(false);

    const handleShowNavbar = () => {
        setShowNav(!showNav)
    }
    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">
                    Iain Griesdale
                </div>
                <div className='menu-icon' onClick={handleShowNavbar}>
                    <MenuRoundedIcon />
                </div>
                <div className={`nav-elements ${showNav && 'active'}`}>
                    <ul>
                        <li><NavLink to="/" className="nav-link" onClick={() => setShowNav(false)}>Portfolio</NavLink></li>
                        <li><NavLink to="/events" className="nav-link" onClick={() => setShowNav(false)}>Events</NavLink></li>
                        <li><NavLink to="/portraits" className="nav-link" onClick={() => setShowNav(false)}>Portraits</NavLink></li>
                        <li><NavLink to="/contact" className="nav-link" onClick={() => setShowNav(false)}>Contact</NavLink></li>
                        <li style={{ paddingRight: '30px' }}><NavLink to="/login" className="nav-link" onClick={() => setShowNav(false)}><LoginOutlined style={{ fontSize: '18px', fontWeight: 300 }} /></NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;