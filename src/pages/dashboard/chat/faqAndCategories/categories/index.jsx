import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchChatFAQsCategories } from '@/utils/api/functions.js'
import { cloneDeep } from 'lodash'
import ChatFAQsCategoriesForm from '@/pages/dashboard/chat/faqAndCategories/categories/form.jsx'
import ChatFAQsCategoryList from '@/pages/dashboard/chat/faqAndCategories/categories/list.jsx'

const FAQCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState()
  const [categoryList, setCategoryList] = useState([])
  const [filters, setFilters] = useState({
    pageSize: 10,
    page: 0,
    reNew: 0,
    submitterType: 'legal-entity',
  })

  const { data } = useQuery({
    queryKey: ['fetchChatFAQsCategories'], // The query key depends on the page and pageSize
    queryFn: fetchChatFAQsCategories, // Fetch the correct page
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
    setSelectedCategory(undefined)
  }

  return (
    <div>
      {selectedCategory ? (
        <ChatFAQsCategoriesForm
          onUpdateList={onUpdateList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      ) : (
        <ChatFAQsCategoryList
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

export default FAQCategory
