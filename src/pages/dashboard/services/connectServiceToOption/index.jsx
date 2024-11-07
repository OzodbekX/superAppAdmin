import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  connectServiceToOption,
  connectTariffToDevice,
  disConnectServiceToOption,
  fetchConnectedServiceOptions,
  fetchService,
  fetchServiceOption,
  fetchTariffs,
  fetchTariffsWithConnectedDevices,
} from '@/utils/api/functions.js'
import AntTable from '@/components/AntTable/index.jsx'
import { userStore } from '@/utils/zustand.js'
import { Button, Select } from 'antd'

const ConnectServiceToOptions = () => {
  const [selectedServiceOption, setSelectedServiceOption] = useState(undefined)
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, update: 1, renew: false })
  const [selectedService, setSelectedService] = useState([])
  const [connectedList, setConnectedList] = useState([])
  const [updateList, setUpdateList] = useState(false)
  const lang = userStore((state) => state.language)

  const { data: serviceOptions } = useQuery({
    queryKey: ['fetchServiceOption', filters], // The query key depends on the page and pageSize
    queryFn: () => fetchServiceOption({ offset: 0, limit: 100 }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    initialData: [],
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const { data: services } = useQuery({
    queryKey: ['fetchService', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchService({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    initialData: [],
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const { data: connectedServiceOptions } = useQuery({
    queryKey: ['fetchConnectedServiceOptions', selectedService, updateList], // The query key depends on the page and pageSize
    queryFn: () => fetchConnectedServiceOptions(selectedService?.[0]), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    gcTime: 20 * 60 * 1000,
    enabled: !!selectedService?.[0],
  })

  const onConnectTariffToDevice = useMutation({
    // Optional callbacks
    mutationFn: connectServiceToOption,
    onSuccess: (_) => {
      setSelectedServiceOption(undefined)
      setUpdateList(!updateList)
    },
  })

  const onDisConnectTariffToDevice = useMutation({
    // Optional callbacks
    mutationFn: disConnectServiceToOption,
    onSuccess: (_) => {
      setSelectedServiceOption(undefined)
      setUpdateList(!updateList)
    },
  })

  const onClickRow = (row) => {
    setSelectedService([row?.id])
  }

  const onConnectTariff = (row) => {
    onConnectTariffToDevice?.mutate({
      id: selectedService?.[0],
      serviceId: selectedServiceOption,
    })
  }

  useEffect(() => {
    setConnectedList(connectedServiceOptions?.sort((a, b) => a?.position - b?.position) || [])
  }, [connectedServiceOptions])

  return (
    <div className={'flex gap-4'}>
      <div className="flex-1">
        <div className={'font-bold text-black my-4 text-2xl'}>
          Пожалуйста, выберите, чтобы завязать.
        </div>
        <AntTable
          rowSelection={{
            selectedRowKeys: selectedService,
            onChange: (keys) => {
              setSelectedService(keys?.filter((item) => !selectedService?.includes(item)))
            },
          }}
          headCells={[
            {
              id: 'id',
              key: 'id',
              width: '5%',
              title: '№',
              render: (row, head, index) => {
                return <div>{index + 1}</div>
              },
            },
            {
              id: 'title',
              key: 'title',
              title: 'Заголовок',
              dataIndex: ['title', lang],
            },
          ]}
          rows={services?.data}
          total={services?.meta?.total}
          onClickRow={onClickRow}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div className="flex-1">
        <div className="flex align-middle gap-4 items-center">
          <Select
            value={selectedServiceOption}
            disabled={selectedService?.length < 1}
            onSelect={(e) => setSelectedServiceOption(e)}
            className={'w-1/2 my-4'}
          >
            {serviceOptions?.data
              ?.filter((item) => !connectedList?.some((i) => i.id == item?.id))
              ?.map((serviceOption) => (
                <Select.Option value={serviceOption.id}>{serviceOption.name?.[lang]}</Select.Option>
              ))}
          </Select>
          <Button
            loading={onConnectTariffToDevice?.isPending}
            disabled={
              onConnectTariffToDevice?.isPending ||
              selectedService?.length < 1 ||
              !selectedServiceOption
            }
            onClick={onConnectTariff}
          >
            Завязывать
          </Button>
        </div>
        <AntTable
          className={'flex-1'}
          headCells={[
            {
              id: 'id',
              key: 'id',
              width: '5%',
              title: '№',
              render: (row, head, index) => {
                return <div>{index + 1}</div>
              },
            },
            {
              id: 'id',
              key: 'id',
              title: 'Наименование',
              dataIndex: ['name', lang],
            },
            {
              id: 'removeBundle',
              key: 'removeBundle',
              title: 'Удалить связь',
              render: (row) => {
                return (
                  <Button
                    loading={onConnectTariffToDevice?.isPending}
                    disabled={onConnectTariffToDevice?.isPending}
                    onClick={() =>
                      onDisConnectTariffToDevice.mutate({
                        id: selectedService?.[0],
                        serviceId: row?.id,
                      })
                    }
                  >
                    Удалить связь
                  </Button>
                )
              },
            },
          ]}
          rows={connectedList || []}
        />
      </div>
    </div>
  )
}

export default ConnectServiceToOptions
