import React from 'react'
import AntTable from '@/components/AntTable/index.jsx'
import { addSpaceEveryThreeChars } from '@/utils/functions.js'
import { Typography } from '@material-tailwind/react'
import { Image, Button } from 'antd'

const headCells = [
  {
    id: 'Изображение',
    key: 'Изображение',
    title: 'Изображение',
    width: '10%',
    render: (row) => {
      return <Image height={50} src={row?.image.ru} />
    },
  },
  {
    title: 'Название канала',
    dataIndex: ['title', 'ru'],
    key: 'name_ru',
    width: '25%',
  },
  {
    id: 'price',
    key: 'price',
    align: 'left',
    render: (row) => <div>{addSpaceEveryThreeChars(row?.price)} сум</div>,
    title: 'Цена',
    sorter: (a, b) => a.price - b.price,
  },
  {
    id: 'countChannels',
    key: 'countChannels',
    width: '20%',
    title: 'Количество связанных каналов',
    dataIndex: 'countChannels',
  },
]

const ChannelTariffList = ({ setFilters, filters, data, total, setSelectedTariff }) => {
  const onClickRow = (row) => {
    setSelectedTariff(row)
  }
  const onClickAdd = () => {
    setSelectedTariff({
      title: {
        ru: '',
        uz: '',
      },
      image: {
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

export default ChannelTariffList
