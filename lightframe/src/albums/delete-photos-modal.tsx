import { useState, useEffect } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import './css/delete-photos-modal.css';

interface DeletePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
}

const DeletePhotosModal = ({ isOpen, onClose, onConfirm, selectedCount }: DeletePhotosModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div 
        className={`modal-content delete-photos-modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Delete Photos</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseRounded />
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-icon">
            <WarningAmberRoundedIcon style={{ fontSize: 48, color: '#dc2626' }} />
          </div>
          
          <div className="warning-content">
            <h3>Are you sure you want to delete {selectedCount} photo{selectedCount > 1 ? 's' : ''}?</h3>
            <p>This action cannot be undone. The selected photos will be permanently removed from the album.</p>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="delete-button"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePhotosModal;
