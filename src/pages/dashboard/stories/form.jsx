import React, { useEffect } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import UploadImage from '@/components/UploadImage/index.jsx'
import { useMutation } from '@tanstack/react-query'
import { createStories, deleteStories, updateStories } from '@/utils/api/functions.js'

const { Option } = Select
const StoryForm = ({ setSelectedStory, onUpdateList, selectedStory }) => {
  const onUpdateStory = useMutation({
    // Optional callbacks
    mutationFn: updateStories,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'update')
    },
  })

  const addStory = useMutation({
    // Optional callbacks
    mutationFn: createStories,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  const onDeleteStories = useMutation({
    // Optional callbacks
    mutationFn: deleteStories,
    onSuccess: (data) => {
      onUpdateList(selectedStory, 'delete')
    },
  })
  const [storyForm] = Form.useForm()

  useEffect(() => {
    if (selectedStory) {
      storyForm.setFieldsValue(selectedStory)
    }
  }, [selectedStory])

  const handleFinish = (values) => {
    storyForm.validateFields().then((values) => {
      values.types = ['SUPERAPP']
      try {
        if (selectedStory?.id) {
          onUpdateStory.mutate({ id: selectedStory.id, params: values })
        } else {
          addStory.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <Form
      form={storyForm}
      className={'bg-white rounded-3xl p-4'}
      name={'story-form'}
      layout="vertical"
    >
      <h4 className="text-lg font-medium mb-2">Форма Истории</h4>
      <div className="flex gap-4">
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
        <div className={'flex-1'} />
      </div>
      <h4 className="text-lg font-medium mb-2">Предварительный просмотр изображения</h4>

      <div className="flex gap-4">
        <Form.Item
          rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
          name={['image', 'uz']}
          className={'flex-1'}
          label="URL Изображения (UZ)"
        >
          <UploadImage accept={'image/*,image/gif'} field={['image', 'uz']} form={storyForm} />
        </Form.Item>
        <Form.Item
          rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
          name={['image', 'ru']}
          className={'flex-1'}
          label="URL Изображения (РУ)"
        >
          <UploadImage accept={'image/*,image/gif'} field={['image', 'ru']} form={storyForm} />
        </Form.Item>
      </div>

      <Form.List name="slides" initialValue={[]}>
        {(fields, { add, remove }) => (
          <div>
            {fields.map(({ key, name }) => (
              <div key={key}>
                <div className={'flex justify-between align-middle mb-3'}>
                  <h4 className="text-lg font-medium mb-2">Слайд {key + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="danger"
                      className={'bg-gray-500'}
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                    >
                      Удалить Слайд
                    </Button>
                  )}
                </div>

                <div className="flex gap-4">
                  <Form.Item
                    name={[name, 'type']}
                    label="Тип"
                    className={'flex-1'}
                    rules={[{ message: 'Пожалуйста, выберите', required: true }]}
                    initialValue="IMAGE"
                  >
                    <Select>
                      <Option value="IMAGE">Изображение</Option>
                      <Option value="VIDEO">Видео</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={[name, 'clickableArea']}
                    className={'flex-1'}
                    label="Кликабельная Область"
                    rules={[{ message: 'Пожалуйста, выберите', required: true }]}
                    initialValue="TOP"
                  >
                    <Select>
                      <Option value="TOP">Верх</Option>
                      <Option value="MIDDLE">Середина</Option>
                      <Option value="BOTTOM">Низ</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="flex gap-4">
                  <Form.Item
                    label="Статус"
                    name={[name, 'isActive']}
                    className={'flex-1'}
                    rules={[{ message: 'Пожалуйста, выберите', required: true }]}
                    initialValue={true}
                  >
                    <Select>
                      <Option value={true}>Активный</Option>
                      <Option value={false}>Неактивный</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    className={'flex-1'}
                    name={[name, 'position']}
                    label="Позиция"
                    initialValue={key + 1}
                    rules={[{ message: 'Пожалуйста, введите число', required: true }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </div>

                <Form.Item
                  className={'mb-0'}
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.slides?.[name]?.type !== currentValues.slides?.[name]?.type
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(['slides', name, 'type']) === 'IMAGE' && (
                      <div className="flex gap-4">
                        <Form.Item
                          name={[name, 'file', 'uz']}
                          className={'flex-1'}
                          rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
                          label="URL Изображения (UZ)"
                        >
                          <UploadImage
                            accept={'image/*,image/gif'}
                            field={['slides', name, 'file', 'uz']}
                            form={storyForm}
                          />
                        </Form.Item>
                        <Form.Item
                          name={[name, 'file', 'ru']}
                          className={'flex-1'}
                          rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
                          label="URL Изображения (RU)"
                        >
                          <UploadImage
                            accept={'image/*,image/gif'}
                            field={['slides', name, 'file', 'ru']}
                            form={storyForm}
                          />
                        </Form.Item>
                      </div>
                    )
                  }
                </Form.Item>

                {/* Video Fields (if type is video) */}

                <Form.Item
                  style={{ width: '100%' }}
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.slides?.[name]?.type !== currentValues.slides?.[name]?.type
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(['slides', name, 'type']) === 'video' && (
                      <div style={{ width: '100%' }}>
                        <h4 className="text-lg font-medium mb-2">Видео</h4>

                        <Form.Item
                          name={[name, 'duration']}
                          label="Длительность (в секундах)"
                          initialValue={3}
                          style={{ width: 200 }}
                          className={'flex-1 hidden'}
                        >
                          <Input type="number" />
                        </Form.Item>
                        <div className="flex gap-4" style={{ width: '100%' }}>
                          <Form.Item label="Видео (UZ)" className={'flex-1'}>
                            <UploadImage
                              field={['slides', name, 'file', 'uz']}
                              accept={'video/*'}
                              form={storyForm}
                            />
                          </Form.Item>
                          <Form.Item label="Видео (RU)" className={'flex-1'}>
                            <UploadImage
                              field={['slides', name, 'file', 'ru']}
                              accept={'video/*'}
                              form={storyForm}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    )
                  }
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <Button
                className={'bg-black text-white'}
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Добавить Слайд
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>

      <div className="flex gap-4">
        <Form.Item>
          <Button className={'bg-green-500'} onClick={handleFinish} htmlType="submit">
            {selectedStory?.id ? 'Сохранять' : 'Добавить'}
          </Button>
        </Form.Item>
        <Button
          type="reset"
          onClick={() => setSelectedStory(undefined)}
          color="amber"
          className=" bg-gray-500"
        >
          Отмена
        </Button>
        {selectedStory?.id && (
          <Form.Item>
            <Button
              className={'bg-red-500 text-white'}
              onClick={() => onDeleteStories.mutate(selectedStory.id)}
              htmlType="reset"
            >
              Удалить
            </Button>
          </Form.Item>
        )}
      </div>
    </Form>
  )
}

export default StoryForm
