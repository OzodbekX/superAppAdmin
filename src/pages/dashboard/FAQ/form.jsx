import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Badge, Button, Form, Input, Select } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createFAQs, deleteFAQs, updateFAQs } from '@/utils/api/functions.js'

export default function FAQsForm({ selectedFAQs, setFilters, setSelectedFAQs }) {
  const [cardForm] = Form.useForm()

  const onUpdateFAQs = useMutation({
    mutationFn: updateFAQs,
    onSuccess: (data) => {
      setSelectedFAQs(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  const onDeleteFAQs = useMutation({
    mutationFn: deleteFAQs,
    onSuccess: (data) => {
      setSelectedFAQs(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  const onAddFAQs = useMutation({
    mutationFn: createFAQs,
    onSuccess: (data) => {
      setSelectedFAQs(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  useEffect(() => {
    if (selectedFAQs) {
      const newFormData = cloneDeep(selectedFAQs)
      cardForm.setFieldsValue(newFormData)
    }
  }, [selectedFAQs])

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      values.position = Number(values.position)
      try {
        if (selectedFAQs?.id) {
          onUpdateFAQs.mutate({ id: selectedFAQs.id, params: values })
        } else {
          onAddFAQs.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className="mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedFAQs?.id && (
        <div className="mb-4 p-3 border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Текущие данные FAQ</h4>
          <div className="text-gray-600">
            <div className="mb-2 flex gap-4">
              <div className={'flex-1'}>
                <strong>Вопрос (уз):</strong> {selectedFAQs.question?.uz}
              </div>
              <div className={'flex-1'}>
                <strong>Вопрос (ру):</strong> {selectedFAQs.question?.ru}
              </div>
              <br />
            </div>
            <div className="mb-2 flex gap-4">
              <div className={'flex-1'}>
                <strong>Ответ (уз):</strong> {selectedFAQs.answer?.uz}
              </div>
              <div className={'flex-1'}>
                <strong>Ответ (ру):</strong> {selectedFAQs.answer?.ru}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mb-2 flex-1">
                <strong>Активно:</strong>{' '}
                <Badge
                  key={selectedFAQs?.id}
                  showZero
                  color={selectedFAQs?.isActive ? '#52c41a' : '#faad14'}
                  count={selectedFAQs?.isActive ? 'активный' : 'неактивный'}
                />
              </div>
              <div className="mb-2 flex-1">
                <strong>Позиция:</strong> {selectedFAQs.position}
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
            name={['question', 'uz']}
            rules={[{ required: true, message: 'Введите вопрос на узбекском' }]}
          >
            <Input placeholder="Введите вопрос на узбекском" />
          </Form.Item>
          <Form.Item
            label="Вопрос (ру)"
            className="flex-1"
            name={['question', 'ru']}
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
            name={['answer', 'uz']}
            rules={[{ required: true, message: 'Введите ответ на узбекском' }]}
          >
            <Input.TextArea placeholder="Введите ответ на узбекском" />
          </Form.Item>
          <Form.Item
            label="Ответ (ру)"
            className="flex-1"
            name={['answer', 'ru']}
            rules={[{ required: true, message: 'Введите ответ на русском' }]}
          >
            <Input.TextArea placeholder="Введите ответ на русском" />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold mt-4">Дополнительные настройки</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Активно"
            name="isActive"
            initialValue={true}
            rules={[{ required: true, message: 'Выберите статус' }]}
          >
            <Select placeholder="Выберите статус">
              <Select.Option value={true}>Активно</Select.Option>
              <Select.Option value={false}>Неактивно</Select.Option>
            </Select>
          </Form.Item>
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
              loading={onUpdateFAQs.isLoading || onAddFAQs.isLoading}
              disabled={onUpdateFAQs.isLoading || onAddFAQs.isLoading}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedFAQs?.id ? 'Сохранить' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedFAQs(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedFAQs?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteFAQs.mutate(selectedFAQs.id)}
              loading={onDeleteFAQs.isLoading}
              disabled={onDeleteFAQs.isLoading}
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
