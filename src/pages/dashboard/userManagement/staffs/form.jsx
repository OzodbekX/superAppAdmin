import React, { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { Badge, Button, Form, Input, Select, Spin, Switch } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createStaffs, deleteStaffs, fetchRoles, updateStaffs } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import UploadImage from '@/components/UploadImage/index.jsx'

export default function StaffForm({ selectedStaff, onUpdateList, setSelectedStaff }) {
  const [staffForm] = Form.useForm()
  const lang = userStore((state) => state.language)
  const [options, setOptions] = useState([])
  const [filter, setFilter] = useState({ offset: 0 })
  const { data: roleOptions, isFetching } = useQuery({
    queryKey: ['fetchRoles', filter], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchRoles({
        offset: filter.offset,
        limit: 20,
      }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
  })

  const onUpdateStaff = useMutation({
    mutationFn: updateStaffs,
    onSuccess: (data) => {
      onUpdateList(data.data, 'update')
    },
  })

  const onDeleteStaff = useMutation({
    mutationFn: deleteStaffs,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'delete')
    },
  })

  const onAddStaff = useMutation({
    mutationFn: createStaffs,
    onSuccess: (data) => {
      onUpdateList(data?.data, 'create')
    },
  })
  // Function to add new item
  const addItemToOptions = (newItems = []) => {
    setOptions((prevList) => {
      const validNewItems = newItems.filter((item) => !!item?.id?.length)
      if (validNewItems.length > 0) {
        const existingIds = new Set(prevList.map((item) => item.id))

        // Filter out new items that already exist in the list
        const filteredItems = newItems?.filter((item) => !existingIds.has(item.id))
        return [...prevList, ...filteredItems]
      } else return prevList
    })
  }

  useEffect(() => {
    if (selectedStaff) {
      let newFormData = cloneDeep(selectedStaff)
      newFormData.roleId = selectedStaff?.role?.id
      staffForm.setFieldsValue(newFormData)
      addItemToOptions([selectedStaff?.role] || [])
    }
  }, [selectedStaff])

  const onSubmit = () => {
    staffForm.validateFields().then((values) => {
      if (selectedStaff?.id) {
        onUpdateStaff.mutate({ id: selectedStaff.id, params: values })
      } else {
        onAddStaff.mutate(values)
      }
    })
  }

  // Simulate an API call
  const fetchOptions = () => {
    setFilter({ offset: options?.length })
  }

  const handleScroll = (e) => {
    const { target } = e
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchOptions(filter.offset)
    }
  }

  useEffect(() => {
    const list = roleOptions?.data || []
    addItemToOptions(list)
  }, [roleOptions])

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      {selectedStaff?.id && (
        <div className="mb-2">
          <div className="flex mb-4 gap-4">
            <div className="flex-1">
              {/* User Name */}
              <div className="mb-2 font-semibold text-gray-600">Информация о пользователе</div>
              <div className="flex gap-4 mb-2">
                <div className="flex-1">
                  <strong className="text-gray-600">Имя: </strong>
                  {selectedStaff?.firstName || 'Не указано'}
                </div>
                <div className="flex-1">
                  <strong className="text-gray-600">Фамилия: </strong>
                  {selectedStaff?.lastName || 'Не указано'}
                </div>
              </div>

              {/* Login Details */}
              <div className="flex gap-4 ">
                <div className="flex-1 mb-2">
                  <strong className="text-gray-600">Логин: </strong>
                  {selectedStaff?.login || 'Не указано'}
                </div>
                <div className=" flex-1 mb-2">
                  <strong className="text-gray-600">Никнейм: </strong>
                  {selectedStaff?.nickname || 'Не указано'}
                </div>
              </div>
              {/* Contact Details */}
              <div className="flex gap-4">
                <div className="flex-1 mb-2">
                  <strong className="text-gray-600">Номер телефона: </strong>
                  {selectedStaff?.phoneNumber || 'Не указано'}
                </div>

                {/* Status */}
                <div className="flex-1 mb-2">
                  <strong className="text-gray-600">Активен: </strong>
                  <Badge
                    key={selectedStaff?.id}
                    showZero
                    color={selectedStaff?.isActive ? '#52c41a' : '#faad14'}
                    count={selectedStaff?.isActive ? 'Да' : 'Нет'}
                  />
                </div>
              </div>

              {/* Role Information */}
              <div className="mb-2 font-semibold text-gray-600">Информация о роли</div>
              <div className="flex gap-4">
                <div className="flex-1 mb-2">
                  <strong className="text-gray-600">Название роли: </strong>
                  {selectedStaff?.role?.name?.[lang] || 'Не указано'}
                </div>
                <div className="flex-1 mb-2">
                  <strong className="text-gray-600">Роль активна: </strong>
                  <Badge
                    key={selectedStaff?.id}
                    showZero
                    color={selectedStaff?.role?.isActive ? '#52c41a' : '#faad14'}
                    count={selectedStaff?.role?.isActive ? 'Да' : 'Нет'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Form
        form={staffForm}
        layout="vertical"
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
        name={'staffForm'}
      >
        {/* First Name and Last Name */}
        <h4 className="text-lg font-semibold mt-4">Основные данные</h4>
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Имя"
            className="flex-1"
            name="firstName"
            rules={[{ required: true, message: 'Введите имя!' }]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            className="flex-1"
            name="lastName"
            rules={[{ required: true, message: 'Введите фамилию!' }]}
          >
            <Input placeholder="Введите фамилию" />
          </Form.Item>
        </div>

        {/* Nickname and Login */}
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Никнейм"
            className="flex-1"
            name="nickname"
            rules={[{ required: true, message: 'Введите никнейм!' }]}
          >
            <Input placeholder="Введите никнейм" />
          </Form.Item>
          <Form.Item
            label="Телефонный номер"
            className="flex-1"
            name="phoneNumber"
            rules={[{ required: true, message: 'Введите номер телефона!' }]}
          >
            <Input placeholder="Введите номер телефона" />
          </Form.Item>
        </div>

        {/* Phone Number and Password */}
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Логин"
            className="flex-1"
            name="login"
            rules={[{ required: true, message: 'Введите логин!' }]}
          >
            <Input placeholder="Введите логин" />
          </Form.Item>

          {!selectedStaff?.id && (
            <Form.Item
              label="Пароль"
              className="flex-1"
              name="password"
              rules={[{ required: true, message: 'Введите пароль!' }]}
            >
              <Input.Password placeholder="Введите пароль" />
            </Form.Item>
          )}
        </div>

        {/* Role and Active */}
        <div className="flex gap-4 my-1">
          <Form.Item
            label="Роль ID"
            className="flex-1"
            name="roleId"
            rules={[{ required: true, message: 'Введите ID роли!' }]}
          >
            <Select
              showSearch
              placeholder="Введите роли"
              style={{ width: 300 }}
              onPopupScroll={handleScroll}
              loading={isFetching}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  {isFetching && (
                    <div style={{ textAlign: 'center', padding: 8 }}>
                      <Spin />
                    </div>
                  )}
                </>
              )}
            >
              {options?.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name?.[lang]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="flex-1" label="Активный" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        {/* Image Section */}
        <div className="flex gap-4 my-1">
          <Form.Item
            name={['photo']}
            className={'flex-1'}
            label="Фотография"
            rules={[{ required: true, message: 'Пожалуйста, загрузите фотографию!' }]}
          >
            <UploadImage la accept={'image/*,image/gif'} field={['photo']} form={staffForm} />
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <div className="flex">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onSubmit}
              className="mt-4 bg-indigo-900"
            >
              {selectedStaff?.id ? 'Сохранить' : 'Добавить'}
            </Button>
          </Form.Item>
          <Button
            type="reset"
            onClick={() => setSelectedStaff(undefined)}
            className="mt-4 ml-3 bg-gray-500"
          >
            Отмена
          </Button>
          {selectedStaff?.id && (
            <Button
              type="reset"
              onClick={() => onDeleteStaff.mutate(selectedStaff.id)}
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
