import ApplicationList from './list'
import { fetchCallBackRequest, fetchNews } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import RequestForm from './form.jsx'

const CallBackRequests = () => {
  const [filters, setFilters] = useState({
    pageSize: 10,
    page: 0,
    reNew: 0,
    submitterType: 'natural-person',
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
        phoneNumber: filters?.phoneNumber,
        submitterType: filters?.submitterType,
      }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  return (
    <div>
      {selectedRequest ? (
        <RequestForm
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          setFilters={setFilters}
        />
      ) : (
        <ApplicationList
          data={data?.data}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedRequest={setSelectedRequest}
        />
      )}
    </div>
  )
}

export default CallBackRequests
