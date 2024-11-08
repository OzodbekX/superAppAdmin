import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Button, Form, Input } from 'antd'
import { useMutation } from '@tanstack/react-query'
import UploadImage from '@/components/UploadImage/index.jsx'
import { createNavigationCards, deleteCards, updateNavigationCards } from '@/utils/api/functions.js'

export default function CardsForm({ selectedCards, setFilters, setSelectedCards }) {
  const [cardForm] = Form.useForm()

  const onUpdateCards = useMutation({
    // Optional callbacks
    mutationFn: updateNavigationCards,
    onSuccess: (data) => {
      setSelectedCards(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  const onDeleteCards = useMutation({
    // Optional callbacks
    mutationFn: deleteCards,
    onSuccess: (data) => {
      setSelectedCards(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  const onAddCards = useMutation({
    // Optional callbacks
    mutationFn: createNavigationCards,
    onSuccess: (data) => {
      setSelectedCards(undefined)
      setFilters((prev) => ({ ...prev, reNew: prev.reNew + 1 }))
    },
  })

  useEffect(() => {
    if (selectedCards) {
      let newFormData = cloneDeep(selectedCards)
      cardForm.setFieldsValue(newFormData)
    }
  }, [selectedCards])

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      try {
        if (selectedCards?.id) {
          onUpdateCards.mutate({ id: selectedCards.id, params: values })
        } else {
          onAddCards.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedCards?.id && (
        <div className={'mb-2'}>
          <div className="flex mb-2 gap-4">
            <div className={'flex-1'}>
              <div className={'mb-2 font-semibold text-gray-600'}>Наименование</div>
              <div>
                <div>
                  <strong className={'text-gray-600'}>Uz: </strong>
                  {selectedCards.title?.uz}
                </div>
                <div>
                  <strong className={'text-gray-600'}>Ru: </strong>
                  {selectedCards.title?.ru}
                </div>
              </div>
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
        <h4 className="text-lg font-semibold mt-4">Наименование</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="Наименование (уз) "
            className={'flex-1'}
            name={['title', 'uz']}
            rules={[{ required: true, message: 'Введите имя!' }]}
          >
            <Input placeholder="Введите имя уз" />
          </Form.Item>
          <Form.Item
            label="Наименование (ру) "
            className={'flex-1'}
            name={['title', 'ru']}
            rules={[{ required: true, message: 'Введите имя!' }]}
          >
            <Input placeholder="Введите имя ру" />
          </Form.Item>
        </div>
        <h4 className="text-lg font-semibold mt-4">URL-адрес</h4>
        <div className="flex gap-4  my-1">
          <Form.Item
            label="URL-адрес"
            className={'flex-1'}
            name={'url'}
            rules={[{ required: true, message: 'Введите URL-адрес!' }]}
          >
            <Input placeholder="Введите URL-адрес" />
          </Form.Item>
        </div>
        <div className={'text-2xl font-semibold mt-2'}>Изображение</div>
        <div className="flex mt-3">
          <Form.Item
            name={['image', 'uz']}
            className={'flex-1'}
            label="Изображение (уз)"
            rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
          >
            <UploadImage accept={'image/*,image/gif'} field={['image', 'uz']} form={cardForm} />
          </Form.Item>
          <Form.Item name={['image', 'ru']} className={'flex-1'} label="Изображение (ру)">
            <UploadImage accept={'image/*,image/gif'} field={['image', 'ru']} form={cardForm} />
          </Form.Item>
        </div>
        <div className="flex">
          <Form.Item>
            <Button
              form={'cardForm'}
              type="primary"
              htmlType={'submit'}
              loading={onUpdateCards?.isPending || onAddCards?.isPending}
              disabled={onUpdateCards?.isPending || onAddCards?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedCards?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedCards(undefined)}
            color="amber"
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedCards?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteCards.mutate(selectedCards.id)}
              color="amber"
              loading={onDeleteCards.isPending}
              disabled={onDeleteCards.isPending}
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
