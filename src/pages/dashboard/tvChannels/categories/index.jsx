import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchChannelCategories } from '@/utils/api/functions.js'
import ChannelCategoryList from '@/pages/dashboard/tvChannels/categories/list.jsx'
import ChannelCategoryForm from '@/pages/dashboard/tvChannels/categories/form.jsx'
import { cloneDeep } from 'lodash'

const ChannelCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState()
  const [categoryList, setCategoryList] = useState([])
  const [filters, setFilters] = useState({
    pageSize: 10,
    page: 0,
    reNew: 0,
    submitterType: 'legal-entity',
  })

  const { data } = useQuery({
    queryKey: ['fetchChannelCategories', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchChannelCategories({
        offset: filters.page * filters.pageSize,
        limit: filters.pageSize,
      }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  useEffect(() => {
    setCategoryList(data?.data)
  }, [data])

  const onUpdateList = (changedData, type) => {
    let list = cloneDeep(categoryList)
    if (type === 'update') {
      const updatedList = list?.map((item) =>
        item.id === changedData.id ? { ...item, ...changedData } : item
      )
      setCategoryList(updatedList) // Set the new list which triggers a re-render
    } else if (type === 'delete') {
      const newList = list.filter((item) => changedData.id !== item?.id)
      setCategoryList(newList)
    } else if (type === 'create') {
      setCategoryList([changedData, ...list]) // Set the new list which triggers a re-render
    }
  }

  return (
    <div>
      {selectedCategory ? (
        <ChannelCategoryForm
          onUpdateList={onUpdateList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      ) : (
        <ChannelCategoryList
          data={categoryList}
          total={data?.meta?.total || 0}
          setSelectedCategory={setSelectedCategory}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </div>
  )
}

export default ChannelCategory
