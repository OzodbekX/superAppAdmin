import React, { useEffect } from 'react'
import { addSpaceEveryThreeChars, convertToCustomFormat } from '@/utils/functions.js'
import { cloneDeep } from 'lodash'
import { Form, Modal } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { updateRequest } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'

export default function RequestForm({
  selectedRequest,
  getRussianTitle,
  setFilters,
  setSelectedRequest,
}) {
  const [cardForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const onUpdateNews = useMutation({
    // Optional callbacks
    mutationFn: updateRequest,
    onSuccess: (data) => {
      setSelectedRequest(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  useEffect(() => {
    if (selectedRequest) {
      let newFormData = cloneDeep(selectedRequest)
      cardForm.setFieldsValue(newFormData)
    }
  }, [selectedRequest])

  const options = [
    { value: 'CLIENT', label: 'Физические лица' },
    { value: 'COMPANY', label: 'Юридические лица' },
  ]
  function getLabelByValue(value) {
    const option = options.find((option) => option.value === value)
    return option ? option.label : null
  }

  const calculateSumma = (options) => {
    let totalPrice = 0
    const content = options?.map((option, index) => {
      totalPrice += option?.price?.unitPrice
      return (
        <div className={'flex mb-2'}>
          <div className={'flex-1'}>
            {index + 1}. {option?.name?.[lang]}:{' '}
          </div>
          <div className={'w-44'}>{addSpaceEveryThreeChars(option?.price?.unitPrice)} сум</div>
        </div>
      )
    })
    return (
      <div className={'ml-4 flex-1'}>
        <div>{content}</div>
        <div className={'font-semibold ml-4 flex'}>
          <div className={'flex-1'}> Общий:</div>
          <div className={'w-44'}> {addSpaceEveryThreeChars(totalPrice)} сум</div>
        </div>
      </div>
    )
  }

  return (
    <Modal
      open={!!selectedRequest}
      onCancel={() => {
        setSelectedRequest(undefined)
      }}
      footer={null}
      centered={true}
      width={1200}
      className={'border rounded-lg p-0 shadow-md bg-white '}
    >
      <div>
        <div className="flex mb-2 gap-4">
          <div className={'flex-1'}>
            <div className={'mb-2 font-semibold text-gray-600'}>
              Запрос обратного вызова ({selectedRequest?.externalId})
            </div>
            <div className={'flex gap-4 mb-2'}>
              <div className={'flex-1'}>
                <strong className={'text-gray-600'}>От кого: </strong>
                {selectedRequest?.fullName}
              </div>
              <div className={'flex-1'}>
                <strong className={'text-gray-600'}>Номер телефона: </strong>
                {selectedRequest?.phone}
              </div>
            </div>
            <div className={'flex gap-4 mb-2'}>
              <div className={'flex-1'}>
                <strong className={'text-gray-600'}>Категория: </strong>
                {getRussianTitle && getRussianTitle(selectedRequest?.category)}
              </div>

              <div className={'flex-1'}>
                <strong className={'text-gray-600'}>Тип: </strong>
                {getLabelByValue(selectedRequest?.type)}
              </div>
            </div>
            <div className={'flex gap-4 mb-2'}>
              <div className={'flex-1'}>
                <strong className={'text-gray-600'}>Время подачи заявки: </strong>
                {convertToCustomFormat(selectedRequest?.createdAt)}
              </div>
              {selectedRequest?.type === 'COMPANY' ? (
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Название компании: </strong>
                  {selectedRequest?.companyName || ''}
                </div>
              ) : (
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Адрес: </strong>
                  {selectedRequest?.address || '-'}
                </div>
              )}
            </div>
            {selectedRequest?.type === 'CLIENT' && selectedRequest?.service && (
              <div className={'flex gap-4 mb-2  border-t-2 pt-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Сервис: </strong>
                  {selectedRequest?.service?.name?.[lang] || '-'}
                </div>
                <div className={'flex-1 flex'}>
                  <strong className={'text-gray-600'}>Сумма: </strong>
                  {calculateSumma(selectedRequest?.service?.options)}
                </div>
              </div>
            )}
            {selectedRequest?.type === 'CLIENT' && selectedRequest?.channelTariff && (
              <div className={'flex gap-4 mb-2 border-t-2 pt-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>ЦТВ: </strong>
                  {selectedRequest?.channelTariff?.title?.[lang] || '-'}
                </div>
                <div className={'flex-1 flex'}>
                  <strong className={'text-gray-600'}>Цена: </strong>
                  <div className={'font-semibold ml-4'}>
                    {addSpaceEveryThreeChars(selectedRequest?.channelTariff?.price)} сум
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
