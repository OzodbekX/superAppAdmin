import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTickets } from '@/utils/api/functions.js'
import ConnectionRequestsList from '@/pages/dashboard/requests/connectRequests/list.jsx'
import RequestView from '@/pages/dashboard/requests/connectRequests/view.jsx'

const ConnectRequests = () => {
  const [filters, setFilters] = useState({
    pageSize: 10,
    page: 0,
  })
  const [selectedRequest, setSelectedRequest] = useState()

  const { data } = useQuery({
    queryKey: ['fetchTickets', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchTickets({
        ...filters,
        offset: filters.page * filters.pageSize,
        limit: filters.pageSize,
      }), // Fetch the correct page

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const getServiceOptionLabel = (value) =>
    value === 'INTERNET'
      ? 'Интернет'
      : value === 'REPAIR'
      ? 'Ремонт'
      : value === 'INSTALLATION'
      ? 'Установка'
      : value === 'OTHER'
      ? 'Другой'
      : 'Неизвестно'

  const calculateTotalPrice = (request) => {
    if (request?.type != 'TV') {
      const devicePrice = request?.device?.price || 0
      const tariffPrice = request?.tariff?.price || 0
      if (request?.routerPaymentType === 'BUY_NOW') {
        return tariffPrice + devicePrice
      } else if (request?.routerPaymentType === 'PERIOD') return tariffPrice
      else if (request?.routerPaymentType === 'INSTALLMENTS')
        return tariffPrice + request?.device?.installmentPrice
      else return tariffPrice
    } else return 0
  }

  return (
    <div>
      <RequestView
        getServiceOptionLabel={getServiceOptionLabel}
        request={selectedRequest}
        calculateTotalPrice={calculateTotalPrice}
        setSelectedRequest={setSelectedRequest}
      />
      <ConnectionRequestsList
        getServiceOptionLabel={getServiceOptionLabel}
        data={data?.data}
        total={data?.meta?.total}
        setFilters={setFilters}
        filters={filters}
        calculateTotalPrice={calculateTotalPrice}
        setSelectedRequest={setSelectedRequest}
      />
    </div>
  )
}

export default ConnectRequests
