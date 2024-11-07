import { userStore } from '@/utils/zustand.js'
import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { Badge, Button } from 'antd'

const ChatFAQsList = ({ setFilters, filters, faqs, total, setSelectedChatFAQs }) => {
  const lang = userStore((state) => state.language)
  const headCells = [
    {
      id: 'position',
      key: 'position',
      title: 'Позиция',
      width: '5%',
      dataIndex: ['position'],
    },
    {
      id: 'question',
      key: 'question',
      width: '20%',
      title: 'Вопрос',
      dataIndex: ['questionRu'],
    },
    {
      id: 'answer',
      key: 'answer',
      title: 'Ответ uz',
      width: '40%',
      dataIndex: ['answerUz'],
    },
    {
      id: 'answer',
      key: 'answer',
      title: 'Ответ',
      width: '40%',
      dataIndex: ['answerRu'],
    },
  ]

  const onClickRow = (row) => {
    setSelectedChatFAQs(row)
  }

  const onClickAdd = () => {
    setSelectedChatFAQs({
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

export default ChatFAQsList
