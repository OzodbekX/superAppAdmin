import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Button, Image } from 'antd'
import { pageOptions } from '@/data/common-variabeles.js'

const BannerList = ({ setFilters, bannerTypes, list, setSelectedBanner }) => {
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
      id: 'resourceKey',
      key: 'resourceKey',
      width: '20%',
      title: 'Идентификатор',
      dataIndex: ['resourceKey'],
    },
    {
      id: 'resourceKey',
      key: 'resourceKey',
      width: '20%',
      title: 'Страница',
      dataIndex: ['resourceKey'],
      render: (resourceKey) => (
        <div key={resourceKey} className={'overflow-ellipsis'}>
          {pageOptions?.find((i) => i.value === resourceKey)?.label}
        </div>
      ),
    },
    {
      id: 'type',
      key: 'type',
      width: '15%',
      height: '60px',
      title: 'Тип',
      dataIndex: ['type'],
      render: (type) => (
        <div key={type} className={'overflow-ellipsis'}>
          {bannerTypes?.find((item) => item?.value === type)?.label}
        </div>
      ),
    },
    {
      id: 'button',
      key: 'button',
      width: '15%',
      title: 'Кнопка',
      render: (row) => {
        return row?.button?.text?.[lang] ? (
          <Button key={row?.id} className={'overflow-ellipsis'}>
            {row?.button?.text?.[lang]}
          </Button>
        ) : (
          <div>-</div>
        )
      },
    },
    {
      id: 'image',
      key: 'image',
      width: '10%',
      title: 'Изображение',
      dataIndex: ['desktopImageURL'],
      render: (desktopImageURL) => {
        return <Image height={50} src={desktopImageURL?.[lang]} />
      },
    },
  ]
  const onClickRow = (row) => {
    setSelectedBanner(row)
  }

  const onClickAdd = () => {
    setSelectedBanner({
      resourceKey: '',
      type: '',
      isActive: true,
      imageUrl: '',
      link: '',
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <div className={'text-3xl font-semibold mt-1'}>Баннеры</div>
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
      <AntTable headCells={headCells} rows={list} onClickRow={onClickRow} setFilters={setFilters} />
    </div>
  )
}

export default BannerList
