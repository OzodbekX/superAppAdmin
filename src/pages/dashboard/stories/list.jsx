import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Badge, Button, Image } from 'antd'

const StoriesList = ({ setFilters, filters, stories, total, setSelectedStory }) => {
  const lang = userStore((state) => state.language)

  const headCells = [
    {
      id: 'Тип',
      key: 'Тип',
      title: 'Id',
      width: '30%',
      render: (row, head) => {
        return (
          <div className="flex flex-1 gap-2">
            {row.slides?.map((item, index) =>
              item?.type === 'image' ? (
                <div className={'mx-1'}>Изображение</div>
              ) : (
                <div className={'mx-1'}>Видео</div>
              )
            )}
          </div>
        )
      },
    },
    {
      id: 'image',
      key: 'image',
      width: '30%',
      title: 'Изображение',
      render: (row, head) => {
        return <Image height={50} src={row?.image_url?.[lang]} />
      },
    },
    {
      id: 'slides',
      key: 'slides',
      title: 'Слайды',
      width: '30%',
      render: (row, head) => {
        return (
          <div className="flex flex-1 gap-2">
            {row.slides?.map((item, index) =>
              item?.type === 'image' ? (
                <Image key={index} height={50} src={item?.image_url?.[lang]} />
              ) : (
                <Image key={index} height={50} src={row?.image_url?.[lang]} />
              )
            )}
          </div>
        )
      },
    },
    {
      id: 'status',
      key: 'status',
      align: 'left',
      width: '10%',
      sorter: (a, b) => (a.status && b.status === 'active' ? 1 : a.status !== 'active' ? 1 : 0),
      render: (row, head) => (
        <Badge
          key={row?.id}
          showZero
          color={row?.status === 'active' ? '#52c41a' : '#faad14'}
          count={row?.status === 'active' ? 'активный' : 'неактивный'}
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
      status: 'active',
      image_url: {
        ru: '',
        uz: '',
      },
      slides: [
        {
          clickable_area: 'Top',
          image_url: { ru: '', uz: '' },
          status: 'active',
          type: 'image',
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
