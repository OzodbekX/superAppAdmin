import React, { useEffect } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createRateOptions, deleteRateOptions, updateRateOptions } from '@/utils/api/functions.js'

export default function RateOptionsForm({
  selectedRateOption,
  setSelectedRateOption,
  onUpdateList,
}) {
  const [rateForm] = Form.useForm()

  const onUpdateRateOption = useMutation({
    mutationFn: updateRateOptions,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'update')
    },
  })

  const onDeleteRateOption = useMutation({
    mutationFn: deleteRateOptions,
    onSuccess: () => {
      onUpdateList(selectedRateOption, 'delete')
    },
  })

  const onAddRateOption = useMutation({
    mutationFn: createRateOptions,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedRateOption) {
      rateForm.setFieldsValue({
        ...selectedRateOption,
      })
    }
  }, [selectedRateOption])

  const onSubmit = () => {
    rateForm.validateFields().then((values) => {
      try {
        if (selectedRateOption?.id) {
          onUpdateRateOption.mutate({ id: selectedRateOption.id, ...values })
        } else {
          onAddRateOption.mutate(values)
        }
      } catch {
        console.log('Ошибка при отправке формы')
      }
    })
  }

  return (
    <div className="mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedRateOption?.id && (
        <div className="mb-4 p-3 border-gray-200">
          <div className="text-gray-600">
            <div className="mb-2 flex gap-4">
              <div className="flex-1">
                <strong>Значение (уз):</strong> {selectedRateOption.valueUz}
              </div>
              <div className="flex-1">
                <strong>Значение (ру):</strong> {selectedRateOption.valueRu}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mb-2 flex-1 flex gap-3">
                <strong>Оценки:</strong>
                <div className={'flex'}>
                  {selectedRateOption?.rates?.map((item, index) => (
                    <p>
                      {index > 0 && ', '}
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mb-2 flex-1 flex gap-3">
                <strong>Позиция:</strong>
                <div className={'flex'}>{selectedRateOption?.position}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        form={rateForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
        name="rateForm"
      >
        <h4 className="text-lg font-semibold mt-4">Опция оценки</h4>
        <div className="flex gap-4">
          <Form.Item
            label="Значение (уз)"
            className="flex-1"
            name="valueUz"
            rules={[{ required: true, message: 'Введите значение на узбекском языке' }]}
          >
            <Input placeholder="Введите значение на узбекском языке" />
          </Form.Item>
          <Form.Item
            label="Значение (ру)"
            className="flex-1"
            name="valueRu"
            rules={[{ required: true, message: 'Введите значение на русском языке' }]}
          >
            <Input placeholder="Введите значение на русском языке" />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item
            label="Для оценок"
            rules={[{ required: true, message: 'Пожалуйста, выберите рейтинги' }]}
            name="rates"
            className="flex-1"
          >
            <Select
              label="Выберите рейтинги"
              color="blue"
              size={'large'}
              mode={'multiple'}
              options={[
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 },
                { value: 4, label: 4 },
                { value: 5, label: 5 },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Позиция"
            name="position"
            className="flex-1"
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
              loading={onUpdateRateOption.isLoading || onAddRateOption.isLoading}
              disabled={onUpdateRateOption.isLoading || onAddRateOption.isLoading}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedRateOption?.id ? 'Сохранить' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedRateOption(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedRateOption?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteRateOption.mutate(selectedRateOption.id)}
              loading={onDeleteRateOption.isLoading}
              disabled={onDeleteRateOption.isLoading}
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
