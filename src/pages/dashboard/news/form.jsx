import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input, Select } from 'antd'
import { useMutation } from '@tanstack/react-query'
import UploadImage from '@/components/UploadImage/index.jsx'
import { createNews, deleteNews, updateNews } from '@/utils/api/functions.js'

export default function NewsForm({ selectedNews, onUpdateList, setSelectedNews }) {
  const [cardForm] = Form.useForm()

  const onUpdateNews = useMutation({
    // Optional callbacks
    mutationFn: updateNews,
    onSuccess: (data) => {
      setSelectedNews(undefined)
      onUpdateList(data, 'update')
    },
  })

  const onDeleteNews = useMutation({
    // Optional callbacks
    mutationFn: deleteNews,
    onSuccess: (data) => {
      setSelectedNews(undefined)
      onUpdateList(data?.data, 'delete')
    },
  })

  const onAddNews = useMutation({
    // Optional callbacks
    mutationFn: createNews,
    onSuccess: (data) => {
      setSelectedNews(undefined)
      onUpdateList(data?.data, 'create')
    },
  })

  useEffect(() => {
    if (selectedNews) {
      let newFormData = cloneDeep(selectedNews)
      cardForm.setFieldsValue(newFormData)
    }
  }, [selectedNews])

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      try {
        if (selectedNews?.id) {
          onUpdateNews.mutate({ id: selectedNews.id, params: values })
        } else {
          onAddNews.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedNews?.id && (
        <div className={'mb-2'}>
          <div className={'mb-2 font-semibold text-gray-600'}>Наименование</div>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Uz: </strong>
              {selectedNews.title?.uz}
            </div>
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Ru: </strong>
              {selectedNews.title?.ru}
            </div>
          </div>
          <div className={'mb-2 font-semibold text-gray-600'}>Описание</div>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Uz: </strong>
              {selectedNews.description?.uz}
            </div>
            <div className={'flex-1'}>
              <strong className={'text-gray-600'}>Ru: </strong>
              {selectedNews.description?.ru}
            </div>
          </div>
        </div>
      )}
      <Form
        form={cardForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevents form submission on "Enter"
          }
        }}
        name={'cardForm'}
      >
        <h4 className="text-lg font-semibold mt-4">Заголовок</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Заголовок (уз) "
            className={'flex-1'}
            name={['title', 'uz']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
          <Form.Item
            label="Заголовок (ру) "
            className={'flex-1'}
            name={['title', 'ru']}
            rules={[{ required: true, message: 'Введите заголовок!' }]}
          >
            <Input placeholder="Введите заголовок" />
          </Form.Item>
        </div>
        <h4 className="text-lg font-semibold mt-4">Описание</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Описание (уз) "
            className={'flex-1'}
            name={['description', 'uz']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input.TextArea size={'large'} placeholder="Введите описание" />
          </Form.Item>
          <Form.Item
            label="Описание (ру) "
            className={'flex-1'}
            name={['description', 'ru']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input.TextArea size={'large'} placeholder="Введите описание" />
          </Form.Item>
        </div>
        <Form.Item
          rules={[{ message: 'Пожалуйста, выберите', required: true }]}
          name="isActive"
          label="Статус"
          className={'w-40'}
          initialValue={true}
        >
          <Select>
            <Option value={true}>Активный</Option>
            <Option value={false}>Неактивный</Option>
          </Select>
        </Form.Item>
        <div className={'text-2xl font-semibold mt-2'}>Изображение</div>
        <div className="flex mt-3">
          <Form.Item
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            name={['shortImage', 'uz']}
            className={'flex-1'}
            label="Изображение (уз)"
          >
            <UploadImage
              accept={'image/*,image/gif'}
              field={['shortImage', 'uz']}
              form={cardForm}
            />
          </Form.Item>
          <Form.Item
            name={['shortImage', 'ru']}
            className={'flex-1'}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            label="Изображение (ру)"
          >
            <UploadImage
              accept={'image/*,image/gif'}
              field={['shortImage', 'ru']}
              form={cardForm}
            />
          </Form.Item>
        </div>
        <div className={'text-2xl font-semibold mt-2'}>Изображение баннера</div>
        <div className="flex mt-3">
          <Form.Item
            name={['image', 'uz']}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            className={'flex-1'}
            label="Изображение (уз)"
          >
            <UploadImage accept={'image/*,image/gif'} field={['image', 'uz']} form={cardForm} />
          </Form.Item>
          <Form.Item
            name={['image', 'ru']}
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            className={'flex-1'}
            label="Изображение (ру)"
          >
            <UploadImage accept={'image/*,image/gif'} field={['image', 'ru']} form={cardForm} />
          </Form.Item>
        </div>

        <div className="flex">
          <Form.Item>
            <Button
              form={'cardForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateNews?.isPending || onAddNews?.isPending}
              disabled={onUpdateNews?.isPending || onAddNews?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedNews?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedNews(undefined)}
            color="amber"
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedNews?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteNews.mutate(selectedNews.id)}
              color="amber"
              loading={onDeleteNews.isPending}
              disabled={onDeleteNews.isPending}
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
