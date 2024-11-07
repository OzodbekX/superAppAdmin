import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createCity, deleteCity, updateCity } from '@/utils/api/functions.js'

export default function CityForm({ selectedCity, onUpdateList, setSelectedCity }) {
  const [cardForm] = Form.useForm()

  const onUpdateCity = useMutation({
    // Optional callbacks
    mutationFn: updateCity,
    onSuccess: (data) => {
      setSelectedCity(undefined)
      onUpdateList(data, 'update')
    },
  })

  const onDeleteCity = useMutation({
    // Optional callbacks
    mutationFn: deleteCity,
    onSuccess: (data) => {
      setSelectedCity(undefined)
      onUpdateList(data?.data, 'delete')
    },
  })

  const onAddCity = useMutation({
    // Optional callbacks
    mutationFn: createCity,
    onSuccess: (data) => {
      setSelectedCity(undefined)
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedCity) {
      let newFormData = cloneDeep(selectedCity)
      cardForm.setFieldsValue(newFormData)
    }
  }, [selectedCity])

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      try {
        if (selectedCity?.id) {
          onUpdateCity.mutate({ id: selectedCity.id, params: values })
        } else {
          onAddCity.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 p-5  bg-white">
      {selectedCity?.id && (
        <div className={'mb-2'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Наименование</div>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Uz: </strong>
              {selectedCity.name?.uz}
            </div>
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Ru: </strong>
              {selectedCity.name?.ru}
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
        <h4 className="text-lg font-semibold mt-4">Заголовок</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Заголовок (уз) "
            className={'flex-1'}
            name={['name', 'uz']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
          <Form.Item
            label="Заголовок (ру) "
            className={'flex-1'}
            name={['name', 'ru']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
        </div>
        <div className="flex">
          <Form.Item>
            <Button
              form={'cardForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateCity?.isPending || onAddCity?.isPending}
              disabled={onUpdateCity?.isPending || onAddCity?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedCity?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedCity(undefined)}
            color="amber"
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedCity?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteCity.mutate(selectedCity.id)}
              color="amber"
              loading={onDeleteCity.isPending}
              disabled={onDeleteCity.isPending}
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
