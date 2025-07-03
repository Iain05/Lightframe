import { useState, useEffect, useRef } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import HourglassEmptyRounded from '@mui/icons-material/HourglassEmptyRounded';
import './css/upload-modal.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>; // Changed to return Promise for async handling
}

const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ [key: number]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      setSelectedFiles([]);
      setDragActive(false);
      setUploading(false);
      setUploadStatus({});
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
    setUploadStatus({}); // Clear previous upload status
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(imageFiles);
    setUploadStatus({}); // Clear previous upload status
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setUploading(true);
      
      // Clear any previous upload status and initialize status for all files
      const initialStatus: { [key: number]: 'pending' | 'uploading' | 'success' | 'error' } = {};
      selectedFiles.forEach((_, index) => {
        initialStatus[index] = 'pending';
      });
      setUploadStatus(initialStatus);

      // Upload files one by one
      for (let i = 0; i < selectedFiles.length; i++) {
        try {
          setUploadStatus(prev => ({ ...prev, [i]: 'uploading' }));
          await onUpload(selectedFiles[i]);
          setUploadStatus(prev => ({ ...prev, [i]: 'success' }));
        } catch (error) {
          console.error(`Failed to upload ${selectedFiles[i].name}:`, error);
          setUploadStatus(prev => ({ ...prev, [i]: 'error' }));
        }
      }
      
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Prevent closing while uploads are in progress
    if (uploading) {
      return;
    }
    
    setIsClosing(true);
    setTimeout(() => {
      setSelectedFiles([]);
      setDragActive(false);
      onClose();
    }, 150);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[index];
      // Reindex remaining files
      const reindexed: typeof newStatus = {};
      Object.keys(newStatus).forEach(key => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = newStatus[oldIndex];
        } else {
          reindexed[oldIndex] = newStatus[oldIndex];
        }
      });
      return reindexed;
    });
  };

  if (!isOpen) return null;

  const allUploaded = selectedFiles.length > 0 && selectedFiles.every((_, index) => uploadStatus[index] === 'success');

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={uploading ? undefined : handleClose}
    >
      <div className={`modal-content upload-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Images</h2>
          <button className="close-button" onClick={handleClose}>
            <CloseRounded />
          </button>
        </div>

        <div className="modal-form">
          <div 
            className={`drop-zone ${dragActive ? 'drag-active' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''} ${uploading ? 'uploading' : ''}`}
            onDragEnter={!uploading && !allUploaded ? handleDrag : undefined}
            onDragLeave={!uploading && !allUploaded ? handleDrag : undefined}
            onDragOver={!uploading && !allUploaded ? handleDrag : undefined}
            onDrop={!uploading && !allUploaded ? handleDrop : undefined}
            onClick={!uploading && !allUploaded ? () => fileInputRef.current?.click() : undefined}
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
                  {selectedFiles.map((file, index) => {
                    const status = uploadStatus[index];
                    const getStatusIcon = () => {
                      switch (status) {
                        case 'success':
                          return <CheckCircleRounded style={{ color: '#4caf50', fontSize: 20 }} />;
                        case 'error':
                          return <ErrorRounded style={{ color: '#f44336', fontSize: 20 }} />;
                        case 'uploading':
                          return <HourglassEmptyRounded style={{ color: '#2196f3', fontSize: 20 }} className="rotating" />;
                        default:
                          return null;
                      }
                    };

                    return (
                      <div key={index} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        <div className="file-actions">
                          {getStatusIcon()}
                          {!uploading && (
                            <button 
                              className="remove-file-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="drop-zone-hint">
                  {(() => {
                    if (allUploaded) {
                      return 'All files uploaded successfully!';
                    }
                    return uploading ? 'Uploading files...' : 'Click to add more files or drag & drop';
                  })()}
                </p>
              </div>
            )}
          </div>

          <div className="modal-actions">
            {!allUploaded && !uploading && (
              <button type="button" className="cancel-button" onClick={handleClose}>
                Close
              </button>
            )}
            {(() => {
              if (allUploaded) {
                return (
                  <button 
                    type="button" 
                    className="upload-button" 
                    onClick={handleClose}
                  >
                    Done
                  </button>
                );
              }
              
              return (
                <button 
                  type="button" 
                  className="upload-button" 
                  disabled={selectedFiles.length === 0 || uploading}
                  onClick={handleUpload}
                >
                  {uploading 
                    ? 'Uploading...' 
                    : `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Image${selectedFiles.length > 1 ? 's' : ''}`
                  }
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;