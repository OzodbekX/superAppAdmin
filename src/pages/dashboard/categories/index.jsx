import { fetchCategories } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import CategoriesList from '@/pages/dashboard/categories/list.jsx'
import EditCategoryForm from '@/pages/dashboard/categories/form.jsx'

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState()
  const [list, setList] = useState([])
  const { data } = useQuery({
    queryKey: ['fetchCategoriesAll'],
    queryFn: () => fetchCategories({ offset: 0, limit: 100 }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    placeholderData: [],
  })

  const onUpdateList = (changedData, type) => {
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
    setSelectedCategory(undefined)
  }

  const resourceKeyList = useMemo(() => list?.map((item) => item?.url) || [], [list])

  useEffect(() => {
    setList(data?.data)
  }, [data?.data])

  return (
    <div>
      {selectedCategory ? (
        <EditCategoryForm
          categories={list}
          onUpdateList={onUpdateList}
          resourceKeyList={resourceKeyList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      ) : (
        <CategoriesList categories={list} setSelectedCategory={setSelectedCategory} />
      )}
    </div>
  )
}

export default Categories
