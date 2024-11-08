import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input, Select } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createChannel,
  fetchChannelCategories,
  fetchChannelTariffs,
  updateChannel,
} from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import UploadImage from '@/components/UploadImage/index.jsx'
import { createSelectList } from '@/utils/functions.js' // Update this to your actual API call path

const { Option } = Select

export default function ChannelForm({ selectedChannel, onUpdateList, setSelectedChannel }) {
  const [channelForm] = Form.useForm()
  const lang = userStore((state) => state.language)

  const { data: categoryList } = useQuery({
    queryKey: ['fetchChannelCategories'], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchChannelCategories({
        offset: 0,
        limit: 100,
      }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: tariffList } = useQuery({
    queryKey: ['fetchChannelTariffsAll'], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchChannelTariffs({
        offset: 0,
        limit: 100,
      }), // Fetch the correct page
    keepPreviousData: true, // Keep previous data while fetching the new one (useful for pagination)
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const onAddChannel = useMutation({
    mutationFn: createChannel,
    onSuccess: (data) => {
      setSelectedChannel(undefined)
      onUpdateList(data.data, 'create')
    },
  })
  const onUpdateChannel = useMutation({
    mutationFn: updateChannel,
    onSuccess: (data) => {
      setSelectedChannel(undefined)
      onUpdateList(data.data, 'update')
    },
  })

  useEffect(() => {
    if (selectedChannel && tariffList && categoryList) {
      let newFormData = cloneDeep(selectedChannel)
      newFormData.categories = createSelectList(selectedChannel?.categories, categoryList.data)
      newFormData.tariffs = createSelectList(selectedChannel?.tariffs, tariffList.data)
      channelForm.setFieldsValue(newFormData)
    }
  }, [selectedChannel, categoryList, tariffList])

  const onSubmit = () => {
    channelForm.validateFields().then((values) => {
      try {
        if (selectedChannel?.id) {
          onUpdateChannel.mutate({ id: selectedChannel.id, params: values })
        } else {
          onAddChannel.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 px-4 ">
      {selectedChannel?.id && (
        <div className={'mb-2'}>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Название канала</div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Uz: </strong>
                  {selectedChannel.name?.uz}
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Ru: </strong>
                  {selectedChannel.name?.ru}
                </div>
              </div>
            </div>
          </div>
          <div className={'flex gap-4 mb-2'}>
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Категории: </strong>
              {selectedChannel.categories?.map((category, index) => (
                <div
                  className={'bg-gray-200 px-2 rounded-xl'}
                  key={index}
                  style={{ width: 'fit-content' }}
                >
                  {category?.name?.[lang]}
                </div>
              ))}
            </div>
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Тарифы: </strong>
              {selectedChannel.tariffs?.map((tariff, index) => (
                <div
                  className={'bg-gray-200 px-2 rounded-xl'}
                  key={index}
                  style={{ width: 'fit-content' }}
                >
                  {tariff?.title?.[lang]}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Form
        form={channelForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevent form submission on "Enter"
          }
        }}
        name={'channelForm'}
      >
        <h4 className="text-lg font-semibold mt-4">Имя Канала</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Наименование (уз) "
            className={'flex-1'}
            name={['name', 'uz']}
            rules={[{ required: true, message: 'Введите название!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Наименование (ru) "
            className={'flex-1'}
            name={['name', 'ru']}
            rules={[{ required: true, message: 'Введите название!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold my-4">Категории</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            rules={[{ message: 'Выберите категории', required: true }]}
            name="categories"
            className={'flex-1'}
            label="Категории"
          >
            <Select mode="multiple" placeholder="Выберите категории" allowClear>
              {categoryList?.data?.map((item, index) => (
                <Option key={index} value={item?.id}>
                  {item?.name?.[lang]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[{ message: 'Выберите тариф', required: true }]}
            name="tariffs"
            className={'flex-1'}
            label="Тарифы"
          >
            <Select mode="multiple" placeholder="Выберите тариф" allowClear>
              {tariffList?.data?.map((item, index) => (
                <Option key={index} value={item?.id}>
                  {item?.title?.[lang]}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          name={'image'}
          className={'flex-1'}
          label="Логотип"
          rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
        >
          <UploadImage accept={'image/*,image/gif'} field={'image'} form={channelForm} />
        </Form.Item>

        <div className="flex">
          <Form.Item>
            <Button
              form={'channelForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateChannel?.isPending}
              disabled={onUpdateChannel?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedChannel?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedChannel(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  )
}
