import React from 'react'
import AntTable from '@/components/AntTable/index.jsx'
import { convertToCustomFormat } from '@/utils/functions.js'
import { Typography } from '@material-tailwind/react'
import { Button } from 'antd'

const headCells = [
  {
    id: 'id',
    key: 'Id',
    title: 'Id',
    width: '20%',
    dataIndex: 'id',
  },
  {
    title: 'Название канала',
    dataIndex: ['name', 'ru'],
    key: 'name_ru',
    width: '25%',
  },
  {
    id: 'createdAt',
    key: 'createdAt',
    width: '20%',
    title: 'время создания',
    render: (row) => (
      <div key={row?.id} className={'overflow-ellipsis'}>
        {convertToCustomFormat(row.createdAt)}
      </div>
    ),
  },
]

const ChannelCategoryList = ({ setFilters, filters, data, total, setSelectedCategory }) => {
  const onClickRow = (row) => {
    setSelectedCategory(row)
  }
  const onClickAdd = () => {
    setSelectedCategory({
      name: {
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className=" rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between gap-3 ">
        <Button
          onClick={onClickAdd}
          style={{ top: '92px', right: '50px', zIndex: 10 }}
          size={'sm'}
          className={'fixed'}
        >
          <Typography style={{ fontSize: '12px', margin: '3px' }}>Добавить</Typography>
        </Button>
      </div>
      <AntTable
        headCells={
          filters?.submitterType === 'legal-entity'
            ? headCells
            : headCells.filter((i) => i.id !== 'organizationName')
        }
        rows={data}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default ChannelCategoryList
