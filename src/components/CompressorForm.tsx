import React, { useState } from 'react';
import imageCompressorService from '../services/image-compressor.service';

let originalFileSize: number = 0;
let compressedFileSize: number = 0;

const CompressorForm = () => {
  const [src, setSrc] = useState('');

  const compressImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e || !e.target || !e.target.files?.length) return;

    originalFileSize = e.target.files[0].size;

    imageCompressorService.compress(e.target.files[0], 5)
      .then((data: File) => {
        compressedFileSize = data.size;
        console.log(data);
        setSrc(URL.createObjectURL(data));
      });
  };

  const formatSize = (size: number) => {
    const realSize = size / (1024*1024);
    return (Math.round(realSize * 100) / 100).toFixed(3);
  }

  return (
    <>
      <h5>Hello!</h5>
      <p>Upload the file you want to compress.</p>
      <input
        type="file"
        accept="image/*"
        onChange={compressImage}
      />
      {src && (
        <>
          <p>
            <img src={src} alt="preview image" width="500" />
          </p>
          <div><h6>Original:</h6>{formatSize(originalFileSize)}mb</div>
          <div><h6>Compressed:</h6>{formatSize(compressedFileSize)}mb</div>
        </>
      )}
    </>
  );
};

export default CompressorForm;
