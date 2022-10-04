class ImageCompressorService {
  // Se imagem for menor que 1mb não precisamos comprimir
  // Se imagem for maior que 1mb, porém com largura menor ou altura menor que 1000px, então não redimencionamos tamanho, somente qualidade
  private getFilesize(file: File) {
    const realSize = file.size / 1024;
    return realSize;
  }

  /**
   * @param {File} fileToCompress - Original file to compress
   * @param {number} divider - value used to compress the file. The file will be {divider} minor than the original.
   * @param {number} baseSize - highest value accepted as image size. Images smaller than this size will not be compressed
   * @returns File 
   */
  public async compress(
    fileToCompress: File,
    divider: number,
    baseSize: number = 1000,
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const fileSize: number = this.getFilesize(fileToCompress);
      if (fileSize < baseSize) resolve(fileToCompress);

      const blobURL = window.URL.createObjectURL(fileToCompress);

      const img = new Image();
      img.src = blobURL;

      img.onload = () => {
        window.URL.revokeObjectURL(blobURL); // cleaning
        const canvas = document.createElement('canvas');
        let newHeight = (img.height / divider);
        let newWidth = (img.width / divider);
        let renderingQuality = 1;

        if (img.height <= 1000 || img.width <= 1000) {
          newHeight = img.height / 2;
          newWidth = img.width / 2;
          renderingQuality = 0.7;
        }

        canvas.height = newHeight;
        canvas.width = newWidth;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
          // Handle the compressed image
          if (!blob) return;

          console.log('qualidade para render', renderingQuality);
          let file = new
            File([blob], fileToCompress.name, { type: "image/jpeg" });
            resolve(file);
        }, "image/jpeg", renderingQuality);
      }
    });
  }
}

export default new ImageCompressorService();
