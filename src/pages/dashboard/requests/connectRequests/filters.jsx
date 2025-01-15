import React, { useCallback, useState } from 'react'
import { Button, Form, Select } from 'antd'
import { cloneDeep, debounce } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { getDistricts, getRegions, getRegionTypes, getTicketCities } from '@/utils/api/functions.js'

const RequestFilters = ({ form, setFilters }) => {
  const [formData, setFormData] = useState({})

  const { data: cityList } = useQuery({
    queryKey: ['getTicketCities'], // The query key depends on the page and pageSize
    queryFn: () => getTicketCities({ offset: 0, limit: 1000 }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const { data: districts } = useQuery({
    queryKey: ['getDistricts', formData?.cityId], // The query key depends on the page and pageSize
    queryFn: () => getDistricts({ offset: 0, limit: 1000, cityId: formData?.cityId }), // Fetch the correct page
    retry: false,
    enabled: !!formData?.cityId,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: regionTypes } = useQuery({
    queryKey: ['getRegions'], // The query key depends on the page and pageSize
    queryFn: () => getRegionTypes({ offset: 0, limit: 1000 }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })
  const { data: regions } = useQuery({
    queryKey: ['getRegions'], // The query key depends on the page and pageSize
    queryFn: () =>
      getRegions({
        offset: 0,
        limit: 1000,
        type: formData?.residenceType,
        districtId: formData?.districtId,
      }), // Fetch the correct page
    retry: false,
    enabled: !!formData?.residenceType && !!formData?.districtId,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const updateFilters = useCallback(
    debounce((newFilters) => {
      setFilters((prev) => ({
        ...prev,
        offset: 0,
        page: 0,
        ...newFilters,
      }))
    }, 1000), // 1000ms debounce
    []
  )

  const handlePlatformTypeChange = (value) => {
    if (value?.length === 0) {
      setFilters((prev) => {
        let newValue = cloneDeep(prev)
        delete newValue.platformType
        newValue.offset = 0
        newValue.page = 0
        return newValue
      })
    } else {
      updateFilters({ platformType: value })
    }
  }

  const handleStatusChange = (value) => {
    if (value?.length === 0) {
      setFilters((prev) => {
        let newValue = cloneDeep(prev)
        delete newValue.status
        newValue.offset = 0
        newValue.page = 0
        return newValue
      })
    } else {
      updateFilters({ status: value })
    }
  }

  const handleCategoryChange = (value) => {
    if (value?.length === 0) {
      setFilters((prev) => {
        let newValue = cloneDeep(prev)
        delete newValue.category
        newValue.offset = 0
        newValue.page = 0
        return newValue
      })
    } else {
      updateFilters({ category: value })
    }
  }

  const handleCityChange = (value) => {
    form.setFieldsValue({ regionId: undefined, districtId: undefined }) // Reset dependent fields
    setFormData((prev) => ({
      ...prev,
      cityId: value,
      regionId: undefined,
      districtId: undefined,
    }))
  }

  const handleRegionChange = (value) => {
    form.setFieldsValue({ regionId: undefined }) // Reset dependent fields
    setFormData((prev) => ({
      ...prev,
      districtId: value,
      regionId: undefined,
    }))
  }

  const handleResidenceChange = (value) => {
    form.setFieldsValue({ regionId: undefined }) // Reset dependent field
    setFormData((prev) => ({
      ...prev,
      residenceType: value,
      regionId: undefined,
    }))
  }
  return (
    <Form
      form={form}
      onFinish={(values) => setFilters((prev) => ({ pageSize: 10, page: 0, ...values }))}
      layout={'vertical'}
      className={'flex gap-4 flex-wrap'}
    >
      <Form.Item label="Выберите платформу" name="platformType">
        <Select
          placeholder="Выберите платформу"
          className={'flex-1'}
          allowClear={true}
          onChange={handlePlatformTypeChange}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <Option value="ANDROID">Андроид</Option>
          <Option value="IOS">ИОС</Option>
          <Option value="WEBSITE">Веб-сайт</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Выберите статус" name="status">
        <Select
          placeholder="Выберите статус"
          className={'flex-1'}
          allowClear={true}
          onChange={handleStatusChange}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <Option value="PENDING">Новый</Option>
          <Option value="IN_PROGRESS">В ходе выполнения</Option>
          <Option value="COMPLETED">Завершенный</Option>
          <Option value="CANCELED">Отменено</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Выберите тип услуги" name="category">
        <Select
          placeholder="Выберите Тип услуги"
          className={'flex-1'}
          allowClear={true}
          onChange={handleCategoryChange}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <Option value="INTERNET">Интернет</Option>
          <Option value="REPAIR">Ремонт</Option>
          <Option value="INSTALLATION">Установка</Option>
          <Option value="OTHER">Другой</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Выберите город" name="cityId">
        <Select
          placeholder="Выберите город"
          className={'flex-1'}
          defaultValue={''}
          options={cityList}
          allowClear={true}
          onChange={handleCityChange}
          style={{ width: '100%', marginBottom: '10px' }}
          fieldNames={{ label: 'name', value: 'id' }}
        />
      </Form.Item>
      <Form.Item label="Выберите районы" name="districtId">
        <Select
          placeholder="Выберите районы"
          className={'flex-1'}
          defaultValue={''}
          options={districts}
          disabled={!formData?.cityId}
          allowClear={true}
          onChange={handleRegionChange}
          style={{ width: '100%', marginBottom: '10px' }}
          fieldNames={{ label: 'name', value: 'id' }}
        />
      </Form.Item>
      <Form.Item label="Выберите тип региона." name="regionType">
        <Select
          placeholder="Выберите тип региона."
          className={'flex-1'}
          defaultValue={''}
          options={regionTypes}
          allowClear={true}
          onChange={handleResidenceChange}
          style={{ width: '100%', marginBottom: '10px' }}
          fieldNames={{ label: 'name', value: 'type' }}
        />
      </Form.Item>
      <Form.Item label="Выберите регион" name="regionId">
        <Select
          placeholder="Выберите регион"
          className={'flex-1'}
          defaultValue={''}
          disabled={!formData?.residenceType || !formData?.districtId}
          options={regions}
          allowClear={true}
          style={{ width: '100%', marginBottom: '10px' }}
          fieldNames={{ label: 'name', value: 'id' }}
        />
      </Form.Item>

      <Form.Item>
        <Button
          onChange={() => setFilters({ pageSize: 10, page: 0 })}
          htmlType="reset"
          className={'mt-7'}
        >
          Сброс
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RequestFilters
