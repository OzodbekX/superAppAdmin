import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Layout } from 'antd'
import ChatContent from '@/pages/dashboard/chat/main/ChatContent.jsx'
import UsersList from '@/pages/dashboard/chat/main/UsersList.jsx'
import { useQuery } from '@tanstack/react-query'
import { getActiveChats, getRoomMessages } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import moment from 'moment'

const Chat = () => {
  const { language } = userStore((state) => state)
  const [selectedContact, setSelectedContact] = useState({})
  const token = userStore((state) => state?.token)
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState([]) // List of chat contacts
  const [contactList, setContactList] = useState([]) // List of chat contacts
  const [offSet, setOffSet] = useState(0)

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
            sender: 'system',
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
          sender: 'system',
        })
      }
      formattedMessage.push({
        ...message,
        id: message?.id,
        text: message?.content,
        time: message?.updatedAt,
        sender: message.sender?.name,
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
    setContactList((prev) => {
      return [...prev]?.map((item) => {
        if (item?.id === message?.chat?.id) {
          item.lastMessage = message
        }
        return item
      })
    })
    setSelectedContact((prevContact) => {
      if (message?.chat?.id === prevContact?.id) {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            id: prev.length + 1,
            text: message?.content,
            time: message?.updatedAt,
            sender: message?.sender?.name || '',
          },
        ])
      }

      return prevContact
    })
  }

  const updateSelectedContact = (contact) => {
    setSelectedContact(contact)
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
          updateList={updateList}
          setContactList={setContactList}
          selectedContact={selectedContact}
        />
      </Layout>
    </Layout>
  )
}

export default Chat
