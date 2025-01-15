import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchChannelTariffs } from '@/utils/api/functions.js'
import { cloneDeep } from 'lodash'
import ChannelTariffList from '@/pages/dashboard/tvChannels/tariffs/list.jsx'
import ChannelTariffForm from '@/pages/dashboard/tvChannels/tariffs/form.jsx'

const ChannelTariffs = () => {
  const [selectedTariff, setSelectedTariff] = useState()
  const [tariffList, setTariffList] = useState([])
  const [filters, setFilters] = useState({
    pageSize: 10,
    page: 0,
    reNew: 0,
    submitterType: 'legal-entity',
  })

  const { data } = useQuery({
    queryKey: ['fetchChannelTariffs', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchChannelTariffs({
        offset: filters.page * filters.pageSize,
        limit: filters.pageSize,
      }), // Fetch the correct page

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  useEffect(() => {
    setTariffList(data?.data)
  }, [data])

  const onUpdateList = (changedData, type) => {
    let list = cloneDeep(tariffList)
    if (type === 'update') {
      const updatedList = list?.map((item) =>
        item.id === changedData.id ? { ...item, ...changedData } : item
      )
      setTariffList(updatedList) // Set the new list which triggers a re-render
    } else if (type === 'delete') {
      const newList = list.filter((item) => changedData.id !== item?.id)
      setTariffList(newList)
    } else if (type === 'create') {
      setTariffList([changedData, ...list]) // Set the new list which triggers a re-render
    }
  }

  return (
    <div>
      {selectedTariff ? (
        <ChannelTariffForm
          onUpdateList={onUpdateList}
          selectedTariff={selectedTariff}
          setSelectedTariff={setSelectedTariff}
        />
      ) : (
        <ChannelTariffList
          data={tariffList}
          total={data?.meta?.total || 0}
          setSelectedTariff={setSelectedTariff}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </div>
  )
}

export default ChannelTariffs
