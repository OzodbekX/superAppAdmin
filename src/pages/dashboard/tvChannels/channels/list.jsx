import AntTable from '@/components/AntTable/index.jsx'
import * as React from 'react'
import { Button, Image } from 'antd'
import { Typography } from '@material-tailwind/react'
import { userStore } from '@/utils/zustand.js'

const ChannelsList = ({ setFilters, filters, data, total, setSelectedChannel }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'Логотип',
      key: 'Логотип',
      title: 'Логотип',
      width: '10%',
      render: (row) => {
        return <Image height={50} src={row?.image} />
      },
    },
    {
      title: 'Название канала',
      dataIndex: ['name', 'ru'],
      key: 'name_ru',
      width: '25%',
    },
    {
      title: 'Категории',
      dataIndex: 'categories',
      id: 'categories',
      key: 'categories',
      width: '30%',
      render: (categories) => (
        <div className={'flex gap-2 flex-wrap'}>
          {categories?.map((category) => (
            <div
              key={category.id}
              className={'bg-gray-200 px-2 rounded-xl'}
              style={{ width: 'fit-content' }}
            >
              {category?.name?.[lang]}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Тарифы',
      dataIndex: 'tariffs',
      key: 'tariffs',
      width: '25%',
      render: (tariffs) => (
        <div className={'flex gap-2 flex-wrap'}>
          {tariffs?.map((tariff) => (
            <div
              key={tariff?.id}
              className={'bg-gray-200 px-2 rounded-xl'}
              style={{ width: 'fit-content' }}
            >
              {tariff?.title?.[lang]}
            </div>
          ))}
        </div>
      ),
    },
  ]

  const onClickRow = (row) => {
    setSelectedChannel(row)
  }
  const onClickAdd = () => {
    setSelectedChannel({
      name: {
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className="rounded-3xl flex flex-col gap-6 bg-white">
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
        headCells={headCells}
        rows={data}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default ChannelsList
