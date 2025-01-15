import TariffList from './list'
import { fetchTariffs } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import TariffForm from '@/pages/dashboard/tariffs/tariffForm.jsx'
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { SquaresPlusIcon, TicketIcon } from '@heroicons/react/24/solid'
import ConnectTariffsToRouters from './connectTariffsToRouters/index.jsx'
import ConnectTariffsToTariffs from '@/pages/dashboard/tariffs/connectTariffsToTariffs/index.jsx'

const TariffBody = ({ setFilters, onUpdateList, list, total, filters }) => {
  const [selectedTariff, setSelectedTariff] = useState()
  const selectOptions = [
    { label: 'Премиум', value: 'premium' },
    { label: 'Средний', value: 'medium' },
    { label: 'По умолчанию', value: 'default' },
  ]
  if (selectedTariff)
    return (
      <TariffForm
        selectOptions={selectOptions}
        selectedTariff={selectedTariff}
        setSelectedTariff={setSelectedTariff}
        onUpdateList={onUpdateList}
      />
    )
  else
    return (
      <TariffList
        selectOptions={selectOptions}
        tariffs={list}
        total={total}
        setFilters={setFilters}
        filters={filters}
        setSelectedTariff={setSelectedTariff}
      />
    )
}

const Tariffs = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0 })
  const [list, setList] = useState([])

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

  const { data } = useQuery({
    queryKey: ['fetchTariffs', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchTariffs({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const tabList = [
    {
      title: 'Тарифы',
      value: 'Тарифы',
      icon: <TicketIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />,
      body: (
        <TariffBody
          onUpdateList={onUpdateList}
          list={list}
          filters={filters}
          setFilters={setFilters}
          total={data?.meta?.total}
        />
      ),
    },
    {
      title: 'Связь с Wi-Fi-роутерами.',
      value: 'Связь с Wi-Fi-роутерами.',
      icon: <SquaresPlusIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: (
        <ConnectTariffsToRouters
          filters={filters}
          setFilters={setFilters}
          list={list}
          total={data?.meta?.total}
        />
      ),
    },
    {
      title: 'Связь с тарифами.',
      value: 'Связь с тарифами.',
      icon: <SquaresPlusIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: <ConnectTariffsToTariffs />,
    },
  ]
  const [tabValue, setTabValue] = useState(tabList?.[0].value)

  useEffect(() => {
    setList(data?.data)
  }, [data])

  return (
    <div className=" mt-10  border rounded-3xl shadow-md bg-white">
      <Tabs value={tabValue}>
        <TabsHeader className={'w-1/2  px-5 m-4 mb-0'}>
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

export default Tariffs
