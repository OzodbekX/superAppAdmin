import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Button, Image } from 'antd'

const DeviceCategoryList = ({ setFilters, filters, list, total, setSelectedDeviceCatalog }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'title',
      key: 'title',
      width: '25%',
      title: 'Заголовок',
      dataIndex: ['title', lang],
    },
    {
      id: 'description',
      key: 'description',
      width: '25%',
      title: 'Описание',
      dataIndex: ['description', lang],
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
            className={'rounded-xl px-2'}
            style={{ width: 'min-content', backgroundColor: color }}
          >
            {color}
          </div>
        )
      },
    },
    {
      id: 'image',
      key: 'image',
      title: 'Изображение',
      dataIndex: ['image'],
      width: '20%',
      render: (image) => {
        return <Image height={50} src={image?.[lang]} />
      },
    },
  ]

  const onClickRow = (row) => {
    setSelectedDeviceCatalog(row)
  }

  const onClickAdd = () => {
    setSelectedDeviceCatalog({
      title: {
        ru: '',
        uz: '',
      },
      description: {
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
        rows={list}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default DeviceCategoryList
