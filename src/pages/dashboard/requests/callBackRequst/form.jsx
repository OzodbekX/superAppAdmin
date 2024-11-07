import React, { useEffect } from 'react'
import { convertToCustomFormat } from '@/utils/functions.js'
import { cloneDeep } from 'lodash'
import { Badge, Button, Form, Select } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { updateRequest } from '@/utils/api/functions.js'

export default function RequestForm({ selectedRequest, setFilters, setSelectedRequest }) {
  const [cardForm] = Form.useForm()

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

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      try {
        if (selectedRequest?.id) {
          onUpdateNews.mutate({ id: selectedRequest.id, params: values })
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedRequest?.id && (
        <div className={'mb-2'}>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Запрос обратного вызова</div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>От кого: </strong>
                  {selectedRequest.name}
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Id: </strong>
                  {selectedRequest.id}
                </div>
              </div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Тип: </strong>
                  {selectedRequest.type === 'connect-internet'
                    ? 'Интернет'
                    : selectedRequest?.type === 'operator-callback'
                    ? 'Перезвони мне'
                    : 'ТВ'}
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Номер телефона: </strong>
                  {selectedRequest.phoneNumber}
                </div>
              </div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Время подачи заявки: </strong>
                  {convertToCustomFormat(selectedRequest.createdAt)}
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Обновленное время: </strong>
                  {convertToCustomFormat(selectedRequest.updatedAt)}
                </div>
              </div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600 mr-3'}>Статус: </strong>
                  <Badge
                    key={selectedRequest?.id}
                    showZero
                    color={
                      selectedRequest?.status === 'new'
                        ? '#1433fa'
                        : selectedRequest?.status === 'accepted'
                        ? '#52c41a'
                        : '#f8cf00'
                    }
                    count={
                      selectedRequest?.status === 'new'
                        ? 'новый'
                        : selectedRequest?.status === 'accepted'
                        ? 'принятый'
                        : 'рассмотрено'
                    }
                  />
                </div>
                {selectedRequest.organizationName && (
                  <div className={'flex-1 gap-4 mb-2'}>
                    <div className={'flex-1'}>
                      <strong className={'text-gray-600'}>Название организации: </strong>
                      {selectedRequest.organizationName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Form
        form={cardForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevents form submission on "Enter"
          }
        }}
        name={'cardForm'}
      >
        <h4 className="text-lg font-semibold my-4">Статус</h4>
        <Form.Item
          rules={[{ message: 'Пожалуйста, выберите', required: true }]}
          name="status"
          className={'w-40'}
          initialValue="active"
        >
          <Select>
            <Option value="new">новый</Option>
            <Option value="review">рассмотрено</Option>
            <Option value="accepted">принятый</Option>
          </Select>
        </Form.Item>

        <div className="flex">
          <Form.Item>
            <Button
              form={'cardForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateNews?.isPending}
              disabled={onUpdateNews?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedRequest?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedRequest(undefined)}
            color="amber"
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  )
}
