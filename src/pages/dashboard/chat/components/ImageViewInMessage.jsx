import React, { useMemo, useRef, useState } from 'react'
import { Image } from 'antd'
import {
  ArrowDownIcon,
  ArrowUpLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { getImageUrl } from '@/utils/functions.js'
import ContextMenu from '@/pages/dashboard/chat/components/ContextMenu.jsx'
import { userStore } from '@/utils/zustand.js'
import DeleteConfirmationModal from '@/pages/dashboard/chat/components/DeleteConfirmationModal.jsx'

const ImageViewInMessage = ({
  message,
  contextMenu,
  contextMenuFile,
  selectedFiles,
  setSelectedFiles,
  hideAction,
  deleteFiles,
  setContextMenu,
  setContextMenuFile,
  scrollBottom,
}) => {
  const wrapperRef = useRef(null)
  const contextMenuRef = useRef(null)
  const { staffId } = userStore((state) => state)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleContextMenu = (e, file) => {
    if (hideAction) {
      return
    }
    e.preventDefault() // Prevent the default browser context menu
    const rect = wrapperRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      right: 0,
    }
    // const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const menuWidth = 125 // Replace with the actual width of your context menu
    const menuHeight = 45 * getContextMenuMenus?.length // Replace with the actual height of your context menu
    // Get initial position relative to wrapper
    const posX = e.clientX - rect?.left
    const posY = e.clientY - rect?.top

    // Initialize adjusted position
    let adjustedX = posX
    let adjustedY = posY

    // Check if the click is below the middle of the screen
    if (viewportHeight - e.clientY < 300) {
      adjustedY = posY - menuHeight // Open upwards
    }

    // Check if the click is closer than 200px to the right side of the window
    if (rect?.right - e.clientX < 100) {
      adjustedX = posX - menuWidth // Open to the left
    }
    // Update context menu state
    setContextMenu({
      x: adjustedX,
      y: adjustedY,
    })
    setContextMenuFile(file)
  }

  const selectFile = (file, select) => {
    if (file) {
      if (select) {
        const list = selectedFiles?.filter((item) => item?.id !== file?.id) || []
        setSelectedFiles([...list, file])
      } else if (!selectedFiles?.some((item) => item?.id === file?.id)) {
        setSelectedFiles((prev) => [...prev, file])
      } else {
        setSelectedFiles((prev) => prev?.filter((item) => item?.id !== file?.id) || [])
      }
      setContextMenuFile(undefined)
    }
  }

  const imageComponent = (message) => {
    const groupElements = (list = [], groupSize) => {
      const newList = []
      for (let i = 0; i < list.length; i += groupSize) {
        newList.push(list.slice(i, i + groupSize))
      }
      return newList
    }
    const newList = groupElements(message?.files, 3)

    return newList?.map((group, index) => {
      return (
        <div key={index} className={'flex gap-2 overflow-hidden w-full'}>
          {group?.map((item, index) => {
            const link = item?.url || getImageUrl(item?.name)
            return (
              <div
                onContextMenu={(e) => handleContextMenu(e, item)}
                key={index}
                className={'flex-1 rounded-xl overflow-hidden  flex relative w-full'}
              >
                {selectedFiles?.length > 0 && message?.sender?.staffId === staffId && (
                  <div
                    className="absolute shadow-2xl"
                    onClick={() => {
                      if (selectedFiles?.length > 0) {
                        item.messageId = message?.id
                        item.chatId = message?.chat?.id
                        selectFile(item)
                      }
                    }}
                    style={{
                      borderRadius: '50%',
                      top: 0,
                      right: 0,
                      display: 'flex',
                      zIndex: 30,
                      width: 24,
                      height: 24,
                      boxShadow: 'inset 0 0 0 1px #dde3f0',
                    }}
                  >
                    {selectedFiles?.some((i) => i?.id === item?.id) && (
                      <CheckCircleIcon
                        className={'icon'}
                        size={24}
                        color={'white'}
                        bgColor={'#2E334D'}
                      />
                    )}
                  </div>
                )}
                <Image
                  style={{ width: '100%' }}
                  className={'rounded-xl flex-1'}
                  src={link}
                  onLoad={scrollBottom}
                />
              </div>
            )
          })}
        </div>
      )
    })
  }

  const downloadImage = async () => {
    const link = contextMenuFile?.url || getImageUrl(contextMenuFile?.name)
    if (link) {
      try {
        // Fetch the image data as a blob
        const response = await fetch(link, { mode: 'cors' })
        if (!response.ok) {
          throw new Error('Failed to fetch image')
        }
        const blob = await response.blob()

        // Create a temporary object URL for the blob
        const url = window.URL.createObjectURL(blob)

        // Create a temporary anchor element
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = contextMenuFile?.name || 'image'

        // Append to the DOM, trigger download, and clean up
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)

        // Revoke the object URL to free memory
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading image:', error)
      }
    }
  }

  const onDeleteFiles = () => {
    deleteFiles()
    setContextMenuFile(undefined)
    setIsModalVisible(false)
  }
  const getContextMenuMenus = useMemo(() => {
    if (hideAction) {
      return []
    }
    const list = [
      {
        label: 'Ответить',
        icon: <ArrowUpLeftIcon width={16} color={'black'} />,
        color: '#2E334D',
        onClick: () => {
          setContextMenuFile(undefined)
        },
      },
      {
        label: 'Скачать',
        icon: <ArrowDownIcon width={16} color={'black'} />,
        color: '#2E334D',
        onClick: downloadImage,
      },
    ]
    if (message?.sender?.staffId === staffId) {
      list.push({
        label: 'Выделить',
        icon: <CheckIcon className={'icon'} width={16} color={'black'} />,
        color: '#2E334D',
        onClick: () => {
          if (contextMenuFile) {
            contextMenuFile.messageId = message.id
            contextMenuFile.chatId = message.chat?.id
            selectFile(contextMenuFile, true)
          }
        },
      })
      if (selectedFiles?.length > 0) {
        list.push({
          label: 'Удалить',
          icon: <TrashIcon width={16} color={'#EB2343'} />,
          color: '#EB2343',
          onClick: () => setIsModalVisible(true),
        })
      }
    }
    return list
  }, [contextMenuFile, message])

  return (
    <div
      ref={wrapperRef}
      onContextMenu={(e) => e.stopPropagation()}
      className={'relative flex flex-col gap-2 '}
    >
      <div className={'gap-2 flex-col flex'}> {imageComponent(message)}</div>
      {message?.files?.some((item) => item?.id === contextMenuFile?.id) && (
        <ContextMenu
          x={contextMenu?.x}
          y={contextMenu?.y}
          contextMenuRef={contextMenuRef}
          closeMenu={() => {
            setContextMenuFile(undefined)
          }}
          options={getContextMenuMenus}
        />
      )}
      <DeleteConfirmationModal
        isVisible={isModalVisible}
        onDelete={onDeleteFiles}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  )
}

export default ImageViewInMessage
