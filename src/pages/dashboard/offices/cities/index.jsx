import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchCities } from '@/utils/api/functions.js'
import CityForm from './form.jsx'
import CityList from './list'

const Cities = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1 })
  const [selectedCity, setSelectedCity] = useState()
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['fetchCities', filters], // The query key depends on the page and pageSize
    queryFn: fetchCities, // Fetch the correct page

    retry: false,
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
    setSelectedCity(undefined)
  }

  useEffect(() => {
    setList(data?.data || [])
  }, [data])

  return (
    <div>
      {selectedCity ? (
        <CityForm
          onUpdateList={onUpdateList}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setFilters={setFilters}
        />
      ) : (
        <CityList list={list} setFilters={setFilters} setSelectedCity={setSelectedCity} />
      )}
    </div>
  )
}

export default Cities
