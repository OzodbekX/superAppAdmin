import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchStaffs } from '@/utils/api/functions.js'
import StaffForm from './form.jsx'
import StaffList from './list'

const StaffManagement = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1, renew: false })
  const [selectedStaff, setSelectedStaff] = useState()
  const [list, setList] = useState([])
  const { data } = useQuery({
    queryKey: ['fetchStaffs', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchStaffs({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page

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
    setSelectedStaff(undefined)
  }

  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div>
      {selectedStaff ? (
        <StaffForm
          onUpdateList={onUpdateList}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          setFilters={setFilters}
        />
      ) : (
        <StaffList
          list={list}
          currentPage={filters.page}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedStaff={setSelectedStaff}
        />
      )}
    </div>
  )
}

export default StaffManagement
