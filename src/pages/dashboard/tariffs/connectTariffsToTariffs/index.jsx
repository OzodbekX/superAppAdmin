import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchTariffs, updateTariffs } from '@/utils/api/functions.js'
import AntTable from '@/components/AntTable/index.jsx'
import { userStore } from '@/utils/zustand.js'
import { Button, Select } from 'antd'

const ConnectTariffsToTariffs = () => {
  const [selectedTariffLeft, setSelectedTariffLeft] = useState([])
  const [selectedTariffRight, setSelectedTariffRight] = useState(undefined)
  const [updateList, setUpdateList] = useState(false)
  const [connectedList, setConnectedList] = useState([])
  const [filters, setFilters] = useState({ pageSize: 10, page: 0 })
  const lang = userStore((state) => state.language)

  const { data: leftTariffList } = useQuery({
    queryKey: ['fetchTariffs', filters, updateList], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchTariffs({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const selectedTariff = useMemo(() => {
    return leftTariffList?.data?.find((i) => i.id === selectedTariffLeft?.[0]) || {}
  }, [leftTariffList, selectedTariffLeft])

  const { data: tariffListToSelect } = useQuery({
    queryKey: ['fetchTariffs'], // The query key depends on the page and pageSize
    queryFn: () => fetchTariffs({ offset: 0, limit: 100 }), // Fetch the correct page

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const onConnectDeviceToTariff = useMutation({
    // Optional callbacks
    mutationFn: updateTariffs,
    onSuccess: (_, variables) => {
      setSelectedTariffRight(undefined)
      setUpdateList(!updateList)
    },
  })

  const onClickRow = (row) => {
    setSelectedTariffLeft([row?.id])
  }

  const onConnectTariff = (row) => {
    let sellectedList = []
    if (row?.id) {
      connectedList?.forEach((item) => {
        if (item?.id !== row?.id) {
          sellectedList.push(item?.id)
        }
      })
    } else {
      sellectedList = [selectedTariffRight]
      if (connectedList) {
        connectedList?.forEach((item) => {
          if (!sellectedList?.includes(item?.id)) {
            sellectedList.push(item?.id)
          }
        })
      }
    }

    const categoryList = selectedTariffLeft?.categories?.map((i) => ({
      id: i.id,
      position: i.position,
    }))

    onConnectDeviceToTariff?.mutate({
      id: selectedTariffLeft?.[0],
      params: {
        ...selectedTariff,
        anotherTariffs: sellectedList,
        categories: categoryList,
      },
    })
  }

  useEffect(() => {
    setConnectedList(
      selectedTariff?.anotherTariffs
        ?.sort((a, b) => a?.position - b?.position)
        .filter((item) => item?.id !== selectedTariffLeft?.[0]) || []
    )
  }, [selectedTariff, selectedTariffLeft?.[0]])

  return (
    <div className={'flex gap-4'}>
      <div className="flex-1">
        <div className={'font-bold text-black my-4 text-2xl'}>
          Пожалуйста, выберите, чтобы завязать.
        </div>
        <AntTable
          rowSelection={{
            selectedRowKeys: selectedTariffLeft,
            onChange: (keys) => {
              setSelectedTariffLeft(keys?.filter((item) => !selectedTariffLeft?.includes(item)))
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
          rows={leftTariffList?.data}
          total={leftTariffList?.meta?.total}
          onClickRow={onClickRow}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div className="flex-1">
        <div className="flex align-middle gap-4 items-center">
          <Select
            disabled={selectedTariffLeft?.length < 1}
            value={selectedTariffRight}
            onSelect={(e) => setSelectedTariffRight(e)}
            className={'w-1/2 my-4'}
          >
            {tariffListToSelect?.data
              ?.filter(
                (item) =>
                  item?.id !== selectedTariffLeft?.[0] &&
                  !connectedList?.some((i) => i.id === item?.id)
              )
              ?.map((tariff) => (
                <Select.Option value={tariff.id}>{tariff.name?.[lang]}</Select.Option>
              ))}
          </Select>
          <Button
            loading={onConnectDeviceToTariff?.isPending}
            disabled={
              onConnectDeviceToTariff?.isPending ||
              !selectedTariffRight ||
              selectedTariffLeft?.length < 1
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

export default ConnectTariffsToTariffs
