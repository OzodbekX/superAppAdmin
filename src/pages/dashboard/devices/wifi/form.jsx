import React, { useEffect } from 'react'
import { addSpaceEveryThreeChars } from '@/utils/functions.js'
import { cloneDeep } from 'lodash'
import { Button, Form, Input, Select } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createWifiDevice,
  deleteWifiDevice,
  fetchDeviceCategory,
  fetchDeviceTag,
  updateWifiDevice,
} from '@/utils/api/functions.js'
import UploadImage from '@/components/UploadImage/index.jsx'
import { userStore } from '@/utils/zustand.js'

export default function WifiForm({ selectedWifi, onUpdateList, setSelectedWifi }) {
  const [wifiForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const { data: categoryList } = useQuery({
    queryKey: ['fetchDeviceCategory'], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchDeviceCategory({
        offset: 0,
        limit: 100,
      }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: tagsList } = useQuery({
    queryKey: ['fetchDeviceTag'], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchDeviceTag({
        offset: 0,
        limit: 100,
      }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const onUpdateWifi = useMutation({
    // Optional callbacks
    mutationFn: updateWifiDevice,
    onSuccess: (data) => {
      setSelectedWifi(undefined)
      onUpdateList(data.data, 'update')
    },
  })

  const onAddWifi = useMutation({
    // Optional callbacks
    mutationFn: createWifiDevice,
    onSuccess: (data) => {
      setSelectedWifi(undefined)
      onUpdateList(data.data, 'create')
    },
  })

  const onDeleteDevice = useMutation({
    // Optional callbacks
    mutationFn: deleteWifiDevice,
    onSuccess: () => {
      onUpdateList(selectedWifi, 'delete')
      setSelectedWifi(undefined)
    },
  })

  useEffect(() => {
    if (selectedWifi) {
      let newFormData = cloneDeep(selectedWifi)
      newFormData.catalogs = newFormData?.catalogs?.map((item) => item?.id)
      newFormData.tags = newFormData?.tags?.map((item) => item?.id)

      wifiForm.setFieldsValue(newFormData)
    }
  }, [selectedWifi])

  const onSubmit = () => {
    wifiForm.validateFields().then((values) => {
      values.price = Number(values?.price)
      values.position = Number(values?.position)
      values.installmentPrice = Number(values?.installmentPrice)
      try {
        if (selectedWifi?.id) {
          onUpdateWifi.mutate({ id: selectedWifi.id, params: values })
        } else {
          onAddWifi.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className="px-5 ">
      {selectedWifi?.id && (
        <div className="mb-2">
          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <div className="mb-2 font-semibold text-gray-600">Наименование</div>
              <div className={'flex -gap-4'}>
                <div className={'flex-1'}>
                  <strong className="text-gray-600">Uz: </strong>
                  {selectedWifi.name?.uz}
                </div>
                <div className={'flex-1'}>
                  <strong className="text-gray-600">Ru: </strong>
                  {selectedWifi.name?.ru}
                </div>
              </div>
            </div>
            <div className="flex flex-1 gap-4">
              <div className="flex-1">
                <div className="mb-2 font-semibold text-gray-600">Лимит устройств</div>
                <div>
                  <strong>{selectedWifi.limitOfDevices}</strong>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2 font-semibold text-gray-600">
                  Зона покрытия (в квадратных метрах)
                </div>
                <div>
                  <strong>{selectedWifi.coverageArea} </strong>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="font-semibold text-gray-600">Цена</div>
              <div className={'flex -gap-4'}>
                <div className={'flex-1'}>
                  <strong className="text-gray-600">Цена: </strong>
                  {addSpaceEveryThreeChars(selectedWifi?.price)} сум
                </div>
                <div className={'flex-1'}>
                  <strong className="text-gray-600">Цена в рассрочку: </strong>
                  {addSpaceEveryThreeChars(selectedWifi?.installmentPrice)} сум
                </div>
              </div>
            </div>
            <div className="flex-1 flex gap-4">
              <div className="flex-1">
                <div className="font-semibold text-gray-600">Скорость</div>
                <div>{selectedWifi.speed} МБ/с</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-600">Позиция</div>
                <div>{selectedWifi.position}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className={'flex -gap-4'}>
                <div className="flex-1">
                  <div className="mb-2 font-semibold text-gray-600">Период рассрочки</div>
                  <div className={'flex -gap-4'}>
                    <div className={'flex-1'}>
                      <strong className="text-gray-600">Uz: </strong>
                      {selectedWifi.installmentPeriod?.uz}
                    </div>
                    <div className={'flex-1'}>
                      <strong className="text-gray-600">Ru: </strong>
                      {selectedWifi.installmentPeriod?.ru}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex gap-4">
              <div className="flex-1">
                <div className="font-semibold text-gray-600 mb-1">Каталоги</div>
                <div className={'flex'}>
                  {selectedWifi.catalogs?.map((item, index) => (
                    <div key={item?.id}>
                      {index !== 0 ? ', ' : ''}
                      {item.title?.[lang]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-600  mb-1">Таги</div>
                <div className={'flex'}>
                  {selectedWifi.tags?.map((item, index) => (
                    <div key={item?.id}>
                      {index !== 0 ? ', ' : ''}
                      {item.name?.[lang]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        form={wifiForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
        name="wifiForm"
      >
        <h4 className="text-lg font-semibold mt-4">Наименование</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Наименование (уз)"
            className="flex-1"
            name={['name', 'uz']}
            rules={[{ required: true, message: 'Введите наименование!' }]}
          >
            <Input placeholder="Введите наименование" />
          </Form.Item>
          <Form.Item
            label="Наименование (ру)"
            className="flex-1"
            name={['name', 'ru']}
            rules={[{ required: true, message: 'Введите наименование!' }]}
          >
            <Input placeholder="Введите наименование" />
          </Form.Item>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex gap-4">
            <Form.Item
              label="Лимит устройств"
              className="flex-1"
              name="limitOfDevices"
              rules={[{ required: true, message: 'Введите лимит!' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Зона покрытия (в квадратных метрах)"
              className="flex-1"
              name="coverageArea"
              rules={[{ required: true, message: 'Введите зона покрытия!' }]}
            >
              <Input type="number" />
            </Form.Item>
          </div>

          <div className="flex-1  flex gap-4">
            <div className="flex-1">
              <Form.Item
                label="Скорость"
                className="flex-1"
                name="speed"
                rules={[{ required: true, message: 'Введите скорость!' }]}
              >
                <Input type={'number'} placeholder="в мб/с" />
              </Form.Item>
            </div>
            <Form.Item
              label="Позиция"
              className="flex-1"
              name="position"
              rules={[{ required: true, message: 'Введите позиция!' }]}
            >
              <Input />
            </Form.Item>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex gap-4">
            <Form.Item
              label="Цена"
              className="flex-1"
              name="price"
              rules={[{ required: true, message: 'Введите цену!' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Цена в рассрочку" className="flex-1" name="installmentPrice">
              <Input type="number" />
            </Form.Item>
          </div>
          <div className="flex-1 flex gap-4">
            <Form.Item
              label="Период рассрочки (уз)"
              className="flex-1"
              name={['installmentPeriod', 'uz']}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Период рассрочки (ру)"
              className="flex-1"
              name={['installmentPeriod', 'ru']}
            >
              <Input />
            </Form.Item>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex gap-4">
            <Form.Item
              // rules={[{ message: 'Выберите каталог', required: true }]}
              name="catalogs"
              className={'flex-1'}
              label="Каталоги"
            >
              <Select mode="multiple" placeholder="Выберите каталог" allowClear>
                {categoryList?.data?.map((item, index) => (
                  <Option key={index} value={item?.id}>
                    {item?.title?.[lang]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tags" className={'flex-1'} label="Таги">
              <Select mode="multiple" placeholder="Выберите таг" allowClear>
                {tagsList?.data?.map((item, index) => (
                  <Option key={index} value={item?.id}>
                    {item?.name?.[lang]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="flex flex-1 gap-4">
            <Form.Item
              rules={[{ message: 'Пожалуйста, выберите', required: true }]}
              name="isActive"
              label="Статус"
              className="flex-1"
              initialValue={true}
            >
              <Select>
                <Option value={true}>Активный</Option>
                <Option value={false}>Неактивный</Option>
              </Select>
            </Form.Item>
            <div className="flex-1">
              <Form.Item
                label={'Изображение устройства'}
                name="image"
                rules={[{ required: true, message: 'Пожалуйста, загрузите изображение' }]}
              >
                <UploadImage accept="image/*,image/gif" field="image" form={wifiForm} />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex">
          <Form.Item>
            <Button
              form="wifiForm"
              type="primary"
              htmlType="submit"
              loading={onUpdateWifi?.isPending || onAddWifi?.isPending}
              disabled={onUpdateWifi?.isPending || onAddWifi?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedWifi?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          {selectedWifi?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteDevice.mutate(selectedWifi.id)}
              loading={onDeleteDevice?.isPending}
              disabled={onDeleteDevice?.isPending}
              className="mt-4 ml-3 bg-red-500 text-white"
            >
              Удалить
            </Button>
          )}
          <Button
            type="reset"
            onClick={() => setSelectedWifi(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  )
}
