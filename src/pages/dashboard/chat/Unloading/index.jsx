import React, { useState } from 'react'
import ApplicationList from '@/pages/dashboard/chat/Unloading/list.jsx'
import FilterComponent from '@/pages/dashboard/chat/Unloading/filters.jsx'
import { useQuery } from '@tanstack/react-query'
import { getRoomMessages, getStatistics } from '@/utils/api/functions.js'
import Chats from '@/pages/dashboard/chat/Unloading/chats.jsx'

const Unloading = () => {
  const [filters, setFilters] = useState()
  const [selectedItem, setSelectedItem] = useState()
  const { data } = useQuery({
    queryKey: ['getRoomMessages', filters],
    queryFn: () => getStatistics({ ...filters }),
    gcTime: 20 * 60 * 1000,
    enabled: !!filters?.stratDate || !!filters?.endDate,
    staleTime: 'Infinity',
    initialData: [],
  })

  return (
    <div>
      <FilterComponent
        setFilters={setFilters}
        selectedItem={selectedItem}
        filters={filters}
        setSelectedItem={setSelectedItem}
      />
      {selectedItem ? (
        <Chats selectedItem={selectedItem} />
      ) : (
        <ApplicationList
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          data={data}
          total={data?.length}
        />
      )}
    </div>
  )
}

export default Unloading
