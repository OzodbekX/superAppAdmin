import React from 'react'
import { Button, Form, Input, Modal, Select } from 'antd'
import { createChatFAQs } from '@/utils/api/functions.js'
import { useMutation } from '@tanstack/react-query'

const AddInModal = ({ setOpenModal, onAdd, visible, FAQCategories, typeOptions }) => {
  const [cardForm] = Form.useForm()
  const onAddChatFAQs = useMutation({
    mutationFn: createChatFAQs,
    onSuccess: (data) => {
      onAdd(data?.data)
    },
  })
  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      values.position = Number(values.position)
      // values.parentIds = []
      // delete values.categoryIds
      try {
        onAddChatFAQs.mutate(values)
      } catch {
        console.log('error')
      }
    })
  }
  return (
    <Modal open={visible} footer={null} width={'1500px'} onCancel={() => setOpenModal(false)}>
      <div className="bg-white">
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
                loading={onAddChatFAQs.isLoading}
                disabled={onAddChatFAQs.isLoading}
                className="mt-4 bg-indigo-900"
                onClick={onSubmit}
              >
                Добавить
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="reset"
                type="reset"
                onClick={() => setOpenModal(false)}
                className="mt-4 ml-3 bg-gray-500"
              >
                Отмена
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default AddInModal
