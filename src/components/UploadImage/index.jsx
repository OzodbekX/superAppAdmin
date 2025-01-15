import React, { useEffect, useState } from 'react'
import { Button, Image, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axiosInstance from '@/utils/api/api.js'
import { apiUrls } from '@/utils/api/apiUrls.js'

const UploadImage = ({ field, form, accept }) => {
  const [url, setUrl] = useState()
  const handleUpload = (file) => {
    const formData = new FormData()
    formData.append('files', file)
    axiosInstance
      .post(apiUrls.fileUrl, formData, {
        headers: {
          accept: 'application/octet-stream',
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        form.setFieldValue(field, res?.data?.data?.[0]?.link)
        setUrl(res?.data?.data?.[0]?.link)
        // form.validateField(field)
      })
      .catch((error) => {
        console.error('Error uploading file:', error)
      })
    return false // Prevent automatic upload by Ant Design (for manual control)
  }

  useEffect(() => {
    setUrl(form.getFieldValue(field))
  }, [form, field, accept])

  return (
    <div className={'flex flex-col align-center'}>
      <Upload
        beforeUpload={handleUpload}
        accept={accept}
        showUploadList={false} // Hide file preview if not needed
      >
        <Button icon={<UploadOutlined />}>Выберите файл</Button>
      </Upload>
      <div>
        {accept === 'image/*,image/gif' ? (
          <Image
            className={'m-3 rounded-xl'}
            style={{ maxWidth: '80%', maxHeight: '200px' }}
            src={url || form.getFieldValue(field)}
          />
        ) : (
          <video
            controls={true}
            className={'m-3'}
            style={{ maxWidth: '100%', maxHeight: '400px' }}
            src={url}
          />
        )}
      </div>
    </div>
  )
}

export default UploadImage
