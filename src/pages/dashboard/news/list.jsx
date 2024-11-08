import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Button, Image } from 'antd'

const NewsList = ({ setFilters, filters, News, total, setSelectedNews }) => {
  const lang = userStore((state) => state.language)

  const headCells = [
    {
      id: 'name',
      key: 'name',
      width: '40%',
      title: 'Заголовок',
      dataIndex: ['title', lang],
    },
    {
      id: 'name',
      key: 'name',
      width: '40%',
      height: '60px',
      title: 'Описание',
      dataIndex: ['description'],
      render: (description) => (
        <div style={{ height: '60px' }} className={'h-1 overflow-hidden overflow-ellipsis'}>
          {description?.[lang]}
        </div>
      ),
    },
    {
      id: 'image',
      key: 'image',
      title: 'Изображение',
      dataIndex: ['shortImage'],
      render: (shortImage) => {
        return <Image height={50} src={shortImage?.[lang]} />
      },
    },
  ]

  const onClickRow = (row) => {
    setSelectedNews(row)
  }

  const onClickAdd = () => {
    setSelectedNews({
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
        <div className={'text-3xl font-semibold mt-1'}>Новости</div>
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
        rows={News}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default NewsList
