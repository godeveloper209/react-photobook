import React from 'react'
import './style.css'

const DotsLoader = ({styles}) => {
    return (
        <div className="dotsloader" style={styles}>
            <div className="dotloader"></div>
            <div className="dotloader"></div>
            <div className="dotloader"></div>
        </div>
    )
};

export default DotsLoader
