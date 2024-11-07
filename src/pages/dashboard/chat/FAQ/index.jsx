import ChatFAQsList from './list'
import { fetchChatFAQs } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ChatFAQsForm from './form.jsx'

const FAQChat = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, reNew: 0 })
  const [selectedChatFAQs, setSelectedChatFAQs] = useState()

  const { data } = useQuery({
    queryKey: ['fetchChatFAQs', filters], // The query key depends on the page and pageSize
    queryFn: fetchChatFAQs, // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  return (
    <div>
      {selectedChatFAQs ? (
        <ChatFAQsForm
          selectedChatFAQs={selectedChatFAQs}
          setSelectedChatFAQs={setSelectedChatFAQs}
          setFilters={setFilters}
        />
      ) : (
        <ChatFAQsList
          faqs={data?.data}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedChatFAQs={setSelectedChatFAQs}
        />
      )}
    </div>
  )
}

export default FAQChat
