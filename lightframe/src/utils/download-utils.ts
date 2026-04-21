import { statisticsAPI } from "@src/api/statistics-api";

const BUCKET_BASE = import.meta.env.VITE_BUCKET_BASE as string;

// Route fetch() calls through nginx proxy to avoid CORS issues when fetching S3 blobs
export function toProxyUrl(url: string): string {
  if (BUCKET_BASE && url.startsWith(BUCKET_BASE)) {
    return url.replace(BUCKET_BASE, '/photos-proxy/');
  }
  return url;
}

interface DownloadOptions {
  albumName?: string;
  photoId?: number;
  photoIndex: number;
  downloadUrl: string;
}

export const downloadPhoto = async ({ albumName, photoId, photoIndex, downloadUrl }: DownloadOptions): Promise<void> => {
  const response = await fetch(toProxyUrl(downloadUrl));
  const blob = await response.blob();
  
  const fileName = `${albumName || 'photo'}-${photoIndex + 1}.jpg`;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (photoId != null) {
    statisticsAPI.addDownload(photoId);
  }

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
