import React from 'react'
import { userStore } from '@/utils/zustand.js'
import { addSpaceEveryThreeChars } from '@/utils/functions.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Badge, Button } from 'antd'
import { Typography } from '@material-tailwind/react'

const WifiList = ({ setFilters, filters, wifis, total, setSelectedWifi }) => {
  const lang = userStore((state) => state.language)
  const tableNameSorter = (a, b) => {
    // Convert names to lowercase to make the sorting case-insensitive
    const nameA = a?.names?.[lang].toLowerCase()
    const nameB = b?.names?.[lang].toLowerCase()
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
      dataIndex: ['name', lang],
      title: 'Наименование',
      sorter: tableNameSorter,
    },
    {
      id: 'installmentPeriod',
      key: 'installmentPeriod',
      dataIndex: ['installmentPeriod', lang],
      title: 'Период рассрочки',
    },
    {
      id: 'installmentPrice',
      key: 'installmentPrice',
      dataIndex: ['installmentPrice'],
      title: 'Цена в рассрочку',
    },

    {
      id: 'price',
      key: 'price',
      align: 'left',
      dataIndex: ['price'],
      render: (price) => <div>{addSpaceEveryThreeChars(price)}</div>,
      title: 'Цена',
      sorter: (a, b) => a.price - b.price,
    },
    {
      id: 'speed',
      key: 'speed',
      dataIndex: ['speed'],
      align: 'left',
      render: (speed) => <div key={speed}>{speed} мб/с</div>,
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
    setSelectedWifi(row)
  }

  const onClickAdd = () => {
    setSelectedWifi({
      name: {
        en: '',
        ru: '',
        uz: '',
      },
      isActive: true,
      // speed: '56 mb/s',
      tags: [],
      catalogs: [],
      // coverageArea: 'butun hudud',
      // limitOfDevices: 'string',
      // price: 3635,
      // installmentPrice: 234,
      installmentPeriod: {
        en: '',
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className="px-4 rounded-3xl flex flex-col gap-6 bg-white">
      <Button
        onClick={onClickAdd}
        style={{ top: '92px', right: '50px', zIndex: 10 }}
        size={'sm'}
        className={'fixed'}
      >
        <Typography className={'font-semibold'} style={{ fontSize: '12px', margin: '3px' }}>
          Добавить
        </Typography>
      </Button>
      <AntTable
        headCells={headCells}
        rows={wifis}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default WifiList
