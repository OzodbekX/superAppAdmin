import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getActiveChats, getRoomMessages } from '@/utils/api/functions.js'
import { Layout } from 'antd'
import { userStore } from '@/utils/zustand.js'
import moment from 'moment/moment.js'
import ChatContent from '@/pages/dashboard/chat/components/ChatContent.jsx'
import ArchiveChatsList from '@/pages/dashboard/chat/components/ArchiveChatList.jsx'
import UsersList from '@/pages/dashboard/chat/components/UsersList.jsx'

const Chats = ({ selectedItem }) => {
  const token = userStore((state) => state?.token)
  const { language } = userStore((state) => state)
  const [selectedContact, setSelectedContact] = useState({})
  const [selectedArchiveContact, setSelectedArchiveContact] = useState({})
  const [messages, setMessages] = useState([]) // List of chat contacts

  const selectedContactId = useRef()

  const { data: allActiveChats = [] } = useQuery({
    queryKey: ['getActiveChats', token, selectedItem],
    queryFn: () =>
      getActiveChats({
        limit: selectedItem?.chatCount + 10,
        offset: 0,
        // isArchive: false,
        rootFaqId: selectedItem?.type === 'SUBCATEGORY' ? selectedItem?.id : undefined,
        categoryId: selectedItem?.type === 'CATEGORY' ? selectedItem?.id : undefined,
      }),
    retry: 1,
    gcTime: 20 * 60 * 1000,
  })

  const { data: initialMessages } = useQuery({
    queryKey: ['getRoomMessages', selectedContact?.id, selectedArchiveContact?.id],
    queryFn: () => getRoomMessages(selectedArchiveContact?.id || selectedContact?.id),
    enabled: !!selectedArchiveContact?.id || !!selectedContact?.id,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const getContacts = useMemo(() => {
    return allActiveChats
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
  }, [allActiveChats])

  const updateSelectedContact = (contact) => {
    setSelectedContact(contact)
    setSelectedArchiveContact(undefined)
    selectedContactId.current = contact.id
  }

  function onExpand(condition) {
    const elements = document.querySelectorAll('.adaptive-height')
    elements.forEach((element) => {
      if (condition) {
        element.style.height = 'calc(100vh - 300px)'
      } else {
        element.style.height = 'calc(100vh - 200px)'
      }
    })
  }

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
      })
    })
    setMessages(formattedMessage)
  }, [initialMessages])

  useEffect(() => {
    onExpand()
  }, [selectedItem])

  return (
    <div>
      <Layout className="h-screen adaptive-height">
        {/* Sidebar for Chats */}
        <UsersList
          contacts={getContacts}
          selectedContact={selectedContact}
          setSelectedContact={updateSelectedContact}
        />
        {/* Chat Section */}
        {selectedContact?.id && (
          <Layout className="w-1/3" style={{ height: '100%' }}>
            <ChatContent
              hideAction={true}
              messages={messages}
              scrollType={'auto'}
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

export default Chats
