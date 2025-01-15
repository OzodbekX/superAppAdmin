import React, { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input, Select } from 'antd'
import {
  createTariffCategory,
  deleteCategory,
  fetchTariffs,
  updateCategory,
} from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import UploadImage from '@/components/UploadImage/index.jsx'
import { pageOptionsCategory } from '@/data/common-variabeles.js'
import { cloneDeep } from 'lodash'

const EditCategoryForm = ({
  selectedCategory,
  onUpdateList,
  categories,
  resourceKeyList,
  setSelectedCategory,
}) => {
  const lang = userStore((state) => state.language)

  const { data: tariffList } = useQuery({
    queryKey: ['fetchTariffs'], // The query key depends on the page and pageSize
    queryFn: () => fetchTariffs({ offset: 0, limit: 100 }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const onUpdateCategory = useMutation({
    // Optional callbacks
    mutationFn: updateCategory,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'update')
    },
  })

  const onDeleteCategory = useMutation({
    // Optional callbacks
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      onUpdateList(selectedCategory, 'delete')
    },
  })

  const onAddCategory = useMutation({
    // Optional callbacks
    mutationFn: createTariffCategory,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })

  const [categoryForm] = Form.useForm()

  useEffect(() => {
    if (selectedCategory) {
      let newValue = cloneDeep(selectedCategory)
      newValue.anotherCategories = selectedCategory?.anotherCategories?.map((item) => item?.id)
      newValue.internetTariffs = selectedCategory?.internetTariffs?.map((item) => item?.id)
      categoryForm.setFieldsValue(newValue)
    }
  }, [selectedCategory])

  const onSubmit = () => {
    categoryForm.validateFields().then((values) => {
      values.internetTariffs = values?.internetTariffs?.map((item, index) => ({
        position: index,
        id: item,
      }))

      try {
        if (selectedCategory?.id) {
          onUpdateCategory.mutate({ id: selectedCategory.id, params: values })
        } else {
          onAddCategory.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className=" mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedCategory?.id && (
        <div className={'mb-2'}>
          <strong className={'mb-2 text-gray-600'}>Наименование</strong>
          <div className={'flex gap-4'}>
            <div className={'text-gray-600 flex-1'}>
              <strong>Uz:</strong> {selectedCategory?.name?.uz}
            </div>
            <div className={'text-gray-600 flex-1'}>
              <strong>Ru:</strong> {selectedCategory?.name?.ru}
            </div>
          </div>
          <strong className={'mb-2 text-gray-600'}>Описание</strong>
          <div className={'flex gap-4'}>
            <div className={'text-gray-600 flex-1'}>
              <strong>Uz:</strong> {selectedCategory?.description?.uz}
            </div>
            <div className={'text-gray-600 flex-1'}>
              <strong>Ru:</strong> {selectedCategory?.description?.ru}
            </div>
          </div>
        </div>
      )}
      <Form
        form={categoryForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // Prevents form submission on "Enter"
          }
        }}
        name={'categoryForm'}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-medium mt-4">Наименование</h4>
            <div className="flex gap-4  my-2">
              <Form.Item
                label="Наименование (уз) "
                className={'flex-1'}
                name={['name', 'uz']}
                rules={[{ required: true, message: 'Введите наименование!' }]}
              >
                <Input placeholder="Введите наименование" />
              </Form.Item>
              <Form.Item
                label="Наименование (ру) "
                className={'flex-1'}
                name={['name', 'ru']}
                rules={[{ required: true, message: 'Введите наименование!' }]}
              >
                <Input placeholder="Введите наименование" />
              </Form.Item>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium mt-4">Краткое описание</h4>
            <div className="flex gap-4  my-2">
              <Form.Item
                label="Краткое описание (уз) "
                className={'flex-1'}
                name={['shortDescription', 'uz']}
                rules={[{ required: true, message: 'Введите описание!' }]}
              >
                <Input placeholder="Введите наименование" />
              </Form.Item>
              <Form.Item
                label="Краткое описание (ру) "
                className={'flex-1'}
                name={['shortDescription', 'ru']}
                rules={[{ required: true, message: 'Введите описание!' }]}
              >
                <Input placeholder="Введите наименование" />
              </Form.Item>
            </div>
          </div>
        </div>
        <h4 className="text-lg font-medium">Описание</h4>
        <div className="flex gap-4  my-2">
          <Form.Item
            label="Описание (уз) "
            className={'flex-1'}
            name={['description', 'uz']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input.TextArea placeholder="Введите описание" />
          </Form.Item>
          <Form.Item
            label="Описание (ру) "
            className={'flex-1'}
            name={['description', 'ru']}
            rules={[{ required: true, message: 'Введите описание!' }]}
          >
            <Input.TextArea placeholder="Введите описание" />
          </Form.Item>
        </div>
        <h2 className={'text-lg font-medium'}>Связывание</h2>
        <div className="flex gap-4">
          <Form.Item
            label="Страница для категории"
            name="url"
            className={'flex-1'}
            rules={[{ required: true, message: 'Выберите страницу!' }]}
          >
            <Select
              options={pageOptionsCategory?.filter(
                (item) =>
                  !(resourceKeyList?.includes(item?.value) && item?.value !== selectedCategory?.url)
              )}
              placeholder="Выберите страницу!"
            />
          </Form.Item>
          <Form.Item label="Похожие категории" name="anotherCategories" className={'flex-1'}>
            <Select
              label="Выберите категорию"
              color="blue"
              size={'large'}
              mode={'multiple'}
              className={'w-1/4'}
            >
              {categories
                ?.filter((item) => selectedCategory.id !== item.id)
                ?.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item?.id}>
                      {item?.name?.[lang]}
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>
        </div>
        <div className="flex gap-4 w-1/2 pr-2">
          <Form.Item
            label="Связать тарифа"
            name="internetTariffs"
            className={'flex-1'}
            rules={[{ required: true, message: 'Выберите страницу!' }]}
          >
            <Select
              label="Выберите тариф"
              color="blue"
              mode={'multiple'}
              size={'large'}
              className={'w-1/4'}
            >
              {tariffList?.data?.map((item) => {
                return (
                  <Select.Option key={item.id} value={item?.id}>
                    {item?.name?.[lang]}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </div>

        <h4 className="text-lg font-medium">Изображения</h4>

        <div className="flex gap-4 mt-3">
          <div className={'flex-1 flex gap-4'}>
            <Form.Item
              name={['imageDesktop', 'uz']}
              className={'flex-1'}
              label="Изображения ПК (уз)"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['imageDesktop', 'uz']}
                form={categoryForm}
              />
            </Form.Item>
            <Form.Item
              name={['imageDesktop', 'ru']}
              className={'flex-1'}
              label="Изображения ПК (ру)"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['imageDesktop', 'ru']}
                form={categoryForm}
              />
            </Form.Item>
          </div>
          <div className={'flex-1 flex gap-4'}>
            <Form.Item
              name={['imageMobile', 'uz']}
              className={'flex-1'}
              label="Изображения телефон(уз)"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['imageMobile', 'uz']}
                form={categoryForm}
              />
            </Form.Item>
            <Form.Item
              name={['imageMobile', 'ru']}
              className={'flex-1'}
              label="Изображения телефон(ру)"
              rules={[{ message: 'Пожалуйста, загрузите изображение', required: true }]}
            >
              <UploadImage
                accept={'image/*,image/gif'}
                field={['imageMobile', 'ru']}
                form={categoryForm}
              />
            </Form.Item>
          </div>
          {/* Image Upload (ру) */}
        </div>

        <div className="flex">
          <Form.Item>
            <Button
              form={'categoryForm'}
              type="primary"
              htmlType={'submit'}
              disabled={onUpdateCategory?.isPending || onAddCategory.isPending}
              loading={onUpdateCategory?.isPending || onAddCategory.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedCategory?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedCategory(undefined)}
            color="amber"
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
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
        </div>
      </Form>
    </div>
  )
}

export default EditCategoryForm
