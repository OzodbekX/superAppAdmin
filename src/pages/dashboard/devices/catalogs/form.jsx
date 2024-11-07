import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import UploadImage from '@/components/UploadImage/index.jsx'
import {
  createDeviceCategory,
  deleteDeviceCategory,
  updateDeviceCategory,
} from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'

export default function DeviceCategoryForm({
  selectedDeviceCatalog,
  onUpdateList,
  setSelectedDeviceCatalog,
}) {
  const [deviceCategoryForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const onUpdateDeviceCategory = useMutation({
    // Optional callbacks
    mutationFn: updateDeviceCategory,
    onSuccess: (data) => {
      onUpdateList(data.data, 'update')
    },
  })

  const onDeleteDeviceCategory = useMutation({
    // Optional callbacks
    mutationFn: deleteDeviceCategory,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'delete')
    },
  })

  const onAddDeviceCategory = useMutation({
    // Optional callbacks
    mutationFn: createDeviceCategory,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedDeviceCatalog) {
      let newFormData = cloneDeep(selectedDeviceCatalog)
      deviceCategoryForm.setFieldsValue(newFormData)
    }
  }, [selectedDeviceCatalog])

  const onSubmit = () => {
    deviceCategoryForm.validateFields().then((values) => {
      try {
        if (selectedDeviceCatalog?.id) {
          onUpdateDeviceCategory.mutate({ id: selectedDeviceCatalog.id, params: values })
        } else {
          onAddDeviceCategory.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className="mt-10 p-3 ">
      {selectedDeviceCatalog?.id && (
        <div className="mb-2">
          <div className="mb-2 font-semibold text-gray-600">Заголовок</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedDeviceCatalog.title?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedDeviceCatalog.title?.ru}
            </div>
          </div>

          <div className="mb-2 font-semibold text-gray-600">Описание</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedDeviceCatalog.description?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedDeviceCatalog.description?.ru}
            </div>
          </div>

          <div className="mb-2 font-semibold text-gray-600">Цвет</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1 ">
              <div
                className={' p-1 rounded-xl'}
                style={{ width: 'fit-content', backgroundColor: selectedDeviceCatalog.color }}
              >
                {selectedDeviceCatalog.color}
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        form={deviceCategoryForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault() // Prevents form submission on "Enter"
        }}
        name={'deviceCategoryForm'}
      >
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

        <h4 className="text-lg font-semibold mt-4">Описание</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Описание (uz)"
            className="flex-1"
            name={['description', 'uz']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input placeholder="Введите описание" />
          </Form.Item>
          <Form.Item
            label="Описание (ru)"
            className="flex-1"
            name={['description', 'ru']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input placeholder="Введите описание" />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold mt-4">Изображение</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Изображение (uz)"
            className="flex-1"
            name={['image', 'uz']}
            rules={[{ required: true, message: 'Загрузите изображение!' }]}
          >
            <UploadImage
              accept="image/*,image/gif"
              field={['image', 'uz']}
              form={deviceCategoryForm}
            />
          </Form.Item>
          <Form.Item
            label="Изображение (ru)"
            className="flex-1"
            name={['image', 'ru']}
            rules={[{ required: true, message: 'Загрузите изображение!' }]}
          >
            <UploadImage
              accept="image/*,image/gif"
              field={['image', 'ru']}
              form={deviceCategoryForm}
            />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold mt-4">Цвет фона</h4>
        <Form.Item
          label="Цвет фона"
          name="color"
          className={'w-80'}
          rules={[{ required: true, message: 'Введите цвет фона!' }]}
        >
          <Input placeholder="Введите цвет фона" />
        </Form.Item>

        <div className="flex">
          <Form.Item>
            <Button
              form="deviceCategoryForm"
              type="primary"
              htmlType="submit"
              loading={onSubmit?.isPending}
              disabled={onSubmit?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedDeviceCatalog?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedDeviceCatalog(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedDeviceCatalog?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteDeviceCategory.mutate(selectedDeviceCatalog.id)}
              loading={onDeleteDeviceCategory?.isPending}
              disabled={onDeleteDeviceCategory?.isPending}
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
