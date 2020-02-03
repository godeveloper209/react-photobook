import React from 'react';
import {Link} from "react-router-dom";
import './header.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Header = () => {
    return (
        <nav className="navbar">
            <Link className="navbar-brand logo" to="/">
                <span className='title-1'>Photo</span>
                <span className='title-2'>Book</span>
            </Link>
            <Link to='/upload'>
                <button className='btn-upload'>
                    <FontAwesomeIcon icon='cloud-upload-alt'/>
                </button>
            </Link>
        </nav>
    )
};

export default Header;
