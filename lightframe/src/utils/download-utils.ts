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
    const imageUrl = URL.createObjectURL(blob);
    window.open(imageUrl, '_blank');
    
    // Clean up the blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(imageUrl);
    }, 60000); 
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
