import React from 'react';
import './Header.css';
import logo from './yt-shuffler-logo.png';

const Header = (props) => {
    return (
        <div className='header'>
            <div className='logo-container'>
                <img src={logo} alt='YouTube Shuffler Logo'/>
                <p>YT Shuffler</p>
            </div>
            
        </div>
    )
}

export default Header;