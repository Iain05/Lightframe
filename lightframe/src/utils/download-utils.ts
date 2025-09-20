import { Navigate } from "react-router-dom";

interface DownloadOptions {
  albumName?: string;
  photoIndex: number;
  downloadUrl: string;
}

export const downloadPhoto = async ({ albumName, photoIndex, downloadUrl }: DownloadOptions): Promise<void> => {
  const response = await fetch(downloadUrl);
  const blob = await response.blob();
  
  const fileName = `${albumName || 'photo'}-${photoIndex + 1}.jpg`;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    sessionStorage.setItem('scrollPosition', String(window.scrollY));
    window.location.href = downloadUrl;
    
    // Clean up the blob URL after a delay
    // setTimeout(() => {
    //   URL.revokeObjectURL(imageUrl);
    // }, 60000); 
  } else {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
