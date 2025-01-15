import React, { useRef } from 'react'
import AntTable from '@/components/AntTable/index.jsx'
import { convertToCustomFormat } from '@/utils/functions.js'
import { Badge, Button, DatePicker, Select } from 'antd'
import chatAxiosInstance from '@/utils/api/chatApi.js'
import { apiUrls } from '@/utils/api/apiUrls.js'
import moment from 'moment/moment.js'

const { RangePicker } = DatePicker

const List = ({
  setSelectedCallBackRequests,
  selectedCallBackRequests,
  callBackRequests,
  total,
  filters,
  setFilters,
}) => {
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
      id: 'title uz',
      key: 'title uz',
      width: '25%',
      title: 'Пользователь',
      dataIndex: ['user', 'name'],
    },
    {
      id: 'phoneNumber',
      key: 'phoneNumber',
      width: '20%',
      title: 'Номер телефона',
      dataIndex: ['user', 'phoneNumber'],
    },
    {
      id: 'createdAt',
      key: 'createdAt',
      width: '15%',
      title: 'Время создания',
      render: (row) => (
        <div key={row?.id} className={'overflow-ellipsis'}>
          {row?.chat?.createdAt ? convertToCustomFormat(row?.chat?.createdAt) : '-'}
        </div>
      ),
    },
    {
      id: 'category',
      key: 'category',
      width: '20%',
      title: 'Категория',
      dataIndex: ['chat', 'category', 'nameRu'],
    },
    {
      id: 'status',
      key: 'status',
      align: 'left',
      width: '15%',
      title: 'Статус обработки',
      filterSearch: true,
      sorter: (a, b) =>
        a?.status === 'PROCESSED' && b.status === 'PROCESSED'
          ? 0
          : a?.status === 'PROCESSED'
          ? 1
          : -1,
      render: (row, head) => (
        <Badge
          key={row?.id}
          showZero
          color={row?.status === 'PROCESSED' ? '#52c41a' : '#faad14'}
          count={row?.status === 'PROCESSED' ? 'Обработан' : 'Не обработан'}
        />
      ),
    },
  ]
  const rangePickerRef = useRef(null)

  const downloadXLSFile = async () => {
    try {
      // Make the GET request to fetch the XLS file
      return chatAxiosInstance
        .get(apiUrls.downloadCallBackStats, {
          responseType: 'blob',
          params: {
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        })
        .then((response) => {
          const blob = new Blob([response.data])

          // Create a link element to trigger the download
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download =
            'Статистика обратные вызовы' +
            moment(filters.startDate).format('DD.MM.YYYY') +
            '-' +
            moment(filters.endDate).format('DD.MM.YYYY') +
            '.xls'

          // Append the link to the body (required for Firefox)
          document.body.appendChild(link)

          // Programmatically click the link to start the download
          link.click()

          // Clean up by removing the link
          document.body.removeChild(link)
        })

      // Create a Blob from the response data
    } catch (error) {
      console.error('Error downloading the XLS file:', error)
    }
  }
  const onChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates
      // Ensure `start` and `end` are Date objects
      const startDateObj = new Date(start)
      const endDateObj = new Date(end)
      endDateObj.setHours(23, 59, 59, 999)

      // Convert to ISO 8601 format
      const startDate = new Date(
        startDateObj.getTime() - startDateObj.getTimezoneOffset() * 60000
      ).toISOString()
      const endDate = new Date(
        endDateObj.getTime() - endDateObj.getTimezoneOffset() * 60000
      ).toISOString()

      // Update filters with startDate and endDate
      setFilters((prevFilters) => ({
        ...prevFilters,
        page: 0,
        startDate,
        endDate,
      }))
    } else {
      // Clear filters if no dates are selected
      setFilters((prevFilters) => ({
        ...prevFilters,
        page: 0,
        startDate: null,
        endDate: null,
      }))
    }
  }

  const onClickRow = (row) => {
    setSelectedCallBackRequests(row)
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between w-full">
        <div className={'text-xl w-1/3'}>Обратные вызовы</div>

        <div className="w-2/3 flex gap-4">
          <RangePicker
            onChange={onChange}
            allowClear={true}
            ref={rangePickerRef}
            className={'flex-1'}
          />
          <Select
            onChange={(val) => {
              setFilters((prev) => {
                return {
                  ...prev,
                  page: 0,
                  status: val,
                }
              })
            }}
            className={'flex-1'}
            allowClear={true}
          >
            <Select.Option value={'NOT_PROCESSED'}>Не обработанные</Select.Option>
            <Select.Option value={'PROCESSED'}>Обработанные</Select.Option>
          </Select>
          <Button onClick={downloadXLSFile}>Скачать</Button>
        </div>
      </div>
      <AntTable
        rowSelection={{
          selectedRowKeys: [selectedCallBackRequests?.id],
          onChange: (keys, row, { type }) => {
            if (type !== 'all') {
              onClickRow(row?.[1] || row?.[0])
            }
          },
        }}
        headCells={headCells}
        rows={callBackRequests}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default List
