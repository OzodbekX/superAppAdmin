import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchChannels } from '@/utils/api/functions.js'
import ChannelsList from '@/pages/dashboard/tvChannels/channels/list.jsx'
import ChannelForm from '@/pages/dashboard/tvChannels/channels/form.jsx'
import { cloneDeep } from 'lodash'

const TVChannelsComponent = () => {
  const [selectedChannel, setSelectedChannel] = useState()
  const [filters, setFilters] = useState({
    pageSize: 10,
    page: 0,
    reNew: 0,
    submitterType: 'legal-entity',
  })
  const [channelList, setChannelList] = useState([])
  const { data } = useQuery({
    queryKey: ['fetchChannels', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchChannels({
        offset: filters.page * filters.pageSize,
        limit: filters.pageSize,
      }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  useEffect(() => {
    setChannelList(data?.data)
  }, [data])

  const onUpdateList = (changedData, type) => {
    let list = cloneDeep(channelList)
    if (type === 'update') {
      const updatedList = list?.map((item) =>
        item.id === changedData.id ? { ...item, ...changedData } : item
      )
      setChannelList(updatedList) // Set the new list which triggers a re-render
    } else if (type === 'delete') {
      const newList = list.filter((item) => changedData.id !== item?.id)
      setChannelList(newList)
    } else if (type === 'create') {
      setChannelList([changedData, ...list]) // Set the new list which triggers a re-render
    }
  }

  return (
    <div>
      {selectedChannel ? (
        <ChannelForm
          onUpdateList={onUpdateList}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      ) : (
        <ChannelsList
          data={channelList}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedChannel={setSelectedChannel}
        />
      )}
    </div>
  )
}

export default TVChannelsComponent
