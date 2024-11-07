import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createDeviceTag, deleteDeviceTag, updateDeviceTag } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'

export default function DeviceTagForm({ selectedDeviceTag, onUpdateList, setSelectedDeviceTag }) {
  const [officeForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const onUpdateDeviceTag = useMutation({
    // Optional callbacks
    mutationFn: updateDeviceTag,
    onSuccess: (data) => {
      onUpdateList(data.data, 'update')
    },
  })

  const onDeleteDeviceTag = useMutation({
    // Optional callbacks
    mutationFn: deleteDeviceTag,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'delete')
    },
  })

  const onAddDeviceTag = useMutation({
    // Optional callbacks
    mutationFn: createDeviceTag,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedDeviceTag) {
      let newFormData = cloneDeep(selectedDeviceTag)
      officeForm.setFieldsValue(newFormData)
    }
  }, [selectedDeviceTag])

  const onSubmit = () => {
    officeForm.validateFields().then((values) => {
      try {
        if (selectedDeviceTag?.id) {
          onUpdateDeviceTag.mutate({ id: selectedDeviceTag.id, params: values })
        } else {
          onAddDeviceTag.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className="mt-10 p-5  rounded-3xl bg-white">
      {selectedDeviceTag?.id && (
        <div className={'mb-2'}>
          <div className="mb-2 font-semibold text-gray-600">Заголовок</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedDeviceTag.name?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedDeviceTag.name?.ru}
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="mb-2 font-semibold text-gray-600">Цвет</div>
              <div className="flex mb-2 gap-4">
                <div className="flex-1">
                  <div
                    className={'px-2 rounded-xl'}
                    style={{
                      width: 'fit-content',
                      backgroundColor: '#2E334D1A',
                      color: selectedDeviceTag.color,
                    }}
                  >
                    {selectedDeviceTag.color}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div
                className={'rounded-xl px-2  bg-gray-200 font-bold'}
                style={{ width: 'fit-content', color: selectedDeviceTag?.color }}
              >
                {selectedDeviceTag?.name?.[lang]}
              </div>
            </div>
          </div>
        </div>
      )}
      <Form
        form={officeForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevents form submission on "Enter"
          }
        }}
        name={'officeForm'}
      >
        <h4 className="text-lg font-semibold mt-4">Заголовок</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Заголовок (uz)"
            className="flex-1"
            name={['name', 'uz']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
          <Form.Item
            label="Заголовок (ru)"
            className="flex-1"
            name={['name', 'ru']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
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
              form={'officeForm'}
              type="primary"
              htmlType={'submit'}
              loading={onSubmit?.isPending}
              disabled={onSubmit?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedDeviceTag?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedDeviceTag(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedDeviceTag?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteDeviceTag.mutate(selectedDeviceTag.id)}
              loading={onDeleteDeviceTag?.isPending}
              disabled={onDeleteDeviceTag?.isPending}
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
