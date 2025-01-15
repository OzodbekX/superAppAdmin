import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Badge, Button, Image } from 'antd'

const StaffList = ({ setFilters, filters, list, total, setSelectedStaff }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'name',
      key: 'name',
      width: '25%',
      title: 'Полное имя',
      render: (row) => {
        return (
          <div className={'rounded-xl flex '}>
            {row?.lastName} {row?.firstName}
          </div>
        )
      },
    },
    {
      id: 'subtitle',
      key: 'subtitle',
      width: '15%',
      title: 'Логин',
      align: 'center',
      dataIndex: ['login'],
    },
    {
      id: 'phoneNumber',
      key: 'phoneNumber',
      width: '15%',
      align: 'center',
      title: 'Номер телефона',
      dataIndex: ['phoneNumber'],
    },
    {
      id: 'nickname',
      key: 'nickname',
      width: '15%',
      title: 'Никнейм',
      align: 'center',
      dataIndex: ['nickname'],
    },
    {
      id: 'role',
      key: 'role',
      width: '10%',
      title: 'Роль',
      align: 'center',
      dataIndex: ['role', 'name', lang],
    },
    {
      id: 'photo',
      key: 'photo',
      width: '10%',
      title: 'Изображение',
      align: 'center',
      dataIndex: ['photo'],
      render: (photo) => {
        return <Image height={50} src={photo} />
      },
    },
    {
      id: 'isActive',
      key: 'isActive',
      title: 'Статус',
      align: 'center',
      width: '10%',
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
    setSelectedStaff(row)
  }

  const onClickAdd = () => {
    setSelectedStaff({
      firstName: '',
      lastName: '',
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <div className={'text-3xl font-semibold mt-1'}>Сотрудники компании</div>
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

export default StaffList
