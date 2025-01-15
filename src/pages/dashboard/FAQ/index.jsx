import FAQsList from './list'
import { fetchFAQs } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import FAQsForm from './form.jsx'

const FAQs = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, reNew: 0 })
  const [selectedFAQs, setSelectedFAQs] = useState()

  const { data } = useQuery({
    queryKey: ['fetchFAQs', filters], // The query key depends on the page and pageSize
    queryFn: () => fetchFAQs({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  return (
    <div>
      {selectedFAQs ? (
        <FAQsForm
          selectedFAQs={selectedFAQs}
          setSelectedFAQs={setSelectedFAQs}
          setFilters={setFilters}
        />
      ) : (
        <FAQsList
          faqs={data?.data}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedFAQs={setSelectedFAQs}
        />
      )}
    </div>
  )
}

export default FAQs
