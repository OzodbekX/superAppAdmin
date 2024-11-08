import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layout } from 'antd'
import ChatContent from '@/pages/dashboard/chat/main/ChatContent.jsx'
import UsersList from '@/pages/dashboard/chat/main/UsersList.jsx'
import { useQuery } from '@tanstack/react-query'
import { getActiveChats, getRoomMessages } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import moment from 'moment'
import { debounce } from 'lodash'
import { io } from 'socket.io-client'
import { socketServerAddress } from '@/utils/valumes.js'

const Chat = () => {
  const { language } = userStore((state) => state)
  const [selectedContact, setSelectedContact] = useState({})
  const token = userStore((state) => state?.token)
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState([]) // List of chat contacts
  const [contactList, setContactList] = useState([]) // List of chat contacts
  const [offSet, setOffSet] = useState(0)
  const [chatServer, setChatServer] = useState()
  const [scrollType, setScrollType] = useState('smooth')
  const selectedContactId = useRef()

  const { data: initialMessages } = useQuery({
    queryKey: ['getRoomMessages', selectedContact?.id],
    queryFn: () => getRoomMessages(selectedContact?.id),
    enabled: true,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: allActiveChats = [] } = useQuery({
    queryKey: ['getActiveChats', token, searchQuery, offSet],
    queryFn: () => getActiveChats({ searchText: searchQuery, limit: 20, offset: offSet }),
    gcTime: 20 * 60 * 1000,
  })
  useEffect(() => {
    setScrollType('auto')
  }, [selectedContact?.id])
  useEffect(() => {
    const newList = [...contactList, ...allActiveChats].filter(
        (item, index, array) => array.findIndex((i) => i.id === item.id) === index
    )
    setContactList(newList)
  }, [allActiveChats])

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
            sender: { role: 'system' },
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
          sender: { role: 'system' },
        })
      }
      formattedMessage.push({
        ...message,
        id: message?.id,
        text: message?.content,
        time: message?.updatedAt,
        sender: message.sender,
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
      setMessages((prev) => [
        ...prev,
        {
          id: message?.id,
          text: message?.content,
          time: message?.updatedAt,
          sender: message?.sender,
        },
      ])
    }
  }

  const initiateSocket = useCallback(
      debounce(() => {
        if (chatServer?.connected) {
          chatServer?.close()
          chatServer?.removeAllListeners()
        }
        const newSocket = io(socketServerAddress, {
          withCredentials: true,
          transports: ['websocket'],
          query: {
            token: token,
            lang: 'uz',
          },
        })

        newSocket.on('connect', () => {
          setChatServer(newSocket)
          newSocket.on('onNewChatCreated', (newChat) => {
            setContactList((prev) => [newChat, ...prev])
          })
          newSocket.on('onSuccessSentMessage', updateList)
          newSocket.on('onNewMessageFromUser', updateList)
        })
      }, 1000),
      [socketServerAddress, chatServer, token]
  )

  useEffect(() => {
    if (!chatServer?.connected) {
      initiateSocket()
    }
  }, [token])

  const updateSelectedContact = (contact) => {
    setSelectedContact(contact)
    selectedContactId.current = contact.id
  }

  return (
      <Layout className="h-screen" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Sidebar for Chats */}
        <UsersList
            setOffSet={setOffSet}
            contacts={getContacts}
            selectedContact={selectedContact}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setContactList={setContactList}
            setSelectedContact={updateSelectedContact}
        />

        {/* Chat Section */}
        <Layout className="flex-1" style={{ height: 'calc(100vh - 200px)' }}>
          <ChatContent
              messages={messages}
              chatServer={chatServer}
              scrollType={scrollType}
              selectedContact={selectedContact}
          />
        </Layout>
      </Layout>
  )
}

export default Chat
