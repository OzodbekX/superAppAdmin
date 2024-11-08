import StoriesList from './list'
import StoryForm from '@/pages/dashboard/stories/form.jsx'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/utils/api/functions.js'

const Stories = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0 })
  const [selectedStory, setSelectedStory] = useState()
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['fetchStories', filters], // The query key depends on the page and pageSize
    queryFn: () => getStories({ offset: filters.page * filters.pageSize, limit: filters.pageSize,types:"SUPERAPP" }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    queryHash: 'fetchStories',
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
    setSelectedStory(undefined)
  }
  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div>
      {selectedStory ? (
        <StoryForm
          selectedStory={selectedStory}
          setSelectedStory={setSelectedStory}
          onUpdateList={onUpdateList}
        />
      ) : (
        <StoriesList
          stories={list}
          setFilters={setFilters}
          total={data?.data?.length}
          filters={filters}
          setSelectedStory={setSelectedStory}
        />
      )}
    </div>
  )
}

export default Stories
