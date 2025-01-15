import ApplicationList from './list'
import { fetchCallBackRequest, fetchNews } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import RequestForm from './form.jsx'

const Options = {
  TV: 'TV',
  INTERNET: 'INTERNET',
  SERVICE: 'SERVICE',
}
const CallBackRequests = () => {
  const [filters, setFilters] = useState({
    pageSize: 10,
    page: 0,
    reNew: 0,
    type: 'CLIENT',
  })
  const [selectedRequest, setSelectedRequest] = useState()

  const { data } = useQuery({
    queryKey: ['fetchNews', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchCallBackRequest({
        offset: filters.page * filters.pageSize,
        limit: filters.pageSize,
        name: filters?.name,
        status: filters?.status,
        q: filters?.searchText,
        category: filters?.category,
        phone: filters?.phone,
        type: filters?.type,
      }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  // Function to Map Options to Russian Titles
  const getRussianTitle = (option) => {
    switch (option) {
      case Options.TV:
        return 'ЦТВ'
      case Options.INTERNET:
        return 'Интернет'
      case Options.SERVICE:
        return 'Сервис'
      default:
        return 'Неизвестная опция' // Default case for unknown options
    }
  }

  return (
    <div>
      <RequestForm
        getRussianTitle={getRussianTitle}
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        setFilters={setFilters}
      />
      <ApplicationList
        getRussianTitle={getRussianTitle}
        data={data?.data}
        total={data?.meta?.total}
        setFilters={setFilters}
        filters={filters}
        setSelectedRequest={setSelectedRequest}
      />
    </div>
  )
}

export default CallBackRequests
