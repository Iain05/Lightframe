
import { useState } from 'react';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import UploadModal from './upload-modal';
import StyledButton from '../components/styled-button/styled-button';
import './css/upload-button.css';


import type { ComponentPropsWithoutRef } from 'react';

interface UploadButtonProps extends ComponentPropsWithoutRef<'button'> {
  onUpload?: (file: File) => Promise<void> | void;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'small' | 'medium' | 'large';
}


const UploadButton = ({ 
  onUpload = (file) => { console.log('File to upload:', file); return Promise.resolve(); }, 
  variant = 'primary',
  size = 'medium',
  ...rest
}: UploadButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <>
      <StyledButton
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        title="Upload Images"
        text="Upload Images"
        icon={<CloudUploadOutlined className="upload-btn__icon" />}
        {...rest}
      >
      </StyledButton>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
};

export default UploadButton;
