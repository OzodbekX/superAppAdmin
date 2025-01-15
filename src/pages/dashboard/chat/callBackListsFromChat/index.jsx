import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  archiveCallBacks,
  getChatCallBackApplications,
  getRoomMessages,
} from '@/utils/api/functions.js'
import List from '@/pages/dashboard/chat/callBackListsFromChat/list.jsx'
import ChatContent from '@/pages/dashboard/chat/components/ChatContent.jsx'
import moment from 'moment/moment.js'
import { userStore } from '@/utils/zustand.js'

const CallBackListsFromChat = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0 })
  const [selectedCallBackRequests, setSelectedCallBackRequests] = useState()
  const [messages, setMessages] = useState([]) // List of chat contacts
  const [contactList, setContactList] = useState([]) // List of chat contacts
  const { language } = userStore((state) => state)

  const onArchiveChat = useMutation({
    // Optional callbacks
    mutationFn: archiveCallBacks,
    onSuccess: (data) => {
      updateSelectedContact(data)
    },
  })
  const { data } = useQuery({
    queryKey: ['getRoomMessages', filters],
    queryFn: () =>
      getChatCallBackApplications({
        offset: filters.page * filters.pageSize,
        limit: filters.pageSize,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
      }),
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
    initialData: [],
  })

  const { data: initialMessages } = useQuery({
    queryKey: ['getRoomMessages', selectedCallBackRequests?.id],
    queryFn: () => getRoomMessages(selectedCallBackRequests?.chat?.id),
    enabled: !!selectedCallBackRequests?.chat?.id,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  useEffect(() => {
    if (data) {
      setContactList(data.data)
    }
  }, [data])

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

  const updateSelectedContact = (contact) => {
    setSelectedCallBackRequests(contact)
    setContactList((prevItems) =>
      prevItems.map((item) => (item.id === contact?.id ? { ...item, ...contact } : item))
    )
  }

  return (
    <div className={'flex'}>
      <div style={{ minWidth: '65%', width: selectedCallBackRequests?.id ? '65%' : '100%' }}>
        <List
          setFilters={setFilters}
          filters={filters}
          callBackRequests={contactList}
          total={data?.meta?.total}
          setSelectedCallBackRequests={setSelectedCallBackRequests}
          selectedCallBackRequests={selectedCallBackRequests}
        />
      </div>
      {selectedCallBackRequests?.id && (
        <ChatContent
          messages={messages}
          scrollType={'auto'}
          hideInput={true}
          onChangeArchive={() =>
            onArchiveChat.mutate({ status: 'PROCESSED', id: selectedCallBackRequests?.id })
          }
          selectedContact={{
            ...selectedCallBackRequests?.chat,
            operatorRate: selectedCallBackRequests?.operatorRate,
          }}
          updateSelectedContact={updateSelectedContact}
        />
      )}
    </div>
  )
}

export default CallBackListsFromChat
