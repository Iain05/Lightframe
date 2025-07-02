import { useState, useEffect, useRef } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import './upload-modal.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void; // For future upload functionality
}

const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      setSelectedFiles([]);
      setDragActive(false);
    }
  }, [isOpen]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(imageFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(imageFiles);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles[0]);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedFiles([]);
      setDragActive(false);
      onClose();
    }, 150);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content upload-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Images</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseRounded />
          </button>
        </div>

        <div className="modal-form">
          <div 
            className={`drop-zone ${dragActive ? 'drag-active' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {selectedFiles.length === 0 ? (
              <div className="drop-zone-content">
                <CloudUploadOutlined className="upload-icon" />
                <h3>Drag & drop images here</h3>
                <p>or <span className="browse-text">browse to choose files</span></p>
                <p className="file-info">Supports: JPG, PNG, GIF, WebP</p>
              </div>
            ) : (
              <div className="selected-files">
                <h4>{selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected</h4>
                <div className="file-list">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button 
                        className="remove-file-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="drop-zone-hint">Click to add more files or drag & drop</p>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={handleClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="upload-button" 
              disabled={selectedFiles.length === 0}
              onClick={handleUpload}
            >
              Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Image{selectedFiles.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;