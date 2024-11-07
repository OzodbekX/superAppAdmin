import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Badge, Button, Form, Input, Select } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createChatFAQs, deleteChatFAQs, updateChatFAQs } from '@/utils/api/functions.js'

export default function ChatFAQsForm({ selectedChatFAQs, setFilters, setSelectedChatFAQs }) {
  const [cardForm] = Form.useForm()

  const onUpdateChatFAQs = useMutation({
    mutationFn: updateChatFAQs,
    onSuccess: (data) => {
      setSelectedChatFAQs(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  const onDeleteChatFAQs = useMutation({
    mutationFn: deleteChatFAQs,
    onSuccess: (data) => {
      setSelectedChatFAQs(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  const onAddChatFAQs = useMutation({
    mutationFn: createChatFAQs,
    onSuccess: (data) => {
      setSelectedChatFAQs(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  useEffect(() => {
    if (selectedChatFAQs) {
      const newFormData = cloneDeep(selectedChatFAQs)
      cardForm.setFieldsValue(newFormData)
    }
  }, [selectedChatFAQs])

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      values.position = Number(values.position)
      try {
        if (selectedChatFAQs?.id) {
          onUpdateChatFAQs.mutate({ id: selectedChatFAQs.id, ...values })
        } else {
          onAddChatFAQs.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className="mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedChatFAQs?.id && (
        <div className="mb-4 p-3 border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Текущие данные FAQ</h4>
          <div className="text-gray-600">
            <div className="mb-2 flex gap-4">
              <div className={'flex-1'}>
                <strong>Вопрос (уз):</strong> {selectedChatFAQs.question?.uz}
              </div>
              <div className={'flex-1'}>
                <strong>Вопрос (ру):</strong> {selectedChatFAQs.question?.ru}
              </div>
              <br />
            </div>
            <div className="mb-2 flex gap-4">
              <div className={'flex-1'}>
                <strong>Ответ (уз):</strong> {selectedChatFAQs.answer?.uz}
              </div>
              <div className={'flex-1'}>
                <strong>Ответ (ру):</strong> {selectedChatFAQs.answer?.ru}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mb-2 flex-1">
                <strong>Активно:</strong>{' '}
                <Badge
                  key={selectedChatFAQs?.id}
                  showZero
                  color={selectedChatFAQs?.isActive ? '#52c41a' : '#faad14'}
                  count={selectedChatFAQs?.isActive ? 'активный' : 'неактивный'}
                />
              </div>
              <div className="mb-2 flex-1">
                <strong>Позиция:</strong> {selectedChatFAQs.position}
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
            e.preventDefault()
          }
        }}
        name="cardForm"
      >
        <h4 className="text-lg font-semibold mt-4">Вопрос</h4>
        <div className="flex gap-4">
          <Form.Item
            label="Вопрос (уз)"
            className="flex-1"
            name={['questionUz']}
            rules={[{ required: true, message: 'Введите вопрос на узбекском' }]}
          >
            <Input placeholder="Введите вопрос на узбекском" />
          </Form.Item>
          <Form.Item
            label="Вопрос (ру)"
            className="flex-1"
            name={['questionRu']}
            rules={[{ required: true, message: 'Введите вопрос на русском' }]}
          >
            <Input placeholder="Введите вопрос на русском" />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold">Ответ</h4>
        <div className="flex gap-4">
          <Form.Item
            label="Ответ (уз)"
            className="flex-1"
            name={['answerUz']}
            rules={[{ required: true, message: 'Введите ответ на узбекском' }]}
          >
            <Input.TextArea placeholder="Введите ответ на узбекском" />
          </Form.Item>
          <Form.Item
            label="Ответ (ру)"
            className="flex-1"
            name={['answerRu']}
            rules={[{ required: true, message: 'Введите ответ на русском' }]}
          >
            <Input.TextArea placeholder="Введите ответ на русском" />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold mt-4">Дополнительные настройки</h4>
        <div className="flex gap-4 my-1">
          {/*<Form.Item*/}
          {/*  label="Активно"*/}
          {/*  name="isActive"*/}
          {/*  initialValue={true}*/}
          {/*  rules={[{ required: true, message: 'Выберите статус' }]}*/}
          {/*>*/}
          {/*  <Select placeholder="Выберите статус">*/}
          {/*    <Select.Option value={true}>Активно</Select.Option>*/}
          {/*    <Select.Option value={false}>Неактивно</Select.Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          <Form.Item
            label="Позиция"
            name="position"
            rules={[{ required: true, message: 'Введите позицию' }]}
          >
            <Input placeholder="Введите позицию" />
          </Form.Item>
        </div>

        <div className="flex">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={onUpdateChatFAQs.isLoading || onAddChatFAQs.isLoading}
              disabled={onUpdateChatFAQs.isLoading || onAddChatFAQs.isLoading}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedChatFAQs?.id ? 'Сохранить' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedChatFAQs(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedChatFAQs?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteChatFAQs.mutate(selectedChatFAQs.id)}
              loading={onDeleteChatFAQs.isLoading}
              disabled={onDeleteChatFAQs.isLoading}
              className="mt-4 ml-3 bg-red-500 text-white"
            >
              Удалить
            </Button>
          )}
        </div>
      </Form>
    </div>
  )
}
