import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Button } from 'antd'

const RateOptionsList = ({ setFilters, filters, faqs, total, setSelectedRateOption }) => {
  const headCells = [
    {
      id: 'position',
      key: 'position',
      width: '4%',
      title: 'Позиция',
      align: 'center',
      dataIndex: ['position'],
    },
    {
      id: 'title uz',
      key: 'title uz',
      width: '40%',
      title: 'Заголовок Уз',
      dataIndex: ['valueUz'],
    },
    {
      id: 'title',
      key: 'title',
      width: '40%',
      title: 'Заголовок Ру',
      dataIndex: ['valueRu'],
    },
    {
      id: 'rate',
      key: 'rate',
      width: '16%',
      title: 'Оценка',
      dataIndex: ['rates'],
      render: (rates) => (
        <div className={'flex'}>
          {rates?.map((item, index) => (
            <p>
              {index > 0 && ', '}
              {item}
            </p>
          ))}
        </div>
      ),
    },
  ]

  const onClickRow = (row) => {
    setSelectedRateOption(row)
  }

  const onClickAdd = () => {
    setSelectedRateOption({
      valueUz: '',
      valueRu: '',
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className={'text-3xl'}>Варианты оценки</div>
      <div className="flex justify-between ">
        <Button
          onClick={onClickAdd}
          style={{ top: '92px', right: '50px', zIndex: 10 }}
          size={'sm'}
          className={'fixed'}
        >
          <Typography className={'font-semibold'} style={{ fontSize: '12px', margin: '3px' }}>
            Добавить
          </Typography>
        </Button>
      </div>
      <AntTable
        headCells={headCells}
        rows={faqs}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default RateOptionsList
