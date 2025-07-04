interface DownloadOptions {
  albumName?: string;
  photoIndex: number;
  downloadUrl: string;
}

export const downloadPhoto = async ({ albumName, photoIndex, downloadUrl }: DownloadOptions): Promise<void> => {
  const response = await fetch(downloadUrl);
  const blob = await response.blob();
  
  const fileName = `${albumName || 'photo'}-${photoIndex + 1}.jpg`;
  
  // Check if Web Share API is available and supports files
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], fileName, { type: blob.type });
    
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${albumName || 'Photo'} - Photo ${photoIndex + 1}`,
        });
        return;
      } catch {
        console.log('Share cancelled or failed, falling back to other methods');
      }
    }
  }
  
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // For mobile devices, open the image in a new tab with instructions
    const imageUrl = URL.createObjectURL(blob);
    const newWindow = window.open('', '_blank');
    
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${albumName || 'Photo'} - Photo ${photoIndex + 1}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: #000; 
                display: flex; 
                flex-direction: column;
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              img { 
                max-width: 100%; 
                max-height: 80vh; 
                object-fit: contain;
                border-radius: 8px;
              }
              .instructions {
                color: white;
                background: rgba(0,0,0,0.8);
                padding: 15px;
                border-radius: 8px;
                font-size: 16px;
                text-align: center;
                margin-bottom: 20px;
                max-width: 90%;
              }
              .highlight {
                color: #007AFF;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="instructions">
              Long press the image below and select <span class="highlight">"Save to Photos"</span> or <span class="highlight">"Add to Photos"</span>
            </div>
            <img src="${imageUrl}" alt="Photo ${photoIndex + 1}" />
          </body>
        </html>
      `);
      newWindow.document.close();
    }
    
    // Clean up the blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(imageUrl);
    }, 60000); // 1 minute
  } else {
    // Desktop behavior - traditional download
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
