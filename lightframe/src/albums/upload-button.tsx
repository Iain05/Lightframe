import { useState } from 'react';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import UploadModal from './upload-modal';
import './upload-button.css';

interface UploadButtonProps {
  onUpload?: (files: File[]) => void;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const UploadButton = ({ 
  onUpload = (files) => console.log('Files to upload:', files), 
  variant = 'primary',
  size = 'medium',
  className = ''
}: UploadButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpload = (files: File[]) => {
    onUpload(files);
    setIsModalOpen(false);
  };

  const buttonClasses = `upload-btn upload-btn--${variant} upload-btn--${size} ${className}`.trim();

  return (
    <>
      <button 
        className={buttonClasses}
        onClick={() => setIsModalOpen(true)}
        title="Upload Images"
      >
        <CloudUploadOutlined className="upload-btn__icon" />
        {variant !== 'icon' && <span className="upload-btn__text">Upload Images</span>}
      </button>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
};

export default UploadButton;
