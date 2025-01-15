import React, { useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import {
  createChatFAQsCategories,
  deleteChatFAQsCategories,
  updateChatFAQsCategories,
} from '@/utils/api/functions.js'

export default function ChatFAQsCategoriesForm({
  selectedCategory,
  onUpdateList,
  setSelectedCategory,
}) {
  const [categoryForm] = Form.useForm()

  const onUpdateChannel = useMutation({
    mutationFn: updateChatFAQsCategories,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'update')
    },
  })
  const createCategory = useMutation({
    mutationFn: createChatFAQsCategories,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })
  const onDeleteCategory = useMutation({
    mutationFn: deleteChatFAQsCategories,
    onSuccess: (data) => {
      onUpdateList(selectedCategory, 'delete')
    },
  })

  useEffect(() => {
    if (selectedCategory) {
      categoryForm.setFieldsValue(selectedCategory)
    }
  }, [selectedCategory])

  const onSubmit = () => {
    categoryForm.validateFields().then((values) => {
      try {
        if (selectedCategory?.id) {
          onUpdateChannel.mutate({ id: selectedCategory.id, ...values })
        } else {
          createCategory.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 p-4">
      {selectedCategory?.id && (
        <div className={'mb-2'}>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Название категории</div>
              <div className={'flex gap-4 mb-2'}>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Uz: </strong>
                  {selectedCategory.nameUz}
                </div>
                <div className={'flex-1'}>
                  <strong className={'text-gray-600'}>Ru: </strong>
                  {selectedCategory.nameUz}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        form={categoryForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevent form submission on "Enter"
          }
        }}
        name={'categoryForm'}
      >
        <h4 className="text-lg font-semibold mt-4">Название категории</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Наименование (уз) "
            className={'flex-1'}
            name={['nameUz']}
            rules={[{ required: true, message: 'Введите название!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Наименование (ru) "
            className={'flex-1'}
            name={['nameRu']}
            rules={[{ required: true, message: 'Введите название!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>
        </div>
        <div className="flex gap-4">
          {selectedCategory?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteCategory.mutate(selectedCategory.id)}
              color="amber"
              loading={onDeleteCategory.isPending}
              disabled={onDeleteCategory.isPending}
              className="mt-4 ml-3 bg-red-500 text-white"
            >
              Удалить
            </Button>
          )}
          <Form.Item>
            <Button
              form={'categoryForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateChannel?.isPending || createCategory.isPending}
              disabled={onUpdateChannel?.isPending || createCategory.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedCategory?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedCategory(undefined)}
            className="mt-4 bg-gray-500"
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  )
}
