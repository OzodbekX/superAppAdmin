import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  connectTariffToDevice,
  fetchTariffs,
  fetchTariffsWithConnectedDevices,
} from '@/utils/api/functions.js'
import AntTable from '@/components/AntTable/index.jsx'
import { userStore } from '@/utils/zustand.js'
import { Button, Select } from 'antd'

const ConnectTariffsToRouters = ({ list, total, filters, setFilters }) => {
  const [selectedTariff, setSelectedTariff] = useState(undefined)
  const [selectedDevice, setSelectedDevice] = useState([])
  const [connectedList, setConnectedList] = useState([])
  const [updateList, setUpdateList] = useState(false)
  const lang = userStore((state) => state.language)
  const { data: tariffList } = useQuery({
    queryKey: ['fetchTariffs'], // The query key depends on the page and pageSize
    queryFn: () => fetchTariffs({ offset: 0, limit: 100 }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: connectedTariffList } = useQuery({
    queryKey: ['fetchTariffsWithConnectedDevices', selectedDevice, updateList], // The query key depends on the page and pageSize
    queryFn: () => fetchTariffsWithConnectedDevices(selectedDevice?.[0]), // Fetch the correct page
    gcTime: 20 * 60 * 1000,
    enabled: !!selectedDevice?.[0],
  })

  const onConnectTariffToDevice = useMutation({
    // Optional callbacks
    mutationFn: connectTariffToDevice,
    onSuccess: (data) => {
      setSelectedTariff(undefined)
      setUpdateList(!updateList)
    },
  })

  const onClickRow = (row) => {
    setSelectedDevice([row?.id])
  }

  const onConnectTariff = (row) => {
    let list = []
    if (row?.id) {
      let difference = 0
      connectedList?.forEach((item, index) => {
        if (item?.id !== row?.id) {
          list.push({ id: item?.id, position: index - difference, name: item?.name })
        } else {
          difference = 1
        }
      })
    } else {
      let tariff = tariffList?.data?.find((i) => i?.id === selectedTariff)
      list = [{ id: selectedTariff, position: 0, name: tariff?.name }]
      if (connectedList) {
        connectedList?.forEach((item, index) => {
          if (!list.some((i) => i.id === item.id)) {
            list.push({ id: item?.id, position: index + 1, name: item?.name })
          }
        })
      }
    }

    onConnectTariffToDevice?.mutate({
      id: selectedDevice?.[0],
      params: { ...connectedTariffList, tariffs: list },
    })
  }

  useEffect(() => {
    setConnectedList(connectedTariffList?.tariffs?.sort((a, b) => a?.position - b?.position) || [])
  }, [connectedTariffList?.tariffs])

  return (
    <div className={'flex gap-4'}>
      <div className="flex-1">
        <div className={'font-bold text-black my-4 text-2xl'}>
          Пожалуйста, выберите, чтобы завязать.
        </div>
        <AntTable
          rowSelection={{
            selectedRowKeys: selectedDevice,
            onChange: (keys) => {
              setSelectedDevice(keys?.filter((item) => !selectedDevice?.includes(item)))
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
              id: 'id',
              key: 'id',
              title: 'Наименование',
              dataIndex: ['name', lang],
            },
          ]}
          rows={list}
          total={total}
          onClickRow={onClickRow}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div className="flex-1">
        <div className="flex align-middle gap-4 items-center">
          <Select
            value={selectedTariff}
            disabled={selectedDevice?.length < 1}
            onSelect={(e) => setSelectedTariff(e)}
            className={'w-1/2 my-4'}
          >
            {tariffList?.data
              ?.filter((item) => !connectedList?.some((i) => i.id === item?.id))
              ?.map((tariff) => (
                <Select.Option value={tariff.id}>{tariff.name?.[lang]}</Select.Option>
              ))}
          </Select>
          <Button
            loading={onConnectTariffToDevice?.isPending}
            disabled={
              onConnectTariffToDevice?.isPending || selectedDevice?.length < 1 || !selectedTariff
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
                    onClick={() => onConnectTariff(row)}
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

export default ConnectTariffsToRouters
