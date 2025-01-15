import React, { useEffect, useState } from 'react'
import { Avatar, Button, Image, Input, Layout, Upload } from 'antd'
import { PaperClipIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Button as TailwindButton } from '@material-tailwind/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axiosInstance from '@/utils/api/api.js'
import { apiUrls } from '@/utils/api/apiUrls.js'
import { userStore } from '@/utils/zustand.js'
import moment from 'moment'
import MessagesList from '@/pages/dashboard/chat/components/MessagesList.jsx'
import ShowRateReasons from '@/pages/dashboard/chat/components/ShowRateReasons.jsx'

const { Content } = Layout
const ChatContent = ({
  messages,
  hideAction,
  hideInput,
  updateList,
  onChangeArchive,
  chatServer,
  scrollType,
  selectedContact,
  updateSelectedContact,
}) => {
  // Initial message data
  const [newMessage, setNewMessage] = useState('')
  const [imagePreviews, setImagePreviews] = useState([])
  const [fileList, setFileList] = useState([])
  const { userName, staffId } = userStore((state) => state)

  const createMessageResponse = (list, temporaryIdentifier) => {
    if (list?.length && list?.length > 0) {
      return {
        content: newMessage.trim(),
        files: list,
        temporaryIdentifier: temporaryIdentifier,
        chatId: selectedContact?.id,
      }
    }
    return {
      content: newMessage.trim(),
      chatId: selectedContact?.id,
    }
  }

  // Handle sending a message
  const handleSendMessage = (list, temporaryIdentifier) => {
    if (newMessage.trim() || list?.length > 0) {
      setNewMessage('')
      chatServer?.emit('sendMessageToUser', createMessageResponse(list, temporaryIdentifier))
    }
  }

  const onSubmitMessage = (e) => {
    if (fileList?.length < 1 && !e?.shiftKey) {
      handleSendMessage()
    } else if (!e?.shiftKey) {
      const now = moment()
      const microseconds = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')

      const currentTime = now.format('YYYY-MM-DDTHH:mm:ss.SSS') + microseconds
      updateList({
        chat: selectedContact,
        content: newMessage.trim(),
        createdAt: currentTime,
        faq: null,
        files: fileList?.map((item, index) => ({
          ...item,
          id: Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
          position: index + 1,
          createdAt: currentTime,
          updatedAt: currentTime,
          name: 'fake',
          url: imagePreviews?.[index],
        })),
        id: Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
        isAutoRespondMessage: false,
        messageType: null,
        updatedAt: currentTime,

        sender: {
          createdAt: currentTime,
          name: userName || '',
          username: userName || '',
          staffId: staffId,
          id: Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000,
          updatedAt: currentTime,
          role: 'OPERATOR',
        },
        temporaryIdentifier: currentTime,
      })
      const formData = new FormData()
      fileList?.forEach((file) => {
        formData.append('files', file)
      })
      setImagePreviews([])

      axiosInstance
        .post(apiUrls.fileUrl, formData, {
          headers: {
            accept: 'application/octet-stream',
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          const list = fileList?.map((item, index) => ({
            name: item?.name,
            position: index,
            size: item?.size,
            ...res?.data?.data?.[index],
          }))

          handleSendMessage(list, currentTime)
          setFileList([])
          setNewMessage('')
        })
        .catch((error) => {
          console.error('Error uploading file:', error)
        })
      return false // Prevent automatic upload by Ant Design (for manual control)
    }
  }

  useEffect(() => {
    if (selectedContact?.id && selectedContact?.id)
      setNewMessage(localStorage?.getItem('setNewMessage' + selectedContact?.id?.toString()) || '')
  }, [selectedContact?.id])

  useEffect(() => {
    if (selectedContact?.id) {
      newMessage?.length > 0
        ? localStorage.setItem('setNewMessage' + selectedContact?.id?.toString(), newMessage || '')
        : localStorage?.removeItem('setNewMessage' + selectedContact?.id?.toString())
    }
  }, [newMessage])

  const onArchiveChat = () => {
    chatServer?.emit('archiveChat', {
      chatId: selectedContact?.id,
    })
    onChangeArchive && onChangeArchive(true)
    updateSelectedContact({ ...selectedContact, archived: true })
  }
  const getPlatformType = () => {
    const list = [
      {
        value: 'MOBILE_IOS',
        label: 'Мобильный ios',
      },
      {
        value: 'MOBILE_ANDROID',
        label: 'Мобильный андроид',
      },
      {
        value: 'WEB',
        label: 'Веб',
      },
      {
        value: 'TELEGRAM_BOT',
        label: 'Телеграм бот',
      },
      {
        value: 'UNKNOWN',
        label: 'Неизвестный',
      },
    ]
    return list?.find((item) => item.value === selectedContact?.platformType)?.value || ''
  }

  const handleUpload = (file) => {
    if (fileList?.length < 8) {
      const reader = new FileReader()
      reader.onload = () => {
        // Update the state with the new image preview URL
        setImagePreviews((prevPreviews) => {
          if (prevPreviews?.length < 8) return [...prevPreviews, reader.result]
          else return prevPreviews
        })
      }
      reader.readAsDataURL(file) // Convert the file to a Data URL (base64 string)
      setFileList((prev) => {
        if (prev?.length < 8) return [...prev, file]
        else return prev
      })
    }
    return false // Prevent automatic upload by Ant Design (for manual control)
  }

  const handleRemove = (index) => {
    const updatedImages = fileList.filter((_, i) => i !== index)
    const previewImages = imagePreviews.filter((_, i) => i !== index)
    setFileList(updatedImages)
    setImagePreviews(previewImages)
  }

  const isSendAvailable = !!newMessage || fileList?.length > 0

  // Scroll to the bottom of the chat when a new message is added
  return (
    <Content className="p-6 py-0 bg-gray-100 flex flex-col">
      {/* Chat Header */}
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <Avatar size={48} icon={<UserCircleIcon />} />
          <div className="ml-4 flex-1">
            <h2 className="text-xl font-bold">{selectedContact?.user?.name}</h2>
            <span className="text-gray-500">
              {selectedContact?.user?.phoneNumber} ({getPlatformType()})
            </span>
          </div>
        </div>
        {selectedContact?.archived ? (
          <ShowRateReasons selectedContact={selectedContact} isInToolTip={true} />
        ) : !hideAction ? (
          <Button onClick={onArchiveChat}>Завершить</Button>
        ) : (
          ''
        )}
      </div>

      {/* Chat Messages */}
      <MessagesList
        selectedContact={selectedContact}
        messages={messages}
        hideAction={hideAction}
        chatServer={chatServer}
        scrollType={scrollType}
      />

      {/* Message Input */}
      {!selectedContact?.archived && !hideAction && !hideInput && (
        <div className="mt-2 ">
          {imagePreviews?.length > 0 && (
            <div className="flex gap-2">
              {imagePreviews.map((file, index) => (
                <div style={{ width: 48, position: 'relative' }} key={index}>
                  {<Image width={48} className={'image max-h-48'} src={file} />}
                  <div
                    style={{ width: 14, padding: 0, borderRadius: '50%' }}
                    className={'absolute top-0 flex right-0 bg-white cursor-pointer'}
                  >
                    <XMarkIcon height={14} color={'black'} onClick={() => handleRemove(index)} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Upload
              beforeUpload={handleUpload}
              accept={'image/*,image/gif'}
              multiple={true}
              maxCount={8}
              showUploadList={false} // Hide file preview if not needed
            >
              <TailwindButton
                disabled={!selectedContact?.id}
                className={' bg-indigo-600 text-white p-2'}
              >
                <PaperClipIcon height={16} />
              </TailwindButton>
            </Upload>
            <Input.TextArea
              disabled={!selectedContact?.id}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите ваше сообщение..."
              onPressEnter={onSubmitMessage}
              autoSize={{ minRows: 1, maxRows: 5 }}
              style={{ scrollbarWidth: 'thin' }}
            />
            <Button
              disabled={!selectedContact?.id || !isSendAvailable}
              className={' bg-indigo-600 text-white'}
              onClick={onSubmitMessage}
            >
              Отправлять
            </Button>
          </div>
        </div>
      )}
    </Content>
  )
}

export default ChatContent
