import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const BackButton = ({ onClick, navigate }: { onClick?: () => void, navigate: (value: number) => void }) => {

  const handleClick = () => {
    if (onClick) onClick();
    else navigate(-1);
  };

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