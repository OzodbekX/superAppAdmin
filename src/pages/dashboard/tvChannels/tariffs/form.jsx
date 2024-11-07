import React, { useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import {
  createChannelTariff,
  deleteChannelTariff,
  updateChannelTariff,
} from '@/utils/api/functions.js'
import UploadImage from '@/components/UploadImage/index.jsx'
import { addSpaceEveryThreeChars } from '@/utils/functions.js'

export default function ChannelTariffForm({ selectedTariff, onUpdateList, setSelectedTariff }) {
  const [tariffForm] = Form.useForm()

  const onUpdateChannel = useMutation({
    mutationFn: updateChannelTariff,
    onSuccess: (data) => {
      setSelectedTariff(undefined)
      onUpdateList(data?.data, 'update')
    },
  })
  const createTariff = useMutation({
    mutationFn: createChannelTariff,
    onSuccess: (data) => {
      setSelectedTariff(undefined)
      onUpdateList(data?.data, 'create')
    },
  })
  const onDeleteTariff = useMutation({
    mutationFn: deleteChannelTariff,
    onSuccess: (data) => {
      setSelectedTariff(undefined)
      onUpdateList(data?.data, 'delete')
    },
  })

  useEffect(() => {
    if (selectedTariff) {
      tariffForm.setFieldsValue(selectedTariff)
    }
  }, [selectedTariff])

  const onSubmit = () => {
    tariffForm.validateFields().then((values) => {
      values.price = Number(values.price)
      try {
        if (selectedTariff?.id) {
          onUpdateChannel.mutate({ id: selectedTariff.id, params: values })
        } else {
          createTariff.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 px-4">
      {selectedTariff?.id && (
        <div className={'mb-2'}>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Название тарифа</div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Uz: </strong>
                  {selectedTariff.title?.uz}
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Ru: </strong>
                  {selectedTariff.title?.ru}
                </div>
              </div>
              <div className={'mb-2 font-semibold text-gray-600'}>Цена</div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>{addSpaceEveryThreeChars(selectedTariff?.price)} сум</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        form={tariffForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevent form submission on "Enter"
          }
        }}
        name={'tariffForm'}
      >
        <h4 className="text-lg font-semibold mt-4">Имя тарифа</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Наименование (уз) "
            className={'flex-1'}
            name={['title', 'uz']}
            rules={[{ required: true, message: 'Введите название!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Наименование (ру) "
            className={'flex-1'}
            name={['title', 'ru']}
            rules={[{ required: true, message: 'Введите название!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
        </div>
        <div className={'text-2xl font-semibold mt-2'}>Цена</div>
        <div className="flex mt-3">
          <Form.Item
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            name={'price'}
            className={'flex-1 w-56'}
          >
            <Input className={'w-56'} type={'number'} />
          </Form.Item>
        </div>
        <div className={'text-2xl font-semibold mt-2'}>Изображение</div>
        <div className="flex mt-3">
          <Form.Item
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            name={['image', 'uz']}
            className={'flex-1'}
            label="Изображение (уз)"
          >
            <UploadImage accept={'image/*,image/gif'} field={['image', 'uz']} form={tariffForm} />
          </Form.Item>
          <Form.Item
            name={['image', 'ru']}
            className={'flex-1'}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            label="Изображение (ру)"
          >
            <UploadImage accept={'image/*,image/gif'} field={['image', 'ru']} form={tariffForm} />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          {selectedTariff?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteTariff.mutate(selectedTariff.id)}
              color="amber"
              loading={onDeleteTariff.isPending}
              disabled={onDeleteTariff.isPending}
              className="mt-4 ml-3 bg-red-500 text-white"
            >
              Удалить
            </Button>
          )}
          <Form.Item>
            <Button
              form={'tariffForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateChannel?.isPending || createTariff.isPending}
              disabled={onUpdateChannel?.isPending || createTariff.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedTariff?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedTariff(undefined)}
            className="mt-4 bg-gray-500"
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  )
}
