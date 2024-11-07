import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchCities, fetchOffice } from '@/utils/api/functions.js'
import OfficeForm from './form.jsx'
import OfficeList from './list'

const Offices = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1 })
  const [selectedOffice, setSelectedOffice] = useState()
  const [list, setList] = useState([])
  const { data: cityList } = useQuery({
    queryKey: ['fetchCities'], // The query key depends on the page and pageSize
    queryFn: () => fetchCities(), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    initialData: [],
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const { data } = useQuery({
    queryKey: ['fetchOffice', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchOffice({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
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
  }

  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div>
      {selectedOffice ? (
        <OfficeForm
          cityList={cityList}
          onUpdateList={onUpdateList}
          selectedOffice={selectedOffice}
          setSelectedOffice={setSelectedOffice}
          setFilters={setFilters}
        />
      ) : (
        <OfficeList
          cityList={cityList}
          list={list}
          currentPage={filters.page}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedOffice={setSelectedOffice}
        />
      )}
    </div>
  )
}

export default Offices
