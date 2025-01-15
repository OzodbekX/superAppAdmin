import ChatFAQsList from './list'
import { fetchChatFAQs } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import ChatFAQsForm from './form.jsx'

const FAQChat = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, reNew: 0 })
  const [list, setList] = useState([])
  const [selectedChatFAQs, setSelectedChatFAQs] = useState()

  const { data } = useQuery({
    queryKey: ['fetchChatFAQs', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchChatFAQs({
        offset: filters.page * filters.pageSize,
        limit: filters.pageSize,
        searchText: filters?.searchText,
      }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const onUpdateList = (changedData, type) => {
    if (type === 'update') {
      const updatedList = list?.map((item) =>
        item.id === changedData.id ? { ...item, ...changedData } : item
      )
      setList(updatedList) // Set the new list which triggers a re-render
    } else if (type === 'delete') {
      const newList = list.filter((item) => changedData.id !== item?.id)
      setList(newList)
    } else if (type === 'create') {
      setList([changedData, ...list]) // Set the new list which triggers a re-render
    }
    setSelectedChatFAQs(undefined)
  }

  useEffect(() => {
    setList(data?.data)
  }, [data?.data])
  return (
    <div>
      {selectedChatFAQs ? (
        <ChatFAQsForm
          selectedChatFAQs={selectedChatFAQs}
          onAdd={(data) => onUpdateList(data, 'create')}
          onUpdate={(data) => onUpdateList(data, 'update')}
          onDelete={(data) => onUpdateList(data, 'delete')}
          onCancel={() => onUpdateList(null, 'cancel')}
        />
      ) : (
        <ChatFAQsList
          faqs={list}
          total={data?.meta?.total || data?.data?.length}
          setFilters={setFilters}
          filters={filters}
          setSelectedChatFAQs={setSelectedChatFAQs}
        />
      )}
    </div>
  )
}

export default FAQChat
