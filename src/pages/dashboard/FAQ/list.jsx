import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Badge, Button } from 'antd'

const FAQsList = ({ setFilters, filters, faqs, total, setSelectedFAQs }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'question',
      key: 'question',
      width: '20%',
      title: 'Вопрос',
      dataIndex: ['question', lang],
    },
    {
      id: 'answer',
      key: 'answer',
      title: 'Ответ',
      width: '60%',
      dataIndex: ['answer', lang],
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
    setSelectedFAQs(row)
  }

  const onClickAdd = () => {
    setSelectedFAQs({
      question: {
        ru: '',
        uz: '',
      },
      answer: {
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <div className={'text-3xl font-semibold mt-1'}>FAQ</div>
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
        rows={faqs}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default FAQsList
