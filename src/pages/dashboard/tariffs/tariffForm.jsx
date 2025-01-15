import React, { useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/20/solid/index.js'
import {
  addSpaceEveryThreeChars,
  dayjsToSeconds,
  secondsToDayjs,
  secondsToTime,
} from '@/utils/functions.js'
import { cloneDeep } from 'lodash'
import { Badge, Button, Form, Input, Select, TimePicker } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { createTariff, updateTariffs } from '@/utils/api/functions.js'
import { Switch } from '@material-tailwind/react'
import UploadImage from '@/components/UploadImage/index.jsx'
// Options array with Russian labels

const speedList = [
  {
    fieldKey: 0,
    isListField: true,
    key: 0,
    name: 0,
  },
  {
    fieldKey: 1,
    isListField: true,
    key: 1,
    name: 1,
  },
]
const filterOptions = [
  { title: 'Для квартиры', value: 'forApartment' },
  { title: 'Для частного дома', value: 'forHome' },
]
export default function TariffForm({
  selectedTariff,
  selectOptions,
  onUpdateList,
  setSelectedTariff,
}) {
  const [tariffForm] = Form.useForm()

  const onUpdateTariff = useMutation({
    // Optional callbacks
    mutationFn: updateTariffs,
    onSuccess: (data) => {
      setSelectedTariff(undefined)
      onUpdateList(data?.data, 'update')
    },
  })

  const onAddTariff = useMutation({
    // Optional callbacks
    mutationFn: createTariff,
    onSuccess: (data) => {
      setSelectedTariff(undefined)
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedTariff) {
      let newFormData = cloneDeep(selectedTariff)
      if (newFormData?.speedByTime?.length > 0) {
        speedList.map((item, index) => {
          if (newFormData?.speedByTime?.[index]) {
            const time = newFormData?.speedByTime?.[index]
            newFormData.speedByTime[index].fromTime = secondsToDayjs(time?.fromTime)
            newFormData.speedByTime[index].toTime = secondsToDayjs(time?.toTime)
            newFormData.speedByTime[index].speed = Math.round(time?.speed / 1024)
          } else {
            newFormData.speedByTime?.push({
              fromTime: secondsToDayjs(0),
            })
          }
        })
      }

      tariffForm.setFieldsValue(newFormData)
    }
  }, [selectedTariff])
  function getRandomNumberFromArray(arr) {
    if (arr.length !== 10) {
      throw new Error('Array must contain exactly 10 numbers')
    }

    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  }

  const onSubmit = () => {
    tariffForm.validateFields().then((values) => {
      values?.speedByTime?.map((time, index) => {
        values.speedByTime[index].fromTime = dayjsToSeconds(time?.fromTime)
        values.speedByTime[index].toTime = dayjsToSeconds(time?.toTime)
        values.speedByTime[index].speed = Number(time?.speed) * 1024
      })
      values.devicesMinAmount = Number(values?.devicesMinAmount)
      values.devicesMaxAmount = Number(values?.devicesMaxAmount)
      values.position = Number(values.position)
      values.categories = selectedTariff?.categories || []
      if (!values?.price) {
        values.price = selectedTariff?.price || []
      } else {
        values.price = Number(values?.price)
      }
      // values.price = selectedTariff?.price || []
      // values.price = 200000
      try {
        if (selectedTariff?.id) {
          onUpdateTariff.mutate({ id: selectedTariff.id, params: values })
        } else {
          onAddTariff.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-2 ">
      {selectedTariff?.id && (
        <div className={'mb-2'}>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Наименование</div>
              <div>
                <div>
                  <strong className={'text-gray-600'}>Uz: </strong>
                  {selectedTariff.name?.uz}
                </div>
                <div>
                  <strong className={'text-gray-600'}>Ru: </strong>
                  {selectedTariff.name?.ru}
                </div>
              </div>
            </div>
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Скорость</div>
              <div>
                {selectedTariff?.speedByTime?.map((item, index) => (
                  <div key={index}>
                    {secondsToTime(item.fromTime)} - {secondsToTime(item?.toTime)}
                    <strong> {item?.speed} MB/s</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className={'flex-1'}>
              <div className={'font-semibold text-gray-600'}>Устройства</div>
              <div>
                {selectedTariff.devicesMinAmount} - {selectedTariff.devicesMaxAmount}
              </div>
            </div>
            <div className={'flex-1'}>
              <div className={'font-semibold text-gray-600'}>Цена</div>
              <div>{addSpaceEveryThreeChars(selectedTariff?.price)}</div>
            </div>
          </div>
          {selectedTariff?.trafficType === 'unlim' && (
            <div className="flex gap-4">
              <div className={'flex-1'}>
                <Badge color={'green'} count={'Безлимитный'} />
              </div>
            </div>
          )}
        </div>
      )}
      <Form
        form={tariffForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevents form submission on "Enter"
          }
        }}
        name={'tariffForm'}
      >
        <h4 className="text-lg font-semibold mt-4">Наименование</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Наименование (уз) "
            className={'flex-1'}
            name={['name', 'uz']}
            rules={[{ required: true, message: 'Введите имя!' }]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item
            label="Наименование (ру) "
            className={'flex-1'}
            name={['name', 'ru']}
            rules={[{ required: true, message: 'Введите имя!' }]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold">Устройства</h4>
            <div className="flex gap-2  my-1">
              <Form.Item
                label="Устройства мин "
                className={'flex-1'}
                name={['devicesMinAmount']}
                rules={[{ required: true, message: 'Введите число!' }]}
              >
                <Input type={'number'} />
              </Form.Item>
              <Form.Item
                label="Устройства мах "
                className={'flex-1'}
                name={['devicesMaxAmount']}
                rules={[{ required: true, message: 'Введите число!' }]}
              >
                <Input type={'number'} />
              </Form.Item>
            </div>
          </div>
          <div className="flex-1 flex gap-4">
            <div className={'flex-1'}>
              <h4 className="text-lg font-semibold">Тип</h4>
              <Form.Item
                label="Выберите тип"
                name="type"
                className={'my-1'}
                rules={[{ required: true, message: 'Пожалуйста, выберите тип!' }]}
              >
                <Select placeholder="Пожалуйста, выберите план">
                  {selectOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className={'flex-1'}>
              <h4 className="text-lg font-semibold">Активный</h4>
              <Form.Item
                label="Включить функцию"
                name="isActive"
                className={'my-1'}
                valuePropName="checked" // Required to sync with switch checked state
              >
                <Switch />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-medium mb-2">Скорость</h4>
            <Form.List name="speedByTime">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <div key={field.key} className={'flex gap-20'}>
                        <Form.Item
                          rules={[{ required: true, message: 'Введите скорость!' }]}
                          className={'flex-1'}
                          label="Скорость в мб/с"
                          name={[field.name, 'speed']}
                        >
                          <Input type={'number'} />
                        </Form.Item>
                        <Form.Item
                          label="От"
                          name={[field?.name, 'fromTime']}
                          className={'flex-1'}
                          rules={[
                            { required: true, message: 'Выберите время!' },
                            {
                              validator: (_, value) => {
                                const toValue = tariffForm.getFieldValue([
                                  'speedByTime',
                                  field?.name,
                                  'toTime',
                                ])
                                if (!value || !toValue) {
                                  return Promise.resolve()
                                }
                                if (dayjsToSeconds(toValue) === 0) {
                                  return Promise.resolve()
                                }
                                if (value?.isBefore && value?.isBefore(toValue)) {
                                  return Promise.resolve()
                                }
                                return Promise.reject(new Error(''))
                              },
                              message: 'Время "От" должно быть раньше времени "До"!',
                            },
                          ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            onSelect={(c) => {
                              tariffForm.setFieldValue(['speedByTime', field?.name, 'fromTime'], c)
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="До "
                          name={[field?.name, 'toTime']}
                          className={'flex-1'}
                          rules={[
                            { required: true, message: 'Выберите время!' },
                            {
                              validator(_, value) {
                                const fromValue = tariffForm.getFieldValue([
                                  'speedByTime',
                                  field?.name,
                                  'fromTime',
                                ])
                                if (!value || !fromValue) {
                                  return Promise.resolve()
                                }
                                if (dayjsToSeconds(value) === 0) {
                                  return Promise.resolve()
                                }
                                if (fromValue?.isBefore && fromValue?.isBefore(value)) {
                                  return Promise.resolve()
                                }
                                return Promise.reject(
                                  new Error('Время "До" должно быть позже времени "От"!')
                                )
                              },
                              message: 'Время "До" должно быть позже времени "От"!',
                            },
                          ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            onSelect={(c) => {
                              tariffForm.setFieldValue(['speedByTime', field?.name, 'toTime'], c)
                            }}
                          />
                        </Form.Item>
                        {/*<Button*/}
                        {/*  type="button"*/}
                        {/*  onClick={() => remove(index)}*/}
                        {/*  hidden={tariffForm.getFieldsValue().speedByTime?.length === 1}*/}
                        {/*  className="text-red-500 flex-2  mt-8 hover:text-red-700"*/}
                        {/*>*/}
                        {/*  <TrashIcon className="h-5 w-5" />*/}
                        {/*</Button>*/}
                      </div>
                    ))}
                    {/*<Form.Item>*/}
                    {/*    <Button*/}
                    {/*        type="primary"*/}
                    {/*        color={'default'}*/}
                    {/*        size={'middle'}*/}
                    {/*        className={'bg-indigo-900 mt-2'}*/}
                    {/*        onClick={() =>*/}
                    {/*            add({*/}
                    {/*                speed: 0,*/}
                    {/*                fromTime: dayjs().startOf('day'),*/}
                    {/*                toTime: dayjs().startOf('day').add(86399, 'second'),*/}
                    {/*            })*/}
                    {/*        }*/}
                    {/*        hidden={tariffForm?.getFieldValue('speedByTime')?.length > 1}*/}
                    {/*    >*/}
                    {/*        Добавить время*/}
                    {/*    </Button>*/}
                    {/*</Form.Item>*/}
                  </div>
                )
              }}
            </Form.List>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium mb-2">Тип жилья</h4>
            <Form.Item
              label="Выберите тип жилья"
              name="apartmentTypes"
              rules={[{ required: true, message: 'Пожалуйста, выберите тип жилья!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Пожалуйста, выберите"
                allowClear
                style={{ width: '100%' }}
              >
                {filterOptions?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              className="flex-1"
              label="Позиция"
              name="position"
              rules={[{ required: true, message: 'Введите позицию' }]}
            >
              <Input placeholder="Введите позицию" />
            </Form.Item>
            <Form.Item
              className="flex-1"
              label="price"
              name="price"
              rules={[{ required: true, message: 'Введите позицию' }]}
            >
              <Input placeholder="price" />
            </Form.Item>
          </div>
        </div>

        <h4 className="text-lg font-medium my-4">Что входит в тариф</h4>
        <Form.List name="description">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key} className={'flex gap-4 align-baseline'}>
                    <Form.Item
                      rules={[{ required: true, message: 'Введите описание!' }]}
                      className={'flex-1'}
                      label="Описание (уз)"
                      name={[field.name, 'uz']}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      rules={[{ required: true, message: 'Введите описание!' }]}
                      className={'flex-1'}
                      label="Описание (ру)"
                      name={[field.name, 'ru']}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        // hidden={tariffForm.getFieldsValue().description?.length === 1}
                        className="text-red-500 flex-3  mt-7 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </Form.Item>
                  </div>
                ))}
                <Button
                  type="primary"
                  color={'default'}
                  size={'middle'}
                  className={'bg-indigo-900 mt-2'}
                  onClick={() =>
                    add({
                      uz: '',
                      ru: '',
                    })
                  }
                >
                  Добавить описание
                </Button>
              </div>
            )
          }}
        </Form.List>
        <div className={'text-2xl font-semibold mt-2'}>Тарифное изображение</div>
        <div className="flex mt-3">
          <Form.Item
            name={['image', 'uz']}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            className={'flex-1'}
            label="Изображение (уз)"
          >
            <UploadImage accept={'image/*,image/gif'} field={['image', 'uz']} form={tariffForm} />
          </Form.Item>
          <Form.Item
            name={['image', 'ru']}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            className={'flex-1'}
            label="Изображение (ру)"
          >
            <UploadImage accept={'image/*,image/gif'} field={['image', 'ru']} form={tariffForm} />
          </Form.Item>
        </div>
        <div className="flex mt-3">
          <Form.Item
            name={['imageMobile', 'uz']}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            className={'flex-1'}
            label="Мобильное изображение (уз)"
          >
            <UploadImage
              accept={'image/*,image/gif'}
              field={['imageMobile', 'uz']}
              form={tariffForm}
            />
          </Form.Item>
          <Form.Item
            name={['imageMobile', 'ru']}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            className={'flex-1'}
            label="Мобильное изображение (ру)"
          >
            <UploadImage
              accept={'image/*,image/gif'}
              field={['imageMobile', 'ru']}
              form={tariffForm}
            />
          </Form.Item>
        </div>
        <div className="flex">
          <Form.Item>
            <Button
              form={'tariffForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateTariff?.isPending || onAddTariff?.isPending}
              disabled={onUpdateTariff?.isPending || onAddTariff?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedTariff?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedTariff(undefined)}
            color="amber"
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  )
}
