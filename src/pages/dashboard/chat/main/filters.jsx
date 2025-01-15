import React, { useEffect, useRef, useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import { useQuery } from '@tanstack/react-query'
import {
  fetchChatFAQsCategories,
  fetchChatOperators,
  getRateOptions,
  getRotFaqs,
  getSubFaqs,
} from '@/utils/api/functions.js'
import chatAxiosInstance from '@/utils/api/chatApi.js'
import { apiUrls } from '@/utils/api/apiUrls.js'

const { RangePicker } = DatePicker
const { Search } = Input

const FilterComponent = ({ setFilters }) => {
  const [form] = Form.useForm()
  const rangePickerRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({})

  const { data: categories } = useQuery({
    queryKey: ['fetchChatFAQsCategories'],
    queryFn: fetchChatFAQsCategories,

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: operators } = useQuery({
    queryKey: ['fetchChatOperators'],
    queryFn: fetchChatOperators,

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: rateOptions } = useQuery({
    queryKey: ['getRateOptions'],
    queryFn: getRateOptions,

    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: rootFaqs } = useQuery({
    queryKey: ['getRotFaqs', formData?.categoryId],
    queryFn: () => getRotFaqs(formData?.categoryId),

    retry: false,
    enabled: !!formData?.categoryId,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const { data: faqs } = useQuery({
    queryKey: ['getSubFaqs', formData?.categoryId, formData?.rootFaqId],
    queryFn: () => getSubFaqs(formData?.categoryId, formData?.rootFaqId),

    retry: false,
    enabled: !!formData?.categoryId && !!formData?.rootFaqId,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  const reformatFilters = (values) => {
    const { dateRange, ...restValues } = values
    // Initialize startDate and endDate as null
    let startDate = null
    let endDate = null

    // Process startDate if it exists
    if (dateRange?.[0]) {
      const startDateObj = new Date(dateRange[0])
      startDate = new Date(
        startDateObj.getTime() - startDateObj.getTimezoneOffset() * 60000
      )?.toISOString()
    }

    // Process endDate if it exists
    if (dateRange?.[1]) {
      const endDateObj = new Date(dateRange[1])
      endDateObj.setHours(23, 59, 59, 999) // Set to end of day
      endDate = new Date(
        endDateObj.getTime() - endDateObj.getTimezoneOffset() * 60000
      )?.toISOString()
    }
    let ratePatternIds = undefined
    // Process ratePatternIds if it exists
    if (values?.ratePatternIds?.length > 0) {
      ratePatternIds = values?.ratePatternIds?.join(',')
    }

    return {
      ...restValues,
      startDate,
      endDate,
      ratePatternIds,
    }
  }

  const handleSubmit = (values) => {
    const formattedFilter = reformatFilters(values)
    setFilters((prev) => ({ ...prev, ...formattedFilter, offset: 0 }))
  }

  const handleClear = () => {
    form.resetFields()
    setFilters({ isArchived: false, offset: 0 })
  }

  function onExpand(condition) {
    const elements = document.querySelectorAll('.adaptive-height')
    setIsExpanded(condition)
    elements.forEach((element) => {
      if (condition) {
        element.style.height = 'calc(100vh - 300px)'
      } else {
        element.style.height = 'calc(100vh - 200px)'
      }
    })
  }

  useEffect(() => {
    onExpand(isExpanded)
  }, [])

  const downloadXLSFile = async () => {
    try {
      const params = reformatFilters(form.getFieldsValue())
      // Make the GET request to fetch the XLS file
      return chatAxiosInstance
        .get(apiUrls.downloadStatsChat, { responseType: 'blob', params: params })
        .then((response) => {
          const blob = new Blob([response.data])

          // Create a link element to trigger the download
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'статистика чата.xls'

          // Append the link to the body (required for Firefox)
          document.body.appendChild(link)

          // Programmatically click the link to start the download
          link.click()

          // Clean up by removing the link
          document.body.removeChild(link)
        })

      // Create a Blob from the response data
    } catch (error) {
      console.error('Error downloading the XLS file:', error)
    }
  }

  const actionButtons = () => {
    return (
      <div className="flex gap-4 mt-auto mb-6">
        <Button className={'bg-blue-gray-50/50'} htmlType="submit">
          Отправить
        </Button>
        <Button htmlType="button" onClick={handleClear}>
          Очистить
        </Button>
        <Button onClick={() => onExpand(!isExpanded)} className={'bg-blue-gray-50/50'}>
          {isExpanded ? 'Закрыть фильтр' : 'Развернуть фильтр'}
        </Button>
        <Button onClick={downloadXLSFile}>Скачать чаты</Button>
      </div>
    )
  }

  const searchFilter = () => {
    return (
      <Form.Item name="searchText" label="Поиск контактов:" className="min-w-[250px]">
        <Search placeholder="Поиск контактов" enterButton={false} />
      </Form.Item>
    )
  }
  const timeFilter = () => {
    return (
      <Form.Item name="dateRange" label="Дата (от - до):" className="min-w-[150px]">
        <RangePicker
          // showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD"
          ref={rangePickerRef}
          className="w-full"
        />
      </Form.Item>
    )
  }
  const statusFilter = () => {
    return (
      <Form.Item name="isArchived" label="Статус:" className="min-w-[150px]" initialValue={false}>
        <Select className="w-full">
          <Select.Option value={false}>Активный</Select.Option>
          <Select.Option value={true}>В архиве</Select.Option>
        </Select>
      </Form.Item>
    )
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isArchived: false,
        minRate: null,
        maxRate: null,
      }}
      className="flex flex-wrap gap-x-4 align-bottom"
    >
      {isExpanded ? (
        <div className="flex flex-wrap gap-x-4 align-bottom">
          {/*<div className="text-lg font-semibold text-gray-800 p-4">*/}
          {/*  {filters?.isArchived ? 'Архив чатов' : 'Чаты'}*/}
          {/*</div>*/}
          {/* Search Filter */}
          {searchFilter()}
          {/* Date Range Filter */}
          {timeFilter()}
          {/* Status Filter */}
          {statusFilter()}
          {/* Category Filter */}
          <Form.Item name="archivedById" label="Оператор:" className="min-w-[150px]">
            <Select
              placeholder="Выберите опцию"
              className="w-full"
              allowClear={true}
              options={operators?.data}
              fieldNames={{ label: 'username', value: 'userId' }}
            />
          </Form.Item>
          <Form.Item name="categoryId" label="Категория:" className="min-w-[150px]">
            <Select
              placeholder="Выберите опцию"
              className="w-full"
              allowClear={true}
              onChange={(id) => {
                setFormData((prev) => ({
                  ...prev,
                  categoryId: id,
                  rootFaqId: undefined,
                  faqId: undefined,
                }))
                form.setFieldValue('categoryId', id)
                form.resetFields(['rootFaqId', 'faqId'])
              }}
              fieldNames={{ label: 'nameRu', value: 'id' }}
              options={categories?.data}
            />
          </Form.Item>
          <Form.Item name="rootFaqId" label="Подкатегория:" className="min-w-[300px] max-w-[400px]">
            <Select
              allowClear={true}
              disabled={!formData?.categoryId}
              onChange={(id) => {
                setFormData((prev) => ({ ...prev, rootFaqId: id, faqId: undefined }))
                form.setFieldValue('rootFaqId', id)
                form.resetFields(['faqId'])
              }}
              placeholder="Выберите опцию"
              className="w-full"
            >
              {rootFaqs?.map((rootFaq) => (
                <Select.Option
                  className={'whitespace-normal overflow-hidden break-words h-auto'}
                  key={rootFaq.id}
                  value={rootFaq.id}
                  style={{
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  {rootFaq.question}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="faqId"
            label="Часто задаваемые вопросы:"
            className="min-w-[300px] max-w-[400px]"
          >
            <Select
              allowClear={true}
              disabled={!formData?.rootFaqId}
              placeholder="Выберите опцию"
              className="w-full"
            >
              {faqs?.map((rootFaq) => (
                <Select.Option
                  className={'whitespace-normal overflow-hidden break-words h-auto'}
                  key={rootFaq.id}
                  value={rootFaq.id}
                  style={{
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  {rootFaq.question}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* Minimum Rate */}
          <Form.Item name="minRate" label="Минимальная оценка:" className="w-44">
            <InputNumber min={0} max={5} step={0.1} placeholder="От" className="w-full" />
          </Form.Item>
          {/* Maximum Rate */}
          <Form.Item name="maxRate" label="Максимальная оценка:" className="w-44">
            <InputNumber min={0} max={5} step={0.1} placeholder="До" className="w-full" />
          </Form.Item>
          <Form.Item
            name="ratePatternIds"
            label="Варианты оценки:"
            className="min-w-[300px] max-w-[400px]"
          >
            <Select
              allowClear={true}
              placeholder="Выберите опцию"
              className="w-full"
              mode={'multiple'}
            >
              {rateOptions?.map((rateOption) => (
                <Select.Option
                  className={'whitespace-normal overflow-hidden break-words h-auto'}
                  key={rateOption.id}
                  value={rateOption.id}
                  style={{
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  {rateOption.valueRu}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="platformType"
            label="Тип платформы:"
            className="min-w-[150px] max-w-[700px]"
          >
            <Select
              allowClear={true}
              placeholder="Выберите опцию"
              className="w-full"
              // mode={'multiple'}
              options={[
                {
                  value: 'MOBILE_IOS',
                  label: 'Мобильный ios',
                },
                {
                  value: 'MOBILE_ANDROID',
                  label: 'Мобильный андроид',
                },
                {
                  value: 'WEB',
                  label: 'Веб',
                },
                {
                  value: 'TELEGRAM_BOT',
                  label: 'Телеграм бот',
                },
                {
                  value: 'UNKNOWN',
                  label: 'Неизвестный',
                },
              ]}
            />
          </Form.Item>
          {actionButtons()}
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-4 align-bottom">
          {/*<div className="text-lg font-semibold text-gray-800 p-4">*/}
          {/*  {filters?.isArchived ? 'Архив чатов' : 'Чаты'}*/}
          {/*</div>*/}
          {/* Search Filter */}
          {searchFilter()}
          {/* Date Range Filter */}
          {timeFilter()}
          {/* Status Filter */}
          {statusFilter()}
          {actionButtons()}
        </div>
      )}
    </Form>
  )
}

export default FilterComponent
