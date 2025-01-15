import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Badge, Button, Form, Input, Select } from 'antd'
import { useMutation } from '@tanstack/react-query'
import UploadImage from '@/components/UploadImage/index.jsx'
import { createOffice, deleteOffice, updateOffice } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'

export default function OfficeForm({
  selectedOffice,
  onUpdateList,
  cityList = [],
  setSelectedOffice,
}) {
  const [officeForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const onUpdateOffice = useMutation({
    // Optional callbacks
    mutationFn: updateOffice,
    onSuccess: (data) => {
      onUpdateList(data.data, 'update')
    },
  })

  const onDeleteOffice = useMutation({
    // Optional callbacks
    mutationFn: deleteOffice,
    onSuccess: () => {
      onUpdateList(selectedOffice, 'delete')
    },
  })

  const onAddOffice = useMutation({
    // Optional callbacks
    mutationFn: createOffice,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedOffice) {
      let newFormData = cloneDeep(selectedOffice)
      newFormData.cityId = selectedOffice?.city?.id
      officeForm.setFieldsValue(newFormData)
    }
  }, [selectedOffice])

  const onSubmit = () => {
    officeForm.validateFields().then((values) => {
      try {
        values.coords.lat = Number(values.coords.lat)
        values.coords.long = Number(values.coords.long)
        if (selectedOffice?.id) {
          onUpdateOffice.mutate({ id: selectedOffice.id, params: values })
        } else {
          onAddOffice.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className="mt-10 p-5  rounded-3xl bg-white">
      {selectedOffice?.id && (
        <div className={'mb-2'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Адрес</div>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Uz: </strong>
              {selectedOffice.address?.uz}
            </div>
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Ru: </strong>
              {selectedOffice.address?.ru}
            </div>
          </div>
          <div className={'mb-2 font-semibold text-gray-600'}>Ориентир</div>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Uz: </strong>
              {selectedOffice.landmark?.uz}
            </div>
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Ru: </strong>
              {selectedOffice.landmark?.ru}
            </div>
          </div>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Координаты</div>
              <div className="flex mb-2 gap-4">
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Широта: </strong>
                  {selectedOffice.coords?.lat}
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Долгота: </strong>
                  {selectedOffice.coords?.long}
                </div>
              </div>
            </div>
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Статус</div>
              <div className="flex mb-2 gap-4">
                <div className={'flex-1'}>
                  <Badge
                    key={selectedOffice?.id}
                    showZero
                    color={selectedOffice?.isActive ? '#52c41a' : '#faad14'}
                    count={selectedOffice?.isActive ? 'активный' : 'неактивный'}
                  />
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Город: </strong>
                  {cityList?.find((item) => selectedOffice?.cityId === item?.id)?.name?.[lang]}
                </div>
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
        <h4 className="text-lg font-semibold mt-4">Адрес</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Адрес (уз) "
            className={'flex-1'}
            name={['address', 'uz']}
            rules={[{ required: true, message: 'Введите адрес!' }]}
          >
            <Input placeholder="Введите адрес" />
          </Form.Item>
          <Form.Item
            label="Адрес (ру) "
            className={'flex-1'}
            name={['address', 'ru']}
            rules={[{ required: true, message: 'Введите адрес!' }]}
          >
            <Input placeholder="Введите адрес" />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold mt-4">Ориентир</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Ориентир (уз)"
            className={'flex-1'}
            name={['landmark', 'uz']}
            rules={[{ required: true, message: 'Введите ориентир!' }]}
          >
            <Input placeholder="Введите ориентир" />
          </Form.Item>
          <Form.Item
            label="Ориентир (ру)"
            className={'flex-1'}
            name={['landmark', 'ru']}
            rules={[{ required: true, message: 'Введите ориентир!' }]}
          >
            <Input placeholder="Введите ориентир" />
          </Form.Item>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold mt-4">Координаты</h4>
            <div className="flex gap-4 my-1">
              <Form.Item
                label="Широта"
                className={'flex-1'}
                name={['coords', 'lat']}
                rules={[{ required: true, message: 'Введите широту!' }]}
              >
                <Input placeholder="Введите широту" />
              </Form.Item>
              <Form.Item
                label="Долгота"
                className={'flex-1'}
                name={['coords', 'long']}
                rules={[{ required: true, message: 'Введите долготу!' }]}
              >
                <Input placeholder="Введите долготу" />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-1 gap-4 mt-12">
            <Form.Item
              rules={[{ required: true, message: 'Пожалуйста, выберите город' }]}
              name="cityId"
              className={'flex-1'}
              label="Город"
            >
              <Select allowClear={true} placeholder="Выберите город" className={'w-80 mr-8'}>
                {cityList?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item?.name?.[lang]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              rules={[{ message: 'Пожалуйста, выберите', required: true }]}
              name="isActive"
              label="Статус"
              className={'flex-1'}
              initialValue={true}
            >
              <Select>
                <Option value={true}>Активный</Option>
                <Option value={false}>Неактивный</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4">Город</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            name={['imageUrl']}
            className={'flex-1'}
            label="Изображение"
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
          >
            <UploadImage accept={'image/*,image/gif'} field={['imageUrl']} form={officeForm} />
          </Form.Item>
        </div>

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
              {selectedOffice?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedOffice(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedOffice?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteOffice.mutate(selectedOffice.id)}
              loading={onDeleteOffice?.isPending}
              disabled={onDeleteOffice?.isPending}
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
