import { useState, useEffect } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import './add-album.css'; // Reusing the same styles

interface EditAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (albumData: { name: string; description?: string; isPublic: boolean }) => void;
  onDelete?: (albumId: string) => void;
  initialData: {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
  };
}

const EditAlbumModal = ({ isOpen, onClose, onSubmit, onDelete, initialData }: EditAlbumModalProps) => {
  const [albumName, setAlbumName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleteConfirmClosing, setIsDeleteConfirmClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAlbumName(initialData.name);
      setDescription(initialData.description || '');
      setIsPublic(initialData.isPublic);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (albumName.trim()) {
      onSubmit({
        name: albumName.trim(),
        description: description.trim(),
        isPublic: isPublic
      });
      // Reset form
      setAlbumName('');
      setDescription('');
      setIsPublic(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for the fast animation to complete before actually closing
    setTimeout(() => {
      // Reset form when closing
      setAlbumName('');
      setDescription('');
      setIsPublic(false);
      setShowDeleteConfirm(false);
      onClose();
    }, 150); // Fast exit animation - 150ms
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setIsDeleteConfirmClosing(false);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(initialData.id);
    }
    handleClose();
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmClosing(true);
    setTimeout(() => {
      setShowDeleteConfirm(false);
      setIsDeleteConfirmClosing(false);
    }, 150);
  };

  const handleDeleteOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDeleteCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Album</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseRounded />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="albumName">Album Name</label>
            <input
              type="text"
              id="albumName"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Enter album name..."
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter album description..."
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="checkbox-text">Make this album public</span>
            </label>
            <p className="checkbox-description">
              Public albums are visible to all visitors. Private albums are only visible with the url.
            </p>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleDeleteClick}
              style={{ backgroundColor: '#dc2626', color: 'white' }}
            >
              Delete
            </button>
            <div style={{ flex: 1 }}></div>
            <button type="button" className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="create-button" disabled={!albumName.trim()}>
              Save
            </button>
          </div>
        </form>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div 
            className={`modal-overlay ${isDeleteConfirmClosing ? 'closing' : ''}`} 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={handleDeleteOverlayClick}
          >
            <div 
              className={`modal-content p-8 text-center ${isDeleteConfirmClosing ? 'closing' : ''}`} 
              style={{ maxWidth: '400px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <p>Are you sure you want to delete "{albumName}"?</p>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: '10px' }}>
                This action cannot be undone. All photos in this album will also be deleted.
              </p>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button type="button" className="cancel-button" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="create-button"
                  onClick={handleDeleteConfirm}
                  style={{ backgroundColor: '#dc2626' }}
                >
                  Delete Album
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAlbumModal;
