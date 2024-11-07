import React, { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { Badge, Button, Form, Input, Select } from 'antd'
import { useMutation } from '@tanstack/react-query'
import UploadImage from '@/components/UploadImage/index.jsx'
import { createBanner, deleteBanner, updateBanner } from '@/utils/api/functions.js'
import { Switch } from '@material-tailwind/react'
import { pageOptions } from '@/data/common-variabeles.js'
import { userStore } from '@/utils/zustand.js'

const { Option } = Select

export default function BannerForm({
  selectedBanner,
  resourceKeyList,
  onUpdateList,
  bannerTypes,
  setSelectedBanner,
}) {
  const [cardForm] = Form.useForm()
  const [isButtonEnabled, setIsButtonEnabled] = useState(false) // State to toggle "Кнопка" visibility
  const lang = userStore((state) => state.language)

  const onUpdateBanner = useMutation({
    mutationFn: updateBanner,
    onSuccess: (data) => {
      onUpdateList(data.data, 'update')
    },
  })

  const onDeleteBanner = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      onUpdateList(selectedBanner, 'delete')
    },
  })

  const onAddBanner = useMutation({
    mutationFn: createBanner,
    onSuccess: (data) => {
      onUpdateList(data, 'create')
    },
  })

  useEffect(() => {
    if (selectedBanner) {
      let newFormData = cloneDeep(selectedBanner)
      cardForm.setFieldsValue(newFormData)
      setIsButtonEnabled(!!selectedBanner.button) // Set initial switch state based on button data
    }
  }, [selectedBanner])

  const onSubmit = () => {
    cardForm.validateFields().then((values) => {
      try {
        if (isButtonEnabled) {
          values.button.position = Number(values.button.position)
        } else {
          values.button = null
        }
        if (selectedBanner?.id) {
          onUpdateBanner.mutate({ id: selectedBanner.id, params: values })
        } else {
          onAddBanner.mutate(values)
        }
      } catch {
        console.log('error')
      }
    })
  }

  return (
    <div className="mt-10 p-5 border rounded-3xl shadow-md bg-white">
      {selectedBanner?.id && (
        <div className="mb-2">
          <div className="mb-2 font-semibold text-gray-600">Основные данные</div>

          <div className="flex mb-2 gap-4">
            <div className="flex-1">
              <strong className="text-gray-600">Баннер для страницы: </strong>
              {pageOptions?.find((item) => item.value == selectedBanner.resourceKey)?.label}
            </div>
            <div className="flex-1">
              <strong className="text-gray-600">Тип: </strong>
              {bannerTypes?.find((item) => item.value == selectedBanner.type)?.label}
            </div>
          </div>
          {selectedBanner?.button && (
            <div className="flex mb-2 gap-4">
              <div className="flex-1">
                <strong className="text-gray-600">Кнопка: </strong>
                <Button className={'overflow-ellipsis'}>
                  {selectedBanner?.button?.text?.[lang]}
                </Button>
              </div>
              <div className="flex-1">
                <strong className="text-gray-600">Смещение от верха: </strong>
                {selectedBanner?.button?.position} px
              </div>
            </div>
          )}
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
        <h4 className="text-lg font-semibold mt-4">Основные данные</h4>
        <div className="flex gap-4">
          <Form.Item
            label="Баннер для страницы"
            className="flex-1"
            name="resourceKey"
            rules={[{ required: true, message: 'Выберите страницу!' }]}
          >
            <Select
              disabled={selectedBanner?.id}
              options={pageOptions?.filter(
                (item) =>
                  !(
                    resourceKeyList?.includes(item?.value) &&
                    item.value !== selectedBanner?.resourceKey
                  )
              )}
              placeholder="Выберите страницу!"
            />
          </Form.Item>
          <Form.Item
            label="Тип"
            className="flex-1"
            name="type"
            initialValue={'common'}
            rules={[{ required: true, message: 'Пожалуйста, выберите' }]}
          >
            <Select options={bannerTypes} />
          </Form.Item>
        </div>

        <div className="flex gap-4">
          <div className={'flex-1  flex gap-4'}>
            <Form.Item
              label="Цвет фона"
              name="backgroundColor"
              className={'w-80'}
              rules={[{ required: true, message: 'Введите цвет фона!' }]}
            >
              <Input placeholder="Введите цвет фона" />
            </Form.Item>
          </div>
          <div className={'flex-1 '}>
            <div className={'my-2'}>Добавить кнопку</div>
            <Switch
              checked={isButtonEnabled}
              onChange={(checked) => {
                setIsButtonEnabled(checked?.currentTarget?.checked)
              }}
            />
          </div>

          {/*<Form.Item name="link" label="Ссылка" className="flex-1">*/}
          {/*  <Input placeholder="Введите ссылку" />*/}
          {/*</Form.Item>*/}
        </div>
        {/* Кнопка Section */}
        {isButtonEnabled && (
          <div className="flex mt-4 gap-4">
            <h4 className="text-lg align-top flex-1 font-semibold ">Кнопка</h4>
          </div>
        )}

        {isButtonEnabled && (
          <>
            <div className="flex gap-4 my-1">
              {['uz', 'ru'].map((lang) => (
                <Form.Item
                  key={`button-text-${lang}`}
                  name={['button', 'text', lang]}
                  label={`Текст кнопки (${lang.toUpperCase()})`}
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: `Введите текст кнопки (${lang.toUpperCase()})`,
                    },
                  ]}
                >
                  <Input placeholder={`Введите текст кнопки (${lang.toUpperCase()})`} />
                </Form.Item>
              ))}
            </div>
            <div className="flex gap-4 my-1">
              <Form.Item
                name={['button', 'position']}
                label="Расстояние от верха баннера"
                className="flex-1"
                rules={[{ required: true, message: 'Введите позицию кнопки!' }]}
              >
                <Input placeholder="Введите позицию кнопки" />
              </Form.Item>
              {/*<Form.Item name={['button', 'link']} label="Ссылка кнопки" className="flex-1">*/}
              {/*  <Input placeholder="Введите ссылку кнопки" />*/}
              {/*</Form.Item>*/}
            </div>
          </>
        )}
        <h4 className="text-lg font-semibold mt-4">Изображения</h4>
        {['desktopImageUrl', 'mobileImageUrl'].map((imageType) => (
          <div key={imageType} className="mb-4">
            <div className="mb-2 font-semibold text-gray-600">
              {imageType === 'mobileImageUrl' ? 'Мобильное изображение' : 'Десктопное изображение'}
            </div>
            <div className="flex gap-4">
              {['uz', 'ru'].map((lang) => (
                <Form.Item
                  key={`${imageType}-${lang}`}
                  name={[imageType, lang]}
                  label={`${lang.toUpperCase()}`}
                  rules={[{ required: true, message: `Загрузите ${lang.toUpperCase()}` }]}
                  className="flex-1"
                >
                  <UploadImage
                    accept={'image/*,image/gif'}
                    field={[imageType, lang]}
                    form={cardForm}
                  />
                </Form.Item>
              ))}
            </div>
          </div>
        ))}

        <div className="flex">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={onUpdateBanner?.isPending || onAddBanner?.isPending}
              disabled={onUpdateBanner?.isPending || onAddBanner?.isPending}
              className="mt-4 bg-indigo-900"
              onClick={onSubmit}
            >
              {selectedBanner?.id ? 'Сохранять' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedBanner(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedBanner?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteBanner.mutate(selectedBanner.id)}
              loading={onDeleteBanner.isPending}
              disabled={onDeleteBanner.isPending}
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
