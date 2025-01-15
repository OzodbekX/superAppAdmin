import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Badge, Button, Image } from 'antd'
import { convertToCustomFormat } from '@/utils/functions.js'

const StoriesList = ({ setFilters, filters, stories, total, setSelectedStory }) => {
  const lang = userStore((state) => state.language)

  const headCells = [
    {
      id: 'createdAt',
      key: 'createdAt',
      width: '20%',
      title: 'Время создания',
      render: (row, head) => (
        <div key={row?.id} className={'overflow-ellipsis'}>
          {convertToCustomFormat(row.createdAt)}
        </div>
      ),
    },
    {
      id: 'image',
      key: 'image',
      width: '30%',
      title: 'Изображение',
      render: (row, head) => {
        return <Image height={50} src={row?.image?.[lang]} />
      },
    },
    {
      id: 'isActive',
      key: 'isActive',
      align: 'left',
      width: '10%',
      sorter: (a, b) => (a.isActive && b.isActive ? 1 : !a.isActive ? 1 : 0),
      render: (row, head) => (
        <Badge
          key={row?.id}
          showZero
          color={row?.isActive ? '#52c41a' : '#faad14'}
          count={row?.isActive ? 'активный' : 'неактивный'}
        />
      ),
      title: 'Статус',
    },
  ]

  const onClickRow = (row) => {
    setSelectedStory(row)
  }

  const onClickAdd = () => {
    setSelectedStory({
      isActive: true,
      image: {
        ru: '',
        uz: '',
      },
      slides: [
        {
          clickableArea: 'TOP',
          image: { ru: '', uz: '' },
          isActive: true,
          type: 'IMAGE',
        },
      ],
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <div className={'text-3xl font-semibold mt-1'}>Истории</div>
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
        rows={stories}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default StoriesList
