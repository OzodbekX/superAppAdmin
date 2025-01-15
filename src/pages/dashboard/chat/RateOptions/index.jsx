import { getRateOptions } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import RateOptionsForm from './form.jsx'
import RateOptionsList from './list'

const RateOptions = () => {
  const [selectedRateOption, setSelectedRateOption] = useState()
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['getRateOptions'], // The query key depends on the page and pageSize
    queryFn: getRateOptions, // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const onUpdateList = (changedData, type) => {
    // let list = cloneDeep(list)
    if (type === 'update') {
      const updatedList = list?.map((item) =>
        item.id === changedData.id ? { ...item, ...changedData } : item
      )
      setList(updatedList) // Set the new list which triggers a re-render
    } else if (type === 'delete') {
      const newList = list.filter((item) => changedData.id !== item?.id)
      setList(newList)
    } else if (type === 'create') {
      setList([changedData, ...list]) // Set the new list which triggers a re-render
    }
    setSelectedRateOption(undefined)
  }
  useEffect(() => {
    setList(data)
  }, [data])

  return (
    <div>
      {selectedRateOption ? (
        <RateOptionsForm
          setSelectedRateOption={setSelectedRateOption}
          selectedRateOption={selectedRateOption}
          onUpdateList={onUpdateList}
        />
      ) : (
        <RateOptionsList
          faqs={list}
          total={list?.length}
          setSelectedRateOption={setSelectedRateOption}
        />
      )}
    </div>
  )
}

export default RateOptions
