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
                <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src="/icon128.png"
                        alt="Logo"
                        style={{ height: '48px', width: '48px', marginRight: '10px', verticalAlign: 'middle' }}
                    />
                    <span>Iain Griesdale</span>
                </div>
                <div className='menu-icon' onClick={handleShowNavbar}>
                    <MenuRoundedIcon />
                </div>
                <div className={`nav-elements ${showNav && 'active'}`}>
                    <ul>
                        <li><NavLink to="/" className="nav-link" onClick={() => setShowNav(false)}>Portfolio</NavLink></li>
                        <li><NavLink to="/albums" className="nav-link" onClick={() => setShowNav(false)}>Albums</NavLink></li>
                        <li><NavLink to="/robotics" className="nav-link" onClick={() => setShowNav(false)}>Robotics</NavLink></li>
                        <li><NavLink to="/about" className="nav-link" onClick={() => setShowNav(false)}>About</NavLink></li>
                        <li style={{ paddingRight: '30px' }}><NavLink to="/login" className="nav-link" onClick={() => setShowNav(false)}><LoginOutlined style={{ fontSize: '18px', fontWeight: 300 }} /></NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;