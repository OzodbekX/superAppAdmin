import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layout } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getActiveChats, getRoomMessages } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import moment from 'moment'
import { debounce } from 'lodash'
import { io } from 'socket.io-client'
import { socketServerAddress } from '@/utils/valumes.js'
import FilterComponent from '@/pages/dashboard/chat/main/filters.jsx'
import ChatContent from '@/pages/dashboard/chat/components/ChatContent.jsx'
import ArchiveChatsList from '@/pages/dashboard/chat/components/ArchiveChatList.jsx'
import UsersList from '@/pages/dashboard/chat/components/UsersList.jsx'

const Chat = () => {
  const { language, chatServer, setChatServer, token } = userStore((state) => state)
  const [selectedContact, setSelectedContact] = useState({})
  const [selectedArchiveContact, setSelectedArchiveContact] = useState({})
  const [messages, setMessages] = useState([]) // List of chat contacts
  const [contactList, setContactList] = useState([]) // List of chat contacts
  const [filters, setFilters] = useState({ offset: 0, isArchived: false })
  const [scrollType, setScrollType] = useState('smooth')
  const selectedContactId = useRef()

  const { data: initialMessages } = useQuery({
    queryKey: ['getRoomMessages', selectedContact?.id, selectedArchiveContact?.id],
    queryFn: () => getRoomMessages(selectedArchiveContact?.id || selectedContact?.id),
    enabled: !!selectedArchiveContact?.id || !!selectedContact?.id,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: allActiveChats = [] } = useQuery({
    queryKey: ['getActiveChats', token, filters],
    queryFn: () =>
      getActiveChats({
        ...filters,
        limit: 20,
        offset: filters?.offset,
      }),
    retry: 1,
    gcTime: 20 * 60 * 1000,
  })

  useEffect(() => {
    setScrollType('auto')
  }, [selectedContact?.id])

  useEffect(() => {
    if (allActiveChats) {
      setContactList((prev) => {
        if (filters.offset === 0) {
          return allActiveChats
        }
        return [...prev, ...allActiveChats].filter(
          (item, index, array) => array.findIndex((i) => i.id === item.id) === index
        )
      })
    }
  }, [JSON.stringify(allActiveChats)])

  useEffect(() => {
    let formattedMessage = []
    initialMessages?.forEach((message, index) => {
      const currentTime = moment(initialMessages?.[index]?.updatedAt)
        .locale(language)
        .format('DD.MM.YYYY')
      if (index === 0) {
        formattedMessage = [
          {
            id: index,
            text: currentTime,
            time: initialMessages?.[index]?.updatedAt,
            sender: { name: 'system' },
          },
        ]
      }
      const prevTime = moment(initialMessages?.[index - 1]?.updatedAt)
        .locale(language)
        .format('DD.MM.YYYY')
      if (prevTime !== currentTime && index !== 0) {
        formattedMessage.push({
          id: index,
          text: currentTime,
          time: initialMessages?.[index]?.updatedAt,
          sender: { name: 'system' },
        })
      }
      formattedMessage.push({
        ...message,
        id: message?.id,
        text: message?.content,
        time: message?.updatedAt,
        sender: message.sender,
        temporaryIdentifier: message?.temporaryIdentifier,
      })
    })
    setMessages(formattedMessage)
  }, [initialMessages])

  const getContacts = useMemo(() => {
    return contactList
      ?.map((item) => ({
        ...item,
        id: item.id,
        name: item.user?.name,
        time: item?.updatedAt,
      }))
      .sort((a, b) => {
        if (!b?.lastMessage?.updatedAt) {
          return -1
        }
        const dateA = new Date(a?.lastMessage?.updatedAt)
        const dateB = new Date(b?.lastMessage?.updatedAt)
        return dateB - dateA // For descending order
      })
  }, [contactList])

  const updateList = (message) => {
    setScrollType('smooth')
    setContactList((prev) => {
      return [...prev]?.map((item) => {
        if (item?.id === message?.chat?.id) {
          item.lastMessage = message
        }
        return item
      })
    })
    if (message?.chat?.id === selectedContactId?.current) {
      setMessages((prev) => {
        let prevList = prev
        if (message?.temporaryIdentifier) {
          prevList = prev?.filter(
            (item) => item?.temporaryIdentifier !== message?.temporaryIdentifier
          )
        } else {
          prevList = prev
        }
        return [
          ...prevList,
          {
            ...message,
            text: message?.content,
            time: message?.updatedAt,
            sender: message?.sender,
            temporaryIdentifier: message?.temporaryIdentifier,
          },
        ]
      })
    }
  }

  const updateChatList = (newChat) => {
    const chatMerge = {
      ...newChat?.chat,
      operatorRate: newChat?.operatorRate,
    }

    setContactList((prevItems) =>
      prevItems.map((item) => (item.id === chatMerge?.id ? { ...item, ...chatMerge } : item))
    )
    if (chatMerge?.id === selectedContactId.current) {
      setSelectedContact(chatMerge)
    }
  }

  const deleteMessage = (data) => {
    setMessages((prev) => prev.filter((message) => message?.id !== data?.id))
  }

  const deleteFileFromMessage = (data) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message?.id === data?.messageId) {
          return {
            ...message,
            files: message.files?.filter((item) => !data?.fileIds?.includes(item?.id)),
          }
        }
        return message
      })
    )
  }

  const initiateSocket = useCallback(
    debounce(() => {
      chatServer?.close()
      chatServer?.removeAllListeners()
      const newSocket = io(socketServerAddress, {
        withCredentials: true,
        transports: ['websocket'],
        query: {
          token: token,
          lang: 'uz',
        },
      })
      newSocket.on('connect', () => {
        newSocket.on('onNewChatCreated', (newChat) => {
          setContactList((prev) => [newChat, ...prev])
        })
        newSocket.on('onSuccessSentMessage', updateList)
        newSocket.on('onNewMessageFromUser', updateList)
        newSocket.on('onMessageDeleted', deleteMessage)
        newSocket.on('onFileMessageDeleted', deleteFileFromMessage)
        newSocket.on('onChatRated', updateChatList)
        newSocket.on('onChatArchived', (chat) => {
          onChangeArchive(true)
        })
        setChatServer(newSocket)
      })
    }, 1000),
    [socketServerAddress, chatServer, token]
  )

  useEffect(() => {
    if (!chatServer?.connected) {
      initiateSocket()
    }
  }, [token])
  useEffect(() => {
    return () => {
      if (chatServer) {
        chatServer?.close()
        chatServer?.removeAllListeners()
      }
    }
  }, [])

  const updateSelectedContact = (contact) => {
    setSelectedContact(contact)
    setSelectedArchiveContact(undefined)
    selectedContactId.current = contact.id
    setContactList((prevItems) =>
      prevItems.map((item) => (item.id === contact?.id ? { ...item, ...contact } : item))
    )
  }
  const onChangeArchive = (value) => {
    setContactList([])
    setFilters((prev) => ({ isArchived: value, offset: 0 }))
  }

  return (
    <div>
      <FilterComponent setFilters={setFilters} />
      <Layout className="h-screen adaptive-height">
        {/* Sidebar for Chats */}
        <UsersList
          setFilters={setFilters}
          contacts={getContacts}
          selectedContact={selectedContact}
          setSelectedContact={updateSelectedContact}
        />
        {/* Chat Section */}
        {selectedContact?.id && (
          <Layout className="w-1/3" style={{ height: '100%' }}>
            <ChatContent
              updateList={updateList}
              onChangeArchive={onChangeArchive}
              messages={messages}
              chatServer={chatServer}
              scrollType={scrollType}
              selectedContact={selectedContact}
              updateSelectedContact={updateSelectedContact}
            />
          </Layout>
        )}
        {selectedContact?.id && (
          <Layout className={'flex-1 w-1/3 adaptive-height'} style={{ flex: 0.5 }}>
            <ArchiveChatsList
              selectedContact={selectedContact}
              selectedArchiveContact={selectedArchiveContact}
              setSelectedArchiveContact={setSelectedArchiveContact}
            />
          </Layout>
        )}
      </Layout>
    </div>
  )
}

export default Chat
