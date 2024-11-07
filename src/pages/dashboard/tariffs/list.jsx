import { userStore } from '@/utils/zustand.js'
import { addSpaceEveryThreeChars, secondsToTime } from '@/utils/functions.js'
import AntTable from '@/components/AntTable/index.jsx'
import * as React from 'react'
import { Badge, Button } from 'antd'
import { Typography } from '@material-tailwind/react'

const TariffList = ({ setFilters, filters, selectOptions, tariffs, total, setSelectedTariff }) => {
  const lang = userStore((state) => state.language)

  const tableNameSorter = (a, b) => {
    // Convert name to lowercase to make the sorting case-insensitive
    const nameA = a?.name?.[lang].toLowerCase()
    const nameB = b?.name?.[lang].toLowerCase()
    if (nameA < nameB) {
      return -1 // a comes before b
    }
    if (nameA > nameB) {
      return 1 // a comes after b
    }
    return 0 // a and b are equal
  }

  const headCells = [
    {
      id: 'name',
      key: 'name',
      // render: (row, head) => <div>{row.name?.[lang]}</div>,
      title: 'Наименование',
      sorter: tableNameSorter,
      dataIndex: ['name', lang],
    },
    {
      id: 'devices',
      key: 'devices',
      render: (row, head) => (
        <div key={row?.id}>
          {row?.devicesMinAmount} - {row?.devicesMaxAmount}
        </div>
      ),

      title: 'Устройства',
    },
    {
      id: 'Тип',
      key: 'Тип',
      dataIndex: ['type'],

      render: (type) => <div key={type}>{selectOptions?.find((i) => i?.value == type)?.label}</div>,

      title: 'Устройства',
    },
    {
      id: 'price',
      key: 'price',
      align: 'left',
      render: (row, head) => <div>{addSpaceEveryThreeChars(row?.price)}</div>,
      title: 'Цена',
      sorter: (a, b) => a.price - b.price,
    },
    {
      id: 'speedByTime',
      key: 'speed',
      align: 'left',
      render: (row, head) => (
        <div key={row?.id}>
          {row?.speedByTime?.map((item, index) => (
            <div key={index}>
              {secondsToTime(item?.fromTime)} - {secondsToTime(item?.toTime)}
              <span className={'ml-1'}>{Math.round(item?.speed / 1024)} MB/s</span>
            </div>
          ))}
        </div>
      ),
      title: 'Скорость',
    },
    {
      id: 'isActive',
      key: 'isActive',
      align: 'left',
      title: 'Статус',
      filterSearch: true,
      sorter: (a, b) => (a.isActive && b.isActive ? 0 : a.isActive ? 1 : -1),
      render: (row, head) => (
        <Badge
          key={row?.id}
          showZero
          color={row?.isActive ? '#52c41a' : '#faad14'}
          count={row?.isActive ? 'активный' : 'неактивный'}
        />
      ),
    },
  ]

  const onClickRow = (row) => {
    setSelectedTariff(row)
  }

  const onClickAdd = () => {
    setSelectedTariff({
      descriptions: [],
      devicesMaxAmount: 0,
      devicesMinAmount: 0,
      name: {
        ru: '',
        uz: '',
      },
      image: {
        ru: '',
        uz: '',
      },
      trafficType: false,
      price: 0,
      speedByTime: [
        {
          fromTime: 0,
          toTime: 86400,
        },
      ],
    })
  }

  return (
    <div className=" flex flex-col gap-6">
      <div className="flex justify-between ">
        {/*<Button*/}
        {/*  onClick={onClickAdd}*/}
        {/*  size={'sm'}*/}
        {/*  className={'flex align-middle pointer-events-auto'}*/}
        {/*>*/}
        {/*  <Typography className={'font-semibold'} style={{ fontSize: '12px', margin: '3px' }}>*/}
        {/*    Добавить*/}
        {/*  </Typography>*/}
        {/*</Button>*/}
      </div>
      <AntTable
        headCells={headCells}
        rows={tariffs}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default TariffList
