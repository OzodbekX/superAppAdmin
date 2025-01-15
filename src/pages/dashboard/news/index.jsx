import NewsList from './list'
import { fetchNews } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import NewsForm from '@/pages/dashboard/news/form.jsx'

const News = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1 })
  const [selectedNews, setSelectedNews] = useState()
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['fetchNews', filters], // The query key depends on the page and pageSize
    queryFn: () => fetchNews({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
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
  }

  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div>
      {selectedNews ? (
        <NewsForm
          onUpdateList={onUpdateList}
          selectedNews={selectedNews}
          setSelectedNews={setSelectedNews}
          setFilters={setFilters}
        />
      ) : (
        <NewsList
          News={list}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedNews={setSelectedNews}
        />
      )}
    </div>
  )
}

export default News
