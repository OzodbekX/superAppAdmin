import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchService } from '@/utils/api/functions.js'
import DeviceServiceForm from './form.jsx'
import DeviceServiceList from './list'

const ServiceTypes = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1, renew: false })
  const [selectedServiceCatalog, setSelectedServiceCatalog] = useState()
  const [list, setList] = useState([])
  const { data } = useQuery({
    queryKey: ['fetchService', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchService({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    initialData: [],
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const onUpdateList = (changedData, type) => {
    setFilters((prev) => ({ ...prev, renew: !prev?.renew }))
    setSelectedServiceCatalog(undefined)
  }

  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div>
      {selectedServiceCatalog ? (
        <DeviceServiceForm
          onUpdateList={onUpdateList}
          selectedServiceCatalog={selectedServiceCatalog}
          setSelectedServiceCatalog={setSelectedServiceCatalog}
          setFilters={setFilters}
        />
      ) : (
        <DeviceServiceList
          list={list}
          currentPage={filters.page}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedServiceCatalog={setSelectedServiceCatalog}
        />
      )}
    </div>
  )
}

export default ServiceTypes
