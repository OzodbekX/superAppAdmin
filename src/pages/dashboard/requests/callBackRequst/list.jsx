import AntTable from '@/components/AntTable/index.jsx'
import * as React from 'react'
import { useCallback } from 'react'
import { Input, Radio, Select } from 'antd'
import { convertToCustomFormat } from '@/utils/functions.js'
import { cloneDeep, debounce } from 'lodash'

const ApplicationList = ({
  setFilters,
  getRussianTitle,
  filters,
  data,
  total,
  setSelectedRequest,
}) => {
  const headCells = [
    {
      id: 'id',
      key: 'id',
      width: '10%',
      title: 'Номер заявки',
      dataIndex: 'externalId',
    },
    {
      id: 'name',
      key: 'name',
      width: '20%',
      title: 'Имя',
      dataIndex: 'fullName',
    },

    {
      id: 'phone',
      key: 'phone',
      width: '20%',
      title: 'Номер телефона',
      dataIndex: 'phone',
    },
    {
      id: 'organizationName',
      key: 'organizationName',
      width: '20%',
      title: 'Название организации',
      dataIndex: 'companyName',
    },
    {
      id: 'createdAt',
      key: 'createdAt',
      width: '20%',
      title: 'Время подачи заявки',
      render: (row) => (
        <div key={row?.id} className={'overflow-ellipsis'}>
          {convertToCustomFormat(row.createdAt)}
        </div>
      ),
    },
    {
      id: 'category',
      key: 'category',
      width: '20%',
      title: 'Категория',
      render: (row) => (
        <div key={row?.id} className={'overflow-ellipsis'}>
          {getRussianTitle(row?.category)}
        </div>
      ),
    },
    // {
    //   id: 'status',
    //   key: 'status',
    //   width: '20%',
    //   title: 'Запросить статус',
    //   render: (row, head) => (
    //     <Badge
    //       key={row?.id}
    //       showZero
    //       color={
    //         row?.status === 'new' ? '#1433fa' : row?.status === 'accepted' ? '#52c41a' : '#f8cf00'
    //       }
    //       count={
    //         row?.status === 'new' ? 'новый' : row?.status === 'accepted' ? 'принятый' : 'рассмотрено'
    //       }
    //     />
    //   ),
    // },
  ]

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

  const handleCategoryChange = (value) => {
    if (value?.length === 0) {
      setFilters((prev) => {
        let newValue = cloneDeep(prev)
        delete newValue.category
        newValue.offset = 0
        newValue.page = 0
        return newValue
      })
    } else {
      updateFilters({ category: value })
    }
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between gap-3 ">
        <div className={'text-3xl flex-1 font-semibold mt-1'}>Запросы</div>
        <Input
          placeholder="Введите имя"
          name="searchText"
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
          className={'flex-1'}
        />
        {/*<Select*/}
        {/*  placeholder="Выберите статус"*/}
        {/*  className={'flex-1'}*/}
        {/*  onChange={handleStatusChange}*/}
        {/*  style={{ width: '100%', marginBottom: '10px' }}*/}
        {/*>*/}
        {/*  <Option value="">все</Option>*/}
        {/*  <Option value="new">новый</Option>*/}
        {/*  <Option value="review">рассмотрено</Option>*/}
        {/*  <Option value="accepted">принятый</Option>*/}
        {/*</Select>*/}
        <Select
          placeholder="Выберите категорию"
          className={'flex-1'}
          allowClear={true}
          onChange={handleCategoryChange}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <Option value="INTERNET">Интернет</Option>
          <Option value="TV">ТВ</Option>
          <Option value="SERVICE">Сервис</Option>
        </Select>
      </div>
      <Radio.Group
        options={[
          { value: 'CLIENT', label: 'Физические лица' },
          { value: 'COMPANY', label: 'Юридические лица' },
        ]}
        onChange={({ target: { value } }) => {
          setFilters((prev) => ({ ...prev, pageSize: 10, page: 0, type: value, reNew: 0 }))
        }}
        defaultValue={filters.type}
        optionType="button"
        buttonStyle="solid"
      />
      <AntTable
        headCells={
          filters?.type === 'COMPANY'
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
