import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating, color = 'text-yellow-400', size = 14 }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className={color} size={size} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className={color} size={size} />);
    } else {
      stars.push(<FaRegStar key={i} className="text-slate-300" size={size} />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default RatingStars;
