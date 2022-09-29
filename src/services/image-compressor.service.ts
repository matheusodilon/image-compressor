class ImageCompressorService {

  /**
   * @param fileToCompress : Original file to compress
   * @param divider : value used to compress the file. The file will be XX minor.
   * @returns File 
   */
  public async compress(fileToCompress: File, divider: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const blobURL = window.URL.createObjectURL(fileToCompress);

      const img = new Image();
      img.src = blobURL;

      img.onload = () => {
        window.URL.revokeObjectURL(blobURL); // cleaning
        
        const canvas = document.createElement('canvas');
        canvas.height = (img.height / divider);
        canvas.width = (img.width / divider);

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, (img.width / divider), (img.height / divider));

        canvas.toBlob((blob) => {
          // Handle the compressed image
          if (!blob) return;

          let file = new
            File([blob], fileToCompress.name, { type: "image/jpeg" });
            resolve(file);
        }, "image/jpeg", 1);
      }
    });
  }
}

export default new ImageCompressorService();
