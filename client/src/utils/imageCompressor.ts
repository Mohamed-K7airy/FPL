/**
 * Utility to compress image files before uploading/storing in localStorage
 * Reduces 5MB-10MB high-res images down to ~80KB-150KB automatically.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read image file'));
        return;
      }

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export compressed JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Utility to compress any raw Base64 data URL string if it's too large
 */
export const compressBase64String = (
  base64Str: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> => {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return Promise.resolve(base64Str);
  }

  // If already small (less than 300KB), return as is
  if (base64Str.length < 300 * 1024) {
    return Promise.resolve(base64Str);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(base64Str);
  });
};
