import React, { useRef } from 'react'
import { Button, DatePicker } from 'antd'
import chatAxiosInstance from '@/utils/api/chatApi.js'
import { apiUrls } from '@/utils/api/apiUrls.js'
import moment from 'moment'

const { RangePicker } = DatePicker

const FilterComponent = ({ setFilters, filters, setSelectedItem, selectedItem }) => {
  const rangePickerRef = useRef(null)
  const onChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates
      // Ensure `start` and `end` are Date objects
      const startDateObj = new Date(start)
      const endDateObj = new Date(end)
      endDateObj.setHours(23, 59, 59, 999)

      // Convert to ISO 8601 format
      const startDate = new Date(
        startDateObj.getTime() - startDateObj.getTimezoneOffset() * 60000
      ).toISOString()
      const endDate = new Date(
        endDateObj.getTime() - endDateObj.getTimezoneOffset() * 60000
      ).toISOString()

      // Update filters with startDate and endDate
      setFilters((prevFilters) => ({
        ...prevFilters,
        startDate,
        endDate,
      }))
    } else {
      // Clear filters if no dates are selected
      setFilters((prevFilters) => ({
        ...prevFilters,
        startDate: null,
        endDate: null,
      }))
    }
  }

  const downloadXLSFile = async () => {
    try {
      // Make the GET request to fetch the XLS file
      return chatAxiosInstance
        .get(apiUrls.downloadStats, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data])

          // Create a link element to trigger the download
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download =
            'Статистика ' +
            moment(filters.startDate).format('DD.MM.YYYY') +
            '-' +
            moment(filters.endDate).format('DD.MM.YYYY') +
            '.xls'

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

  return (
    <div className="mb-3 flex gap-4">
      <RangePicker
        onChange={onChange}
        allowClear={true}
        ref={rangePickerRef}

        // format="YYYY-MM-DD HH:mm"
        // showTime={{ format: 'HH:mm' }}
      />
      <Button onClick={downloadXLSFile} disabled={!filters?.startDate && !filters?.endDate}>
        Скачать
      </Button>
      {selectedItem && (
        <Button
          onClick={() => setSelectedItem(undefined)}
          disabled={!filters?.startDate && !filters?.endDate}
        >
          Назад
        </Button>
      )}
    </div>
  )
}

export default FilterComponent
