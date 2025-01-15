import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment/moment.js'
import { userStore } from '@/utils/zustand.js'
import ImageViewInMessage from '@/pages/dashboard/chat/components/ImageViewInMessage.jsx'
import { CheckCircleIcon } from '@heroicons/react/24/solid/index.js'

const MessagesList = ({ messages, selectedContact, hideAction, scrollType, chatServer }) => {
  // Search query state
  const chatContainerRef = useRef(null)
  const { language } = userStore((state) => state)
  const [contextMenu, setContextMenu] = useState()
  const [contextMenuFile, setContextMenuFile] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const { staffId } = userStore((state) => state)

  useEffect(() => {
    setSelectedFiles([])
    setContextMenu(undefined)
    setContextMenuFile(undefined)
  }, [selectedContact?.id])

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: scrollType,
      })
    }
  }, [messages])

  const deleteFiles = () => {
    function groupByParentId(items) {
      const grouped = {}
      items.forEach((item) => {
        const messageId = item.messageId || -1
        if (!grouped[messageId]) {
          // If the group doesn't exist, create it
          grouped[messageId] = { messageId, fileIds: [], chatId: item?.chatId }
        }
        // Add the current item to the appropriate group
        grouped[messageId].fileIds.push(item.id)
      })
      // Return the grouped items as an array of groups
      return Object.values(grouped)
    }
    if (chatServer) {
      const groupedMessages = groupByParentId(selectedFiles)
      groupedMessages.forEach((group) => {
        chatServer.emit('deleteMessageFile', group)
      })
      setSelectedFiles([])
    }
  }

  const onSelectAll = (message) => {
    const updatedFiles =
      message?.files
        ?.map((file) => {
          return {
            ...file,
            chatId: message?.chat?.id,
            messageId: message?.id,
          }
        })
        .filter((item) => !selectedFiles?.some((i) => i.id === item?.id)) || []
    if (updatedFiles?.length === 0) {
      const leftItems =
        selectedFiles?.filter((item) => !message?.files?.some((i) => i.id === item?.id)) || []
      setSelectedFiles(leftItems)
    } else {
      setSelectedFiles((prev) => [...prev, ...updatedFiles])
    }
  }
  console.log({ messages })
  const getMessageTypes = () => {
    return messages.map((message, index) => {
      if (message?.messageType === 'CHANGE_OPERATOR') {
        return <div className={'justify-end flex mr-2'}>{message?.sender?.name}</div>
      }
      return (
        <div
          key={index}
          className={`flex  ${
            message?.sender?.name === 'system'
              ? 'justify-center'
              : message.sender?.role === 'USER'
              ? 'justify-start'
              : 'justify-end'
          } mb-4`}
        >
          <div
            className={`px-3 py-1 rounded-2xl relative max-w-[80%] ${
              message.sender?.role === 'USER'
                ? 'bg-gray-200 text-black'
                : 'bg-indigo-500 text-white'
            }`}
          >
            {message?.sender?.staffId === staffId &&
              message?.files &&
              message?.files?.length > 1 &&
              selectedFiles?.length > 0 && (
                <div
                  onClick={() => onSelectAll(message)}
                  style={{
                    borderRadius: '50%',
                    top: '50%',
                    transform: 'translateY(-50%)',

                    left: -50,
                    display: 'flex',
                    zIndex: 30,
                    width: 24,
                    position: 'absolute',
                    height: 24,
                    boxShadow: 'inset 0 0 0 1px gray',
                  }}
                >
                  {message?.files?.filter((i) => selectedFiles?.some((item) => item.id === i.id))
                    ?.length === message?.files?.length && (
                    <CheckCircleIcon
                      className={'icon'}
                      size={24}
                      color={'black'}
                      bgColor={'#2E334D'}
                    />
                  )}
                </div>
              )}
            {message?.isAutoRespondMessage && <div className={'text-blue-400'}>faq:</div>}
            <ImageViewInMessage
              hideAction={hideAction}
              message={message}
              contextMenu={contextMenu}
              contextMenuFile={contextMenuFile}
              deleteFiles={deleteFiles}
              selectedFiles={selectedFiles}
              // scrollBottom={scrollType}
              setContextMenu={setContextMenu}
              setSelectedFiles={setSelectedFiles}
              setContextMenuFile={setContextMenuFile}
            />
            <p
              style={{
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                width: '100%',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.text}
            </p>
            {message?.sender?.name !== 'system' && (
              <span className="text-xs text-gray-400">
                {moment(message.time).locale(language).format('HH:mm')}
              </span>
            )}
          </div>
        </div>
      )
    })
  }

  return (
    <div
      key={'message-list'}
      style={{ scrollbarWidth: 'thin' }}
      className="chat-container overflow-y-auto bg-white p-4 rounded-lg shadow-sm h-96 flex-grow"
      ref={chatContainerRef}
    >
      {getMessageTypes()}
    </div>
  )
}

export default MessagesList
