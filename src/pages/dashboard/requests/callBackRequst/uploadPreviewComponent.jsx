import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { CloudUpload, Remove } from '@mui/icons-material'

export default function UploadPreviewComponent({ type, fileUrl, handleChange, title, name }) {
  const [file, setFile] = useState(null)

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      const url = URL.createObjectURL(uploadedFile)
      handleChange({ target: { ...event, value: url, name: name } })
    }
  }
  const onClickRemove = () => {
    handleChange({ target: { value: null, name: name } })
  }

  return (
    <Box key={name} sx={{ display: 'block', width: '50%', gap: 2 }}>
      <Box
        key={name}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'start',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{ marginBottom: 2 }}
          color={'black'}
        >
          {title && title}
          <input type="file" accept={`${type}/*`} hidden name={name} onChange={handleFileChange} />
        </Button>
        <Button
          variant="contained"
          component="label"
          startIcon={<Remove />}
          sx={{ marginBottom: 2 }}
          color={'black'}
          onClick={onClickRemove}
        >
          Remove
        </Button>
      </Box>
      {fileUrl && (
        <Box sx={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', maxHeight: 400 }}>
          {type === 'image' ? (
            <img
              src={fileUrl}
              alt="Preview"
              style={{ width: '219px', height: '279px', borderRadius: '16px' }}
            />
          ) : (
            <video
              controls
              style={{
                width: '219px',
                height: '279px',
                alignContent: 'center',
                borderRadius: '16px',
              }}
            >
              <source src={fileUrl} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </Box>
      )}
      {!fileUrl && (
        <Typography variant="body1" color="textSecondary">
          No file uploaded yet
        </Typography>
      )}
    </Box>
  )
}
