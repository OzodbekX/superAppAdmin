import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { useCallback } from 'react'
import { Badge, Button, Image, Select } from 'antd'
import { debounce } from 'lodash'

const OfficeList = ({ setFilters, filters, cityList, list, total, setSelectedOffice }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'address',
      key: 'address',
      width: '25%',
      title: 'Адрес',
      dataIndex: ['address', lang],
    },
    {
      id: 'landmark',
      key: 'landmark',
      width: '25%',
      height: '60px',
      title: 'Ориентир',
      dataIndex: ['landmark', lang],
    },
    {
      id: 'coords',
      key: 'coords',
      width: '20%',
      height: '60px',
      title: 'Координаты',
      dataIndex: ['coords'],
      render: (coords) => {
        return (
          <div>
            {coords?.lat} - {coords?.long}
          </div>
        )
      },
    },
    {
      id: 'imageUrl',
      key: 'imageUrl',
      title: 'Изображение',
      dataIndex: ['imageUrl'],
      width: '20%',
      render: (imageUrl) => {
        return <Image height={50} src={imageUrl} />
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
    setSelectedOffice(row)
  }

  const onClickAdd = () => {
    setSelectedOffice({
      address: {
        ru: '',
        uz: '',
      },
      landmark: {
        ru: '',
        uz: '',
      },
    })
  }

  const updateFilters = useCallback(
    debounce((newFilters) => {
      setFilters((prev) => ({
        ...prev,
        offset: 0,
        page: 0,
        ...newFilters,
      }))
    }, 1000), // 1000ms debounce
    []
  )

  const handleStatusChange = (value) => {
    updateFilters({ cityId: value })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between items-center">
        <div className={'text-3xl flex-1 font-semibold'}>Офисы</div>
        <Select
          allowClear={true}
          value={filters?.cityId}
          placeholder="Select cityId"
          className={'w-80 mr-8'}
          onChange={handleStatusChange}
        >
          {cityList?.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name?.[lang]}
            </Option>
          ))}
        </Select>
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

export default OfficeList
