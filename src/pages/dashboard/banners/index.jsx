import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import BannerList from '@/pages/dashboard/banners/list.jsx'
import BannerForm from '@/pages/dashboard/banners/form.jsx'
import { fetchBanners } from '@/utils/api/functions.js'

const Banners = () => {
  const [filters, setFilters] = useState({ pageSize: 30, page: 0, update: 1 })
  const [selectedBanner, setSelectedBanner] = useState()
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['fetchBanners', filters], // The query key depends on the page and pageSize
    queryFn: () => fetchBanners({ offset: 0, limit: 100 }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
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
    setSelectedBanner(undefined)
  }

  const bannerTypes = [
    {
      value: 'promo',
      label: 'Рекламный',
    },
    {
      value: 'common',
      label: 'Главный баннер страницы',
    },
  ]

  useEffect(() => {
    setList(data?.data)
  }, [data])

  const resourceKeyList = useMemo(() => list?.map((item) => item?.resourceKey) || [], [list])

  return (
    <div>
      {selectedBanner ? (
        <BannerForm
          bannerTypes={bannerTypes}
          resourceKeyList={resourceKeyList}
          onUpdateList={onUpdateList}
          selectedBanner={selectedBanner}
          setSelectedBanner={setSelectedBanner}
          setFilters={setFilters}
        />
      ) : (
        <BannerList
          bannerTypes={bannerTypes}
          list={list}
          setFilters={setFilters}
          setSelectedBanner={setSelectedBanner}
        />
      )}
    </div>
  )
}

export default Banners
