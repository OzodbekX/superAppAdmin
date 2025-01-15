import AntTable from '@/components/AntTable/index.jsx'
import * as React from 'react'
import { Badge } from 'antd'
import { addSpaceEveryThreeChars, convertToCustomFormat } from '@/utils/functions.js'
import { useForm } from 'antd/es/form/Form.js'
import RequestFilters from '@/pages/dashboard/requests/connectRequests/filters.jsx'

const ConnectionRequestsList = ({
  setFilters,
  filters,
  getServiceOptionLabel,
  calculateTotalPrice = { calculateTotalPrice },
  data,
  total,
  setSelectedRequest,
}) => {
  const [form] = useForm()
  const headCells = [
    {
      id: 'id',
      key: 'id',
      width: '10%',
      title: 'Номер заявки',
      dataIndex: 'externalId',
      align: 'center',
    },
    {
      id: 'type',
      key: 'type',
      width: '10%',
      title: 'Тип услуги',
      dataIndex: 'serviceType',
      align: 'center',
      render: (serviceType) => (
        <div key={serviceType} className={'overflow-ellipsis'}>
          {getServiceOptionLabel(serviceType)}
        </div>
      ),
    },

    {
      id: 'phoneNumber',
      key: 'phoneNumber',
      width: '15%',
      title: 'Номер телефона',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      id: 'createdAt',
      key: 'createdAt',
      width: '15%',
      title: 'Время подачи заявки',
      align: 'center',
      render: (row) => (
        <div key={row?.id} className={'overflow-ellipsis'}>
          {convertToCustomFormat(row.createdAt)}
        </div>
      ),
    },
    {
      id: 'address',
      key: 'address',
      width: '25%',
      title: 'Адрес',
      dataIndex: 'fullAddress',
    },
    {
      id: 'total',
      key: 'total',
      width: '10%',
      title: 'Итого',
      align: 'center',

      render: (row, head) => <div>{addSpaceEveryThreeChars(calculateTotalPrice(row))} сум</div>,
    },
    {
      id: 'status',
      key: 'status',
      width: '10%',
      align: 'center',
      title: 'Запросить статус',
      render: (row, head) => (
        <Badge
          key={row?.id}
          showZero
          color={
            row?.status === 'NEW' ? '#1433fa' : row?.status === 'accepted' ? '#52c41a' : '#f8cf00'
          }
          count={
            row?.status === 'NEW'
              ? 'новый'
              : row?.status === 'accepted'
              ? 'принятый'
              : 'рассмотрено'
          }
        />
      ),
    },
  ]

  const onClickRow = (row) => {
    setSelectedRequest(row)
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between gap-3 ">
        <div className={'text-3xl flex-1 font-semibold mt-1'}>Запросы</div>
        <RequestFilters form={form} setFilters={setFilters} />
      </div>
      <AntTable
        headCells={headCells}
        rows={data}
        total={total}
        onClickRow={onClickRow}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default ConnectionRequestsList
