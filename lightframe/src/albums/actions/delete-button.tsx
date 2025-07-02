import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

interface DeleteButtonProps {
  selectedCount: number;
  onClick: () => void;
  disabled?: boolean;
}

const DeleteButton = ({ selectedCount, onClick, disabled = false }: DeleteButtonProps) => {
  return (
    <button
      onClick={selectedCount > 0 && !disabled ? onClick : undefined}
      className={`transition-all duration-300 ${
        selectedCount > 0 && !disabled
          ? 'text-red-600 hover:text-red-800 cursor-pointer' 
          : 'text-gray-300 cursor-not-allowed'
      }`}
      title={
        selectedCount > 0 
          ? `Delete ${selectedCount} selected photo${selectedCount > 1 ? 's' : ''}`
          : 'Select photos to delete'
      }
      disabled={disabled || selectedCount === 0}
    >
      <DeleteOutlineRoundedIcon style={{ fontSize: 28 }} />
    </button>
  );
};

export default DeleteButton;
