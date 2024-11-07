import AntTable from '@/components/AntTable/index.jsx'
import * as React from 'react'
import { useCallback } from 'react'
import { Badge, Input, Radio, Select } from 'antd'
import { convertToCustomFormat } from '@/utils/functions.js'
import { cloneDeep, debounce } from 'lodash'

const headCells = [
  {
    id: 'id',
    key: 'id',
    width: '10%',
    title: 'Номер заявки',
    dataIndex: 'id',
  },
  {
    id: 'name',
    key: 'name',
    width: '20%',
    title: 'Имя',
    dataIndex: 'name',
  },

  {
    id: 'phoneNumber',
    key: 'phoneNumber',
    width: '20%',
    title: 'Номер телефона',
    dataIndex: 'phoneNumber',
  },
  {
    id: 'organizationName',
    key: 'organizationName',
    width: '20%',
    title: 'Название организации',
    dataIndex: 'organizationName',
  },
  {
    id: 'createdAt',
    key: 'createdAt',
    width: '20%',
    title: 'Время подачи заявки',
    render: (row, head) => (
      <div key={row?.id} className={'overflow-ellipsis'}>
        {convertToCustomFormat(row.createdAt)}
      </div>
    ),
  },
  {
    id: 'updatedAt',
    key: 'updatedAt',
    width: '20%',
    title: 'Обновленное время',
    render: (row, head) => (
      <div key={row?.id} className={'overflow-ellipsis'}>
        {convertToCustomFormat(row.updatedAt)}
      </div>
    ),
  },
  {
    id: 'status',
    key: 'status',
    width: '20%',
    title: 'Запросить статус',
    render: (row, head) => (
      <Badge
        key={row?.id}
        showZero
        color={
          row?.status === 'new' ? '#1433fa' : row?.status === 'accepted' ? '#52c41a' : '#f8cf00'
        }
        count={
          row?.status === 'new' ? 'новый' : row?.status === 'accepted' ? 'принятый' : 'рассмотрено'
        }
      />
    ),
  },
]

const ApplicationList = ({ setFilters, filters, data, total, setSelectedRequest }) => {
  const onClickRow = (row) => {
    setSelectedRequest(row)
  }

  const updateFilters = useCallback(
    debounce((newFilters) => {
      setFilters((prev) => ({
        ...prev,
        offset: 0,
        page: 0,
        ...newFilters,
      }))
    }, 1000), // 1000ms debounce
    []
  )
  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateFilters({ [name]: value })
  }

  const handleStatusChange = (value) => {
    if (value?.length === 0) {
      setFilters((prev) => {
        let newValue = cloneDeep(prev)
        delete newValue.status
        newValue.offset = 0
        newValue.page = 0
        return newValue
      })
    } else {
      updateFilters({ status: value })
    }
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between gap-3 ">
        <div className={'text-3xl flex-1 font-semibold mt-1'}>Запросы</div>
        <Input
          placeholder="Введите имя"
          name="name"
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
          className={'flex-1'}
        />
        <Select
          placeholder="Select status"
          className={'flex-1'}
          defaultValue={''}
          onChange={handleStatusChange}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <Option value="">все</Option>
          <Option value="new">новый</Option>
          <Option value="review">рассмотрено</Option>
          <Option value="accepted">принятый</Option>
        </Select>
      </div>
      <Radio.Group
        options={[
          { value: 'natural-person', label: 'Физические лица' },
          { value: 'legal-entity', label: 'Юридические лица' },
        ]}
        onChange={({ target: { value } }) => {
          setFilters((prev) => ({ ...prev, pageSize: 10, page: 0, submitterType: value, reNew: 0 }))
        }}
        defaultValue={filters.submitterType}
        optionType="button"
        buttonStyle="solid"
      />
      <AntTable
        headCells={
          filters?.submitterType === 'legal-entity'
            ? headCells
            : headCells.filter((i) => i.id != 'organizationName')
        }
        rows={data}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default ApplicationList
