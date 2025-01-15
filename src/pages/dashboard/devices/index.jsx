import React, { useEffect, useState } from 'react'
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { FolderOpenIcon, RssIcon, SquaresPlusIcon, TagIcon } from '@heroicons/react/24/solid'
import WifiRouters from '@/pages/dashboard/devices/wifi/index.jsx'
import DeviceTags from '@/pages/dashboard/devices/tags/index.jsx'
import DeviceCategories from '@/pages/dashboard/devices/catalogs/index.jsx'
import ConnectTariffsToRouters from './connectRoutersToTariffs/index.jsx'
import { useQuery } from '@tanstack/react-query'
import { fetchWifiDevices } from '@/utils/api/functions.js'

const Devices = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, reNew: 0 })
  const [list, setList] = useState([])

  const { data } = useQuery({
    queryKey: ['fetchWifiDevices', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchWifiDevices({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
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

  const tabList = [
    {
      title: 'Wi-Fi',
      value: 'Wi-Fi',
      icon: <RssIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: (
        <WifiRouters
          routers={list}
          total={data?.meta?.total}
          filters={filters}
          onUpdateList={onUpdateList}
          setFilters={setFilters}
        />
      ),
    },
    {
      title: 'Каталог',
      value: 'Каталог',
      icon: <FolderOpenIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />,
      body: <DeviceCategories />,
    },
    {
      title: 'Теги',
      value: 'Теги',
      icon: <TagIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: <DeviceTags />,
    },
    {
      title: 'Связь с тарифами',
      value: 'Связь с тарифами',
      icon: <SquaresPlusIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: (
        <ConnectTariffsToRouters
          data={data}
          filters={filters}
          setFilters={setFilters}
          list={data?.data}
          total={data?.meta?.total}
        />
      ),
    },
  ]
  const [tabValue, setTabValue] = useState(tabList?.[0].value)
  return (
    <div className={'rounded-3xl bg-white'}>
      <Tabs value={tabValue}>
        <TabsHeader className={'w-1/2 px-5 m-4'}>
          {tabList?.map((item, index) => (
            <Tab onClick={() => setTabValue(item.value)} key={index} value={item.value}>
              {item.icon}
              {item.title}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {tabList.map(({ body, value }) => (
            <TabPanel key={value} value={value}>
              {body}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  )
}

export default Devices
