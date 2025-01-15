import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input, Switch } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createService, deleteService, updateService } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import UploadImage from '@/components/UploadImage/index.jsx'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

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
      if (values?.position) {
        values.position = Number(values.position)
      }
      values.image.uz = values.image.ru
      values.options.forEach((item) => {
        item.price.unitPrice = Number(item.price.unitPrice)
        item.position = Number(item.position)
      })
      values.imageMobile.uz = values.imageMobile.ru
      if (selectedServiceCatalog?.id) {
        values.options == selectedServiceCatalog?.options
        onUpdateDeviceService.mutate({ id: selectedServiceCatalog.id, params: values })
      } else {
        onAddDeviceService.mutate(values)
      }
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      {selectedServiceCatalog?.id && (
        <div className="mb-2">
          {/* Display selected item details */}
          <div className="mb-2 font-semibold text-gray-600">Заголовок</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedServiceCatalog.name?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedServiceCatalog.name?.ru}
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
        {/* name Section */}
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
                name="position"
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
              name={['image', 'ru']}
              className={'flex-1 ml-2'}
              label="Изображение"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['image', 'ru']}
                form={deviceServiceForm}
              />
            </Form.Item>
          </div>
          <div className="flex-1 flex gap-4">
            <Form.Item
              name={['imageMobile', 'ru']}
              className={'flex-1 ml-2'}
              label="Мобильное изображение"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['imageMobile', 'ru']}
                form={deviceServiceForm}
              />
            </Form.Item>
            <Form.Item
              name={['icon']}
              className={'flex-1'}
              label="Значок карты"
              rules={[{ message: 'Пожалуйста, загрузите икона', required: true }]}
            >
              <UploadImage accept={'image/*,image/gif'} field={['icon']} form={deviceServiceForm} />
            </Form.Item>
          </div>
        </div>
        <Form.List name="options" initialValue={[]}>
          {(fields, { add, remove }) => (
            <div>
              {fields.map(({ key, name }) => (
                <div key={key}>
                  <div className={'flex justify-between align-middle mb-3'}>
                    <h4 className="text-lg font-medium mb-2">{key + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="danger"
                        className={'bg-gray-500'}
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Удалить услугу
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-4 my-1">
                    <Form.Item
                      label="Заголовок (ru)"
                      className="flex-1"
                      name={[name, 'name', 'ru']}
                      rules={[{ required: true, message: 'Введите заголовок!' }]}
                    >
                      <Input placeholder="Введите заголовок" />
                    </Form.Item>
                    <Form.Item
                      label="Заголовок (uz)"
                      className="flex-1"
                      name={[name, 'name', 'uz']}
                      rules={[{ required: true, message: 'Введите заголовок!' }]}
                    >
                      <Input placeholder="Введите заголовок" />
                    </Form.Item>
                  </div>
                  <h4 className="text-lg font-semibold">Цена</h4>
                  <div className="flex gap-4">
                    <div className="flex gap-4 my-1 w-1/2">
                      <Form.Item
                        label="Позиция"
                        name={[name, 'position']}
                        className="flex-1"
                        rules={[{ required: true, message: 'Введите позиция!' }]}
                      >
                        <Input type="number" placeholder="Введите позиция" />
                      </Form.Item>
                      <Form.Item
                        label="Цена за единицу"
                        name={[name, 'price', 'unitPrice']}
                        className="flex-1"
                        rules={[{ required: true, message: 'Введите цену за единицу!' }]}
                      >
                        <Input type="number" placeholder="Введите цену за единицу" />
                      </Form.Item>
                    </div>
                    <div className="flex gap-4 my-1 w-1/2">
                      <Form.Item
                        label="Тип единицы (uz)"
                        name={[name, 'price', 'unitType', 'uz']}
                        className="flex-1"
                        rules={[{ required: true, message: 'Выберите тип единицы!' }]}
                      >
                        <Input placeholder="Введите цену за единицу" />
                      </Form.Item>
                      <Form.Item
                        label="Тип единицы(ru)"
                        name={[name, 'price', 'unitType', 'ru']}
                        className="flex-1"
                        rules={[{ required: true, message: 'Выберите тип единицы!' }]}
                      >
                        <Input placeholder="Введите цену за единицу" />
                      </Form.Item>
                    </div>
                  </div>
                  <Form.Item
                    className="flex-1"
                    label="Активный"
                    name={[name, 'isActive']}
                    initialValue={true}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </div>
              ))}
              <Form.Item>
                <Button
                  className={'bg-black text-white'}
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Добавить услугу
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

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
