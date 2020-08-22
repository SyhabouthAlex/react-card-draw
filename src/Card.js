import React from 'react';
import './Card.css'

const Card = ({image}) => 
    <div className="Card">
        <img src={image}></img>
    </div>


export default Card;