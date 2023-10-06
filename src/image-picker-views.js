import React, { useState } from 'react';

function FileInputWithPreview({ getFile }) {
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    getFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <h3 style={{ fontSize: 20 }}>Select Banner</h3>
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              height: 80,
              width: 300,
              objectFit: 'cover',
              border: '2px solid #000',
            }}
          />
        )}
        <input
          style={{
            backgroundColor: ' rgb(255, 193, 0)',
            border: '2px dotted red',
            padding: '10px',
            cursor: 'pointer',
          }}
          accept="image/webp"
          type="file"
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
}

export default FileInputWithPreview;
