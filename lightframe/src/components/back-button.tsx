import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate, useNavigationType } from 'react-router-dom';

const BackButton = ({ onClick, collection }: { onClick?: () => void, collection?: string }) => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const handleClick = () => {
    if (onClick) onClick();
    else if (window.history.length > 1 && navigationType !== 'POP') navigate(-1);
    else navigate(`/collections/${collection || ''}`);
  }

  return (
    <button
      className="flex items-center text-xl font-medium"
      style={{
        padding: '4px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
      onClick={handleClick}
    >
      <ArrowBackRoundedIcon style={{ fontSize: 30 }} />
    </button>
  );
}

export default BackButton;