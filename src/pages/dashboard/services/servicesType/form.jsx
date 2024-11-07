import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input, Switch } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createService, deleteService, updateService } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import UploadImage from '@/components/UploadImage/index.jsx'

export default function DeviceServiceForm({
  selectedServiceCatalog,
  onUpdateList,
  setSelectedServiceCatalog,
}) {
  const [deviceServiceForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const onUpdateDeviceService = useMutation({
    mutationFn: updateService,
    onSuccess: (data) => {
      onUpdateList(data.data, 'update')
    },
  })

  const onDeleteDeviceService = useMutation({
    mutationFn: deleteService,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'delete')
    },
  })

  const onAddDeviceService = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedServiceCatalog) {
      let newFormData = cloneDeep(selectedServiceCatalog)
      deviceServiceForm.setFieldsValue(newFormData)
    }
  }, [selectedServiceCatalog])

  const onSubmit = () => {
    deviceServiceForm.validateFields().then((values) => {
      if (values?.sort) {
        values.sort = Number(values.sort)
      }
      if (selectedServiceCatalog?.id) {
        onUpdateDeviceService.mutate({ id: selectedServiceCatalog.id, params: values })
      } else {
        onAddDeviceService.mutate(values)
      }
    })
  }

  return (
    <div className=" p-3 ">
      {selectedServiceCatalog?.id && (
        <div className="mb-2">
          {/* Display selected item details */}
          <div className="mb-2 font-semibold text-gray-600">Заголовок</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedServiceCatalog.title?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedServiceCatalog.title?.ru}
            </div>
          </div>
          <div className="mb-2 font-semibold text-gray-600">Подзаголовок</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedServiceCatalog.subtitle?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedServiceCatalog.subtitle?.ru}
            </div>
          </div>
          <div className="mb-2 font-semibold text-gray-600">Описание</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedServiceCatalog.description?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedServiceCatalog.description?.ru}
            </div>
          </div>
        </div>
      )}

      <Form
        form={deviceServiceForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
        name={'deviceServiceForm'}
      >
        {/* Title Section */}
        <h4 className="text-lg font-semibold mt-4">Заголовок</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Заголовок (uz)"
            className="flex-1"
            name={['title', 'uz']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
          <Form.Item
            label="Заголовок (ru)"
            className="flex-1"
            name={['title', 'ru']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
        </div>

        {/* Subtitle Section */}
        <h4 className="text-lg font-semibold mt-4">Подзаголовок</h4>
        <div className="flex gap-4">
          <div className="flex flex-1 gap-4 my-1">
            <Form.Item
              label="Подзаголовок (uz)"
              className="flex-1"
              name={['subtitle', 'uz']}
              rules={[{ required: true, message: 'Введите подзаголовок!' }]}
            >
              <Input placeholder="Введите подзаголовок" />
            </Form.Item>
            <Form.Item
              label="Подзаголовок (ru)"
              className="flex-1"
              name={['subtitle', 'ru']}
              rules={[{ required: true, message: 'Введите подзаголовок!' }]}
            >
              <Input placeholder="Введите подзаголовок" />
            </Form.Item>
          </div>
          <div className="flex-1 flex gap-4">
            <Form.Item
              label="Цвет фона"
              name="backgroundColor"
              className="flex-1"
              rules={[{ required: true, message: 'Введите цвет фона!' }]}
            >
              <Input placeholder="Введите цвет фона" />
            </Form.Item>
            {selectedServiceCatalog?.id && (
              <Form.Item
                label="Сортировка"
                name="sort"
                className="flex-1"
                rules={[{ required: true, message: 'Введите значение сортировки!' }]}
              >
                <Input type="number" placeholder="Введите значение сортировки" />
              </Form.Item>
            )}
            <Form.Item className="flex-1" label="Активный" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </div>

        {/* Description Section */}
        <h4 className="text-lg font-semibold mt-4">Описание</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Описание (uz)"
            className="flex-1"
            name={['description', 'uz']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input.TextArea placeholder="Введите описание" />
          </Form.Item>
          <Form.Item
            label="Описание (ru)"
            className="flex-1"
            name={['description', 'ru']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input.TextArea placeholder="Введите описание" />
          </Form.Item>
        </div>

        {/* Image Section */}
        <div className="flex gap-4">
          <div className="flex-1 flex gap-4">
            <Form.Item
              name={['imageUrl']}
              className={'flex-1 ml-2'}
              label="Изображение"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['imageUrl']}
                form={deviceServiceForm}
              />
            </Form.Item>
          </div>
          <div className="flex-1 flex gap-4">
            <Form.Item
              name={['mobileImageUrl']}
              className={'flex-1 ml-2'}
              label="Мобильное изображение"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['mobileImageUrl']}
                form={deviceServiceForm}
              />
            </Form.Item>
            <Form.Item
              name={['iconUrl']}
              className={'flex-1'}
              label="Значок карты"
              rules={[{ message: 'Пожалуйста, загрузите икона', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['iconUrl']}
                form={deviceServiceForm}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex gap-4 my-1"></div>

        {/* Action Buttons */}
        <div className="flex">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onSubmit}
              className="mt-4 bg-indigo-900"
            >
              {selectedServiceCatalog?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedServiceCatalog(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedServiceCatalog?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteDeviceService.mutate(selectedServiceCatalog.id)}
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
