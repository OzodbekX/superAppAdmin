import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Button } from 'antd'

const DeviceTagList = ({ setFilters, filters, list, total, setSelectedDeviceTag }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'name',
      key: 'name',
      width: '50%',
      title: 'Заголовок',
      dataIndex: ['name', lang],
    },
    {
      id: 'color',
      key: 'color',
      width: '20%',
      title: 'Цвет фона',
      dataIndex: ['color'],
      render: (color) => {
        return (
          <div
            className={'rounded-xl px-2 bg-gray-200 font-bold'}
            style={{ width: 'min-content', color: color }}
          >
            {color}
          </div>
        )
      },
    },
  ]

  const onClickRow = (row) => {
    setSelectedDeviceTag(row)
  }

  const onClickAdd = () => {
    setSelectedDeviceTag({
      name: {
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
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
        rows={list}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default DeviceTagList
