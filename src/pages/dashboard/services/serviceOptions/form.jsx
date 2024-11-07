import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input, Select, Switch } from 'antd' // Import Select from antd
import { useMutation } from '@tanstack/react-query'
import {
  createServiceOption,
  deleteServiceOption,
  updateServiceOption,
} from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'

export default function ServiceOptionForm({
  selectedServiceOption,
  onUpdateList,
  setSelectedServiceOption,
}) {
  const [officeForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const onUpdateServiceOption = useMutation({
    mutationFn: updateServiceOption,
    onSuccess: (data) => {
      onUpdateList(data.data, 'update')
    },
  })

  const onDeleteServiceOption = useMutation({
    mutationFn: deleteServiceOption,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'delete')
    },
  })

  const onAddServiceOption = useMutation({
    mutationFn: createServiceOption,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedServiceOption) {
      let newFormData = cloneDeep(selectedServiceOption)
      officeForm.setFieldsValue(newFormData)
    }
  }, [selectedServiceOption])

  const onSubmit = () => {
    officeForm.validateFields().then((values) => {
      values.price.unitPrice = Number(values.price.unitPrice)
      // values.price.currency = 'uzs'
      if (selectedServiceOption?.id) {
        onUpdateServiceOption.mutate({ id: selectedServiceOption.id, params: values })
      } else {
        onAddServiceOption.mutate(values)
      }
    })
  }

  return (
    <div className=" p-5 rounded-3xl bg-white">
      {selectedServiceOption?.id && (
        <div className="mb-2">
          <div className="mb-2 font-semibold text-gray-600">Заголовок</div>
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Uz: </strong>
              {selectedServiceOption.name?.uz}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Ru: </strong>
              {selectedServiceOption.name?.ru}
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div className="mb-2 font-semibold text-gray-600">Цвет</div>
              <div className="flex mb-2 gap-4">
                <div className="flex-1">
                  <div
                    className="px-2 rounded-xl"
                    style={{
                      width: 'fit-content',
                      backgroundColor: '#2E334D1A',
                      color: selectedServiceOption.color,
                    }}
                  >
                    {selectedServiceOption.color}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div
                className="rounded-xl px-2 bg-gray-200 font-bold"
                style={{ width: 'fit-content', color: selectedServiceOption?.color }}
              >
                {selectedServiceOption?.name?.[lang]}
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
            e.preventDefault()
          }
        }}
        name="officeForm"
      >
        {/* Title Fields */}
        <h4 className="text-lg font-semibold">Заголовок</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Заголовок (ru)"
            className="flex-1"
            name={['name', 'ru']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
          <Form.Item
            label="Заголовок (uz)"
            className="flex-1"
            name={['name', 'uz']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
        </div>

        {/* Price Fields */}
        <h4 className="text-lg font-semibold">Цена</h4>
        <div className="flex gap-4">
          <div className="flex gap-4 my-1 w-1/2">
            <Form.Item
              label="Цена за единицу"
              name={['price', 'unitPrice']}
              className="flex-1"
              rules={[{ required: true, message: 'Введите цену за единицу!' }]}
            >
              <Input type="number" placeholder="Введите цену за единицу" />
            </Form.Item>
          </div>
          <div className="flex gap-4 my-1 w-1/2">
            <Form.Item
              label="Тип единицы (uz)"
              name={['price', 'unitType', 'uz']}
              className="flex-1"
              rules={[{ required: true, message: 'Выберите тип единицы!' }]}
            >
              <Input placeholder="Введите цену за единицу" />

              {/*<Select placeholder="Выберите тип единицы">*/}
              {/*  <Select.Option value="unit">сум</Select.Option>*/}
              {/*  <Select.Option value="meter">метр</Select.Option>*/}
              {/*  /!*<Select.Option value="sum-mert">сум/метр</Select.Option>*!/*/}
              {/*</Select>*/}
            </Form.Item>
            <Form.Item
              label="Тип единицы(ru)"
              name={['price', 'unitType', 'ru']}
              className="flex-1"
              rules={[{ required: true, message: 'Выберите тип единицы!' }]}
            >
              <Input placeholder="Введите цену за единицу" />

              {/*<Select placeholder="Выберите тип единицы">*/}
              {/*  <Select.Option value="unit">сум</Select.Option>*/}
              {/*  <Select.Option value="meter">метр</Select.Option>*/}
              {/*  /!*<Select.Option value="sum-mert">сум/метр</Select.Option>*!/*/}
              {/*</Select>*/}
            </Form.Item>
          </div>
        </div>
        <Form.Item className="flex-1" label="Активный" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* Action Buttons */}
        <div className="flex">
          <Form.Item>
            <Button
              form="officeForm"
              type="primary"
              htmlType="submit"
              loading={onSubmit?.isPending}
              disabled={onSubmit?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedServiceOption?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedServiceOption(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedServiceOption?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteServiceOption.mutate(selectedServiceOption.id)}
              loading={onDeleteServiceOption?.isPending}
              disabled={onDeleteServiceOption?.isPending}
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
