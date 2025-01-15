import React from 'react'
import { userStore } from '@/utils/zustand.js'
import { Modal } from 'antd'
import { addSpaceEveryThreeChars } from '@/utils/functions.js'

const RequestView = ({
  request,
  setSelectedRequest,
  calculateTotalPrice,
  getServiceOptionLabel,
}) => {
  const lang = userStore((state) => state.language)

  const convertToCustomFormat = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderStatus = (status) => {
    switch (status) {
      case 'NEW':
        return <div className="px-2 py-1 rounded text-white bg-blue-500">Новый запрос</div>
      case 'IN_PROGRESS':
        return <div className="px-2 py-1 rounded text-white bg-yellow-500">В процессе</div>
      case 'COMPLETED':
        return <div className="px-2 py-1 rounded text-white bg-green-500">Завершено</div>
      case 'CANCELLED':
        return <div className="px-2 py-1 rounded text-white bg-red-500">Отменено</div>
      default:
        return <div className="px-2 py-1 rounded text-white bg-gray-500">Неизвестный статус</div>
    }
  }

  return (
    <Modal
      open={!!request}
      onCancel={() => {
        setSelectedRequest(undefined)
      }}
      footer={null}
      centered={true}
      width={1200}
      className={'border rounded-lg p-0 shadow-md bg-white '}
    >
      <h2 className={'text-lg font-bold mb-4'}>Подробности заявки ({request?.externalId})</h2>
      <div className="flex mb-2 gap-4">
        <div className={'flex-1 flex mb-2 gap-4'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Дата создания:</div>
          <div> {convertToCustomFormat(request?.createdAt)}</div>
        </div>
        <div className={'flex-1 flex mb-2 gap-4'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Статус:</div>
          {renderStatus(request?.status)}
        </div>
      </div>
      <div className="flex mb-2 gap-4">
        <div className={'flex-1 flex mb-2 gap-4'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Номер телефона:</div>
          <div>{request?.phone}</div>
        </div>
        <div className={'flex-1 flex mb-2 gap-4'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Дополнительный номер телефона:</div>
          <div>{request?.extraPhone || '-'}</div>
        </div>
      </div>
      <div className="flex mb-2 gap-4">
        <div className={'flex-1 flex mb-2 gap-4'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Тип платформы:</div>
          <div> {request?.platformType || 'Не указано'}</div>
        </div>
        <div className={'flex-1 flex mb-2 gap-4'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Тип услуги:</div>
          <div>{getServiceOptionLabel(request?.serviceType)}</div>
        </div>
      </div>
      <div className="flex mb-2 gap-4">
        <div className="flex flex-1 mb-2 gap-4">
          <div className={'mb-2 font-semibold text-gray-600'}>Полный адрес:</div>
          <div>{request?.fullAddress}</div>
        </div>
        {request?.routerPaymentType && request?.routerPaymentType !== 'NONE' && (
          <div className={'flex-1 flex mb-2 gap-4'}>
            <div className={'mb-2 font-semibold text-gray-600'}>Тип оплаты за роутер:</div>
            <div>
              {request?.routerPaymentType === 'BUY_NOW'
                ? 'Купить сразу'
                : request?.routerPaymentType === 'INSTALLMENTS'
                ? 'В рассрочку'
                : request?.routerPaymentType === 'PERIOD'
                ? 'Взять на время'
                : ''}
            </div>
          </div>
        )}
      </div>
      <div className="flex mb-2 gap-4">
        {request?.tariff && request?.type !== 'TV' && (
          <div className={'mb-2 flex-1'}>
            <strong className={'text-gray-600'}>Тариф: </strong>
            {request?.tariff.name?.[lang] || 'Не указано'} (
            {addSpaceEveryThreeChars(request?.tariff?.price)} сум)
          </div>
        )}
        {request?.device && request?.type !== 'TV' && request?.routerPaymentType !== 'PERIOD' && (
          <div className={'mb-2 flex-1'}>
            <strong className={'text-gray-600'}>Роутер: </strong>
            {request?.device.name?.[lang] || 'Не указано'}({' '}
            {addSpaceEveryThreeChars(request?.device?.price)} сум)
          </div>
        )}
      </div>
      <div className={'flex mb-2 gap-4'}>
        <div className={'mb-2 flex-1'}>
          <strong className={'text-gray-600'}>Итого: </strong>
          <strong>{addSpaceEveryThreeChars(calculateTotalPrice(request))} сум</strong>
        </div>
      </div>
    </Modal>
  )
}

export default RequestView
