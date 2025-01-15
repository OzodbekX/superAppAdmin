import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchDeviceTag } from '@/utils/api/functions.js'
import DeviceTagForm from './form.jsx'
import DeviceTagList from './list'

const DeviceTags = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1 })
  const [selectedDeviceTag, setSelectedDeviceTag] = useState()
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['fetchDeviceTag', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchDeviceTag({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
    retry: false,
    initialData: [],
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const onUpdateList = (changedData, type) => {
    if (type === 'update') {
      const updatedList = list.map((item) =>
        item.id === changedData.id ? { ...item, ...changedData } : item
      )
      setList(updatedList) // Set the new list which triggers a re-render
    } else if (type === 'delete') {
      const newList = list.filter((item) => changedData.id !== item?.id)
      setList(newList)
    } else if (type === 'create') {
      setList([changedData, ...list]) // Set the new list which triggers a re-render
    }
    setSelectedDeviceTag(undefined)
  }

  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div>
      {selectedDeviceTag ? (
        <DeviceTagForm
          onUpdateList={onUpdateList}
          selectedDeviceTag={selectedDeviceTag}
          setSelectedDeviceTag={setSelectedDeviceTag}
          setFilters={setFilters}
        />
      ) : (
        <DeviceTagList
          list={list}
          currentPage={filters.page}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedDeviceTag={setSelectedDeviceTag}
        />
      )}
    </div>
  )
}

export default DeviceTags
