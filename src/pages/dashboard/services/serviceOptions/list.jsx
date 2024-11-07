import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Badge, Button } from 'antd'
import { addSpaceEveryThreeChars } from '@/utils/functions.js'

const ServiceOptionList = ({ setFilters, filters, list, total, setSelectedServiceOption }) => {
  const lang = userStore((state) => state.language)
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
      id: 'name',
      key: 'name',
      width: '50%',
      title: 'Заголовок',
      dataIndex: ['name', lang],
    },
    {
      id: 'price',
      key: 'price',
      align: 'left',
      title: 'Цена',
      render: (row) => (
        <div>
          {addSpaceEveryThreeChars(row?.price?.unitPrice)} {row?.price?.currency}
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
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
    setSelectedServiceOption(row)
  }

  const onClickAdd = () => {
    setSelectedServiceOption({
      name: {
        ru: '',
        uz: '',
      },
      isActive: true,
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

export default ServiceOptionList
