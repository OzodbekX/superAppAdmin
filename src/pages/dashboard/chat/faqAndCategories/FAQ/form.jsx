import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createChatFAQs,
  deleteChatFAQs,
  fetchChatFAQs,
  fetchChatFAQsCategories,
  updateChatFAQs,
} from '@/utils/api/functions.js'
import AddInModal from './addInModal.jsx'

export default function ChatFAQsForm({ selectedChatFAQs, onCancel, onAdd, onUpdate, onDelete }) {
  const [cardForm] = Form.useForm()
  const [offsetOptions, setOffsetOptions] = useState(0)
  const [openAddModal, setOpenModal] = useState(false)
  const [selectOptions, setSelectOptions] = useState([])
  const typeOptions = [
    {
      value: 'PASS_TO_FAQ', //bolasi
      label: 'Вопрос',
    },
    {
      value: 'PASS_TO_DEFAULT', //otasi
      label: 'Подкатегория',
    },
  ]
  const onUpdateChatFAQs = useMutation({
    mutationFn: updateChatFAQs,
    onSuccess: (data) => {
      onUpdate(data?.data)
    },
  })
  const { data: FAQCategories } = useQuery({
    queryKey: ['fetchChatFAQsCategories'], // The query key depends on the page and pageSize
    queryFn: fetchChatFAQsCategories, // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: initialSelectOptions } = useQuery({
    queryKey: ['fetchChatFAQs', offsetOptions], // The query key depends on the page and pageSize
    queryFn: () => fetchChatFAQs({ offset: offsetOptions, limit: 12 }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const onDeleteChatFAQs = useMutation({
    mutationFn: deleteChatFAQs,
    onSuccess: () => {
      onDelete(selectedChatFAQs)
    },
  })

  const onAddChatFAQs = useMutation({
    mutationFn: createChatFAQs,
    onSuccess: (data) => {
      onAdd(data?.data)
    },
  })

  const composeSelectOptions = (newList = []) => {
    setSelectOptions((prev) => {
      return [...prev, ...newList].filter(
        (item, index, array) => array.findIndex((i) => i.id === item.id) === index
      )
    })
  }

  useEffect(() => {
    composeSelectOptions(initialSelectOptions?.data)
  }, [initialSelectOptions?.data])

  useEffect(() => {
    if (selectedChatFAQs) {
      let newFormValue = selectedChatFAQs
      if (newFormValue?.categories) {
        newFormValue = {
          ...newFormValue,
          categoryIds: newFormValue?.categories?.map((item) => item?.id),
          childrenIds: newFormValue?.children?.map((item) => item?.id),
        }
      }
      composeSelectOptions(newFormValue?.children)

      cardForm.setFieldsValue(newFormValue)
    }
  }, [selectedChatFAQs])
  useEffect(() => {}, [openAddModal])

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      values.position = Number(values.position)
      // values.parentIds = []
      // delete values.categoryIds
      try {
        if (selectedChatFAQs?.id) {
          onUpdateChatFAQs.mutate({ id: selectedChatFAQs.id, ...values })
        } else {
          onAddChatFAQs.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  const onPopupScroll = (e) => {
    const target = e?.target
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 40) {
      setOffsetOptions(selectOptions?.length)
    }
  }
  const onAddChild = (data) => {
    setSelectOptions((prev) => [data, ...prev])
    setOpenModal(false)
  }

  return (
    <div className="mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedChatFAQs?.id && (
        <div className="mb-4 p-3 border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Текущие данные FAQ</h4>
          <div className="text-gray-600">
            <div className="mb-2 flex gap-4">
              <div className={'flex-1'}>
                <strong>Вопрос (уз):</strong> {selectedChatFAQs.questionUz}
              </div>
              <div className={'flex-1'}>
                <strong>Вопрос (ру):</strong> {selectedChatFAQs.questionRu}
              </div>
              <br />
            </div>
            <div className="mb-2 flex gap-4">
              <div className={'flex-1'}>
                <strong>Ответ (уз):</strong> {selectedChatFAQs.answerUz}
              </div>
              <div className={'flex-1'}>
                <strong>Ответ (ру):</strong> {selectedChatFAQs.answerRu}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mb-2 flex-1">
                <strong>Тип:</strong>
                {typeOptions?.find((item) => item?.value === selectedChatFAQs?.type)?.label}
              </div>
              <div className="mb-2 flex-1">
                <strong>Позиция:</strong> {selectedChatFAQs.position}
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
            e.preventDefault()
          }
        }}
        name="cardForm"
      >
        <h4 className="text-lg font-semibold mt-4">Вопрос</h4>
        <div className="flex gap-4">
          <Form.Item
            label="Вопрос (уз)"
            className="flex-1"
            name={['questionUz']}
            rules={[{ required: true, message: 'Введите вопрос на узбекском' }]}
          >
            <Input placeholder="Введите вопрос на узбекском" />
          </Form.Item>
          <Form.Item
            label="Вопрос (ру)"
            className="flex-1"
            name={['questionRu']}
            rules={[{ required: true, message: 'Введите вопрос на русском' }]}
          >
            <Input placeholder="Введите вопрос на русском" />
          </Form.Item>
        </div>

        <h4 className="text-lg font-semibold mt-4">Дополнительные настройки</h4>
        <div className="flex gap-4">
          <Form.Item
            className="flex-1"
            label="Позиция"
            name="position"
            rules={[{ required: true, message: 'Введите позицию' }]}
          >
            <Input placeholder="Введите позицию" />
          </Form.Item>
          <Form.Item
            label="Тип"
            className="flex-1"
            name="type"
            initialValue={'PASS_TO_DEFAULT'}
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select options={typeOptions} placeholder="Выберите категорию" />
          </Form.Item>
        </div>

        <div className="flex gap-4">
          <Form.Item
            label="Категория часто задаваемых вопросов"
            className="flex-1"
            name="categoryIds"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select
              mode={'multiple'}
              options={FAQCategories?.data}
              fieldNames={{ label: 'nameRu', value: 'id' }}
              placeholder="Выберите категорию"
            />
          </Form.Item>
          <Form.Item
            label="Следующий шаг часто задаваемые вопросы"
            className="flex-1"
            name="childrenIds"
            // rules={[{ required: true, message: 'Выберите часто задаваемые вопросы' }]}
          >
            <Select
              mode={'multiple'}
              onPopupScroll={onPopupScroll}
              options={selectOptions?.filter((i) => i.id !== selectedChatFAQs.id)}
              fieldNames={{ label: 'questionRu', value: 'id' }}
              placeholder="Выберите часто задаваемые вопросы"
            />
          </Form.Item>
        </div>
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
          {({ getFieldValue }) =>
            getFieldValue('type') === 'PASS_TO_FAQ' && (
              <div>
                <h4 className="text-lg font-semibold">Ответ</h4>
                <div className="flex gap-4">
                  <Form.Item
                    label="Ответ (уз)"
                    className="flex-1"
                    name={['answerUz']}
                    rules={[{ required: true, message: 'Введите ответ на узбекском' }]}
                  >
                    <Input.TextArea placeholder="Введите ответ на узбекском" />
                  </Form.Item>
                  <Form.Item
                    label="Ответ (ру)"
                    className="flex-1"
                    name={['answerRu']}
                    rules={[{ required: true, message: 'Введите ответ на русском' }]}
                  >
                    <Input.TextArea placeholder="Введите ответ на русском" />
                  </Form.Item>
                </div>
              </div>
            )
          }
        </Form.Item>

        <div className="flex">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={onUpdateChatFAQs.isLoading || onAddChatFAQs.isLoading}
              disabled={onUpdateChatFAQs.isLoading || onAddChatFAQs.isLoading}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedChatFAQs?.id ? 'Сохранить' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button type="reset" onClick={() => setOpenModal(true)} className="mt-4 ml-3 bg-gray-500">
            Добавить новый FAQ
          </Button>
          <Button type="reset" onClick={onCancel} className="mt-4 ml-3 bg-gray-500">
            Отмена
          </Button>
          {selectedChatFAQs?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteChatFAQs.mutate(selectedChatFAQs.id)}
              loading={onDeleteChatFAQs.isLoading}
              disabled={onDeleteChatFAQs.isLoading}
              className="mt-4 ml-3 bg-red-500 text-white"
            >
              Удалить
            </Button>
          )}
        </div>
      </Form>
      <AddInModal
        setOpenModal={setOpenModal}
        onAdd={onAddChild}
        visible={openAddModal}
        FAQCategories={FAQCategories}
        typeOptions={typeOptions}
      />
    </div>
  )
}
