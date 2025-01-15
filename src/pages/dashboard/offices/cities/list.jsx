import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import { Button } from 'antd'

import * as React from 'react'

const CityList = ({ setFilters, filters, list, total, setSelectedCity }) => {
  const headCells = [
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
      id: 'name_uz',
      key: 'name_uz',
      dataIndex: ['name', 'uz'],
      width: '30%',
      title: 'Наименование uz',
    },
    {
      id: 'name',
      key: 'name',
      dataIndex: ['name', 'ru'],
      width: '30%',
      title: 'Наименование ru',
    },
  ]

  const onClickRow = (row) => {
    setSelectedCity(row)
  }

  const onClickAdd = () => {
    setSelectedCity({
      name: {
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <div className={'text-3xl font-semibold mt-1'}>Офисы</div>
        <Button
          onClick={onClickAdd}
          size={'sm'}
          className={'flex align-middle pointer-events-auto'}
        >
          <Typography className={'font-semibold'} style={{ fontSize: '12px', margin: '3px' }}>
            Добавить
          </Typography>
        </Button>
      </div>
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

export default CityList
