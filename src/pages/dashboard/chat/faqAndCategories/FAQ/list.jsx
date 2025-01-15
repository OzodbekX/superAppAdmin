import AntTable from '@/components/AntTable/index.jsx'
import { Typography } from '@material-tailwind/react'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { Button, Input } from 'antd'
import { debounce } from 'lodash'

const ChatFAQsList = ({ setFilters, filters, faqs, total, setSelectedChatFAQs }) => {
  const [searchText, setSearchText] = useState('')

  const headCells = [
    {
      id: 'categories',
      key: 'categories',
      width: '20%',
      title: 'Название категории',
      dataIndex: ['categories'],
      render: (categories) => (
        <div key={categories?.id}>
          {categories?.map((item, index) => (
            <div key={index}>
              <span className={'ml-1'}>{item?.nameRu}</span>
            </div>
          ))}
        </div>
      ),
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
      width: '30%',
      dataIndex: ['answerUz'],
    },
    {
      id: 'answer',
      key: 'answer',
      title: 'Ответ',
      width: '30%',
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
  // Debounced function to update filters
  const debouncedSetFilter = useCallback(
    debounce((value) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        searchText: value,
      }))
    }, 500),
    []
  )
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchText(value)
    debouncedSetFilter(value)
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between ">
        <Input
          placeholder="Search..."
          style={{ top: '92px', right: '160px', zIndex: 10, width: 300 }}
          value={searchText}
          className={'fixed'}
          onChange={handleSearchChange}
        />
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

export default ChatFAQsList
