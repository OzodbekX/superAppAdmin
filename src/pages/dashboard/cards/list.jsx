import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Image, Button } from 'antd'

const CardsList = ({ setFilters, filters, cards, total, setSelectedCards }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'name',
      key: 'name',
      width: '40%',
      title: 'Описание',
      dataIndex: ['title', lang],
    },
    {
      id: 'image',
      key: 'image',
      title: 'Изображение',
      dataIndex: ['image', lang],
      render: (url) => {
        return <Image height={50} src={url} />
      },
    },
  ]

  const onClickRow = (row) => {
    setSelectedCards(row)
  }

  const onClickAdd = () => {
    setSelectedCards({
      image: {
        ru: '',
        uz: '',
      },
      title: {
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <div className={'text-3xl font-semibold mt-1'}>Навигационные карты</div>
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
        rows={cards}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default CardsList
