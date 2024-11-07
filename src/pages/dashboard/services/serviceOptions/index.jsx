import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchServiceOption } from '@/utils/api/functions.js'
import ServiceOptionForm from './form.jsx'
import ServiceOptionList from './list'

const ServiceOptions = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1 })
  const [selectedServiceOption, setSelectedServiceOption] = useState()
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['fetchServiceOption', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchServiceOption({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
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
    setSelectedServiceOption(undefined)
  }

  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div>
      {selectedServiceOption ? (
        <ServiceOptionForm
          onUpdateList={onUpdateList}
          selectedServiceOption={selectedServiceOption}
          setSelectedServiceOption={setSelectedServiceOption}
          setFilters={setFilters}
        />
      ) : (
        <ServiceOptionList
          list={list}
          currentPage={filters.page}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedServiceOption={setSelectedServiceOption}
        />
      )}
    </div>
  )
}

export default ServiceOptions
