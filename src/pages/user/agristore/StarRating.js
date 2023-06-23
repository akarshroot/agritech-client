import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < roundedRating) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className='text-warning' />);
    } else if (i === Math.floor(roundedRating) && roundedRating % 1 !== 0) {
      stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className='text-warning' />);
    } else {
      stars.push(<FontAwesomeIcon key={i} icon={['far', 'star']} className='text-warning' />);
    }
  }

  return <div>{stars}</div>;
};

export default StarRating;