import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Badge, Button } from 'antd'

const DeviceServiceList = ({ setFilters, filters, list, total, setSelectedServiceCatalog }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'name',
      key: 'name',
      width: '25%',
      title: 'Заголовок',
      dataIndex: ['name', lang],
    },
    {
      id: 'subtitle',
      key: 'subtitle',
      width: '25%',
      title: 'Подзаголовок',
      dataIndex: ['subtitle', lang],
    },
    {
      id: 'description',
      key: 'description',
      width: '35%',
      title: 'Описание',
      dataIndex: ['description', lang],
    },
    {
      id: 'color',
      key: 'color',
      width: '10%',
      title: 'Цвет и индекс',
      render: (row) => {
        return (
          <div
            className={'rounded-xl px-2'}
            style={{ width: 'min-content', backgroundColor: row?.backgroundColor }}
          >
            {row?.position}
          </div>
        )
      },
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
    setSelectedServiceCatalog(row)
  }

  const onClickAdd = () => {
    setSelectedServiceCatalog({
      name: {
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
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <div className={'text-3xl font-semibold mt-1'}>Service</div>
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

export default DeviceServiceList
