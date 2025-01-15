import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  connectDeviceToTariff,
  fetchDevicesWithConnectedTariffs,
  fetchWifiDevices,
} from '@/utils/api/functions.js'
import AntTable from '@/components/AntTable/index.jsx'
import { userStore } from '@/utils/zustand.js'
import { Button, Select } from 'antd'

const ConnectTariffsToRouters = ({ filters, setFilters, list, total }) => {
  const [selectedTariff, setSelectedTariff] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(undefined)
  const [updateList, setUpdateList] = useState(false)
  const [connectedList, setConnectedList] = useState([])

  const lang = userStore((state) => state.language)

  const { data: deviceList } = useQuery({
    queryKey: ['fetchWifiDevices'], // The query key depends on the page and pageSize
    queryFn: () => fetchWifiDevices({ offset: 0, limit: 100 }), // Fetch the correct page

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: connectedDevicesList } = useQuery({
    queryKey: ['fetchDevicesWithConnectedTariffs', selectedTariff, updateList], // The query key depends on the page and pageSize
    queryFn: () => fetchDevicesWithConnectedTariffs(selectedTariff?.[0]), // Fetch the correct page

    gcTime: 20 * 60 * 1000,
    enabled: !!selectedTariff?.[0],
  })

  const onConnectDeviceToTariff = useMutation({
    // Optional callbacks
    mutationFn: connectDeviceToTariff,
    onSuccess: (_, variables) => {
      setSelectedDevice(undefined)
      setUpdateList(!updateList)
    },
  })

  const onClickRow = (row) => {
    setSelectedTariff([row?.id])
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
      let tariff = deviceList?.data?.find((i) => i?.id === selectedDevice)
      list = [{ id: selectedDevice, position: 0, name: tariff?.name }]
      if (connectedList) {
        connectedList?.forEach((item, index) => {
          list.push({ id: item?.id, position: index + 1, name: item?.name })
        })
      }
    }

    onConnectDeviceToTariff?.mutate({
      id: selectedTariff?.[0],
      params: { ...connectedDevicesList, devices: list },
    })
  }

  useEffect(() => {
    setConnectedList(connectedDevicesList?.devices?.sort((a, b) => a?.position - b?.position) || [])
  }, [connectedDevicesList])

  return (
    <div className={'flex gap-4'}>
      <div className="flex-1">
        <div className={'font-bold text-black my-4 text-2xl'}>
          Пожалуйста, выберите, чтобы завязать.
        </div>
        <AntTable
          rowSelection={{
            selectedRowKeys: selectedTariff,
            onChange: (keys) => {
              setSelectedTariff(keys?.filter((item) => !selectedTariff?.includes(item)))
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
            disabled={selectedTariff?.length < 1}
            value={selectedDevice}
            onSelect={(e) => setSelectedDevice(e)}
            className={'w-1/2 my-4'}
          >
            {deviceList?.data
              ?.filter((item) => !connectedList?.some((i) => i.id === item?.id))
              ?.map((tariff) => (
                <Select.Option value={tariff.id}>{tariff.name?.[lang]}</Select.Option>
              ))}
          </Select>
          <Button
            loading={onConnectDeviceToTariff?.isPending}
            disabled={
              onConnectDeviceToTariff?.isPending || !selectedDevice || selectedTariff?.length < 1
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
                    loading={onConnectDeviceToTariff?.isPending}
                    disabled={onConnectDeviceToTariff?.isPending}
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
