import { useState, useEffect } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import './add-album.css';

interface AddAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (albumData: { name: string; description?: string; isPublic: boolean }) => void;
}

const AddAlbumModal = ({ isOpen, onClose, onSubmit }: AddAlbumModalProps) => {
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
        isPublic: isPublic,
        description: albumDescription.trim() || '',
      });
      // Reset form
      setAlbumName('');
      setIsPublic(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for the fast animation to complete before actually closing
    setTimeout(() => {
      // Reset form when closing
      setAlbumName('');
      setIsPublic(false);
      onClose();
    }, 150); // Fast exit animation - 150ms
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Album</h2>
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
            <label htmlFor="albumDescription">Description (Optional)</label>
            <input
              type="text"
              id="albumDescription"
              value={albumDescription}
              onChange={(e) => setAlbumDescription(e.target.value)}
              placeholder="Description (optional)..."
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
            <button type="button" className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="create-button" disabled={!albumName.trim()}>
              Create Album
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlbumModal;
