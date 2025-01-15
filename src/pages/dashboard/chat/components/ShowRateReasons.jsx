import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRateById } from '@/utils/api/functions.js'
import { Collapse, Rate, Tooltip } from 'antd'

const ShowRateReasons = ({ selectedContact, isInToolTip }) => {
  const { data } = useQuery({
    queryKey: ['getRateById', selectedContact?.operatorRate?.reasons, selectedContact?.archived],
    queryFn: () => getRateById(selectedContact?.operatorRate?.reasons), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    enabled: selectedContact?.archived && selectedContact?.operatorRate?.reasons?.length > 0,
    placeholderData: [],
  })

  const writeContent = () => {
    return (
      <ul className={'h-auto'}>
        {data?.map((item, index) => (
          <li className={'text-blue-400'} key={index}>
            {index + 1}. {item.value}
          </li>
        ))}
      </ul>
    )
  }

  const panelStyle = {
    background: '#F5F6FA',
    borderRadius: 8,
    border: 'none',
    padding: 0,
    margin: 0,
  }

  const headerStyle = {
    fontSize: 16,
  }
  const collapseItems = useMemo(() => {
    return [
      {
        key: selectedContact?.id?.toString(),
        label: (
          <Rate
            style={headerStyle}
            value={selectedContact?.operatorRate?.rateValue || 0} // User rating in stars
            disabled
          />
        ),
        children: (
          <div className="flex-col" style={{ height: 'min-content' }}>
            <div>
              <span className={'mr-2 text-xl'}>отзыв:</span>
              {selectedContact?.operatorRate?.comment}
            </div>
            {writeContent()}
          </div>
        ),
        style: panelStyle,
      },
    ]
  }, [selectedContact])

  if (data?.length) {
    if (isInToolTip) {
      return (
        <Tooltip
          title={
            <div className="flex-col mb-4" style={{ height: 'min-content' }}>
              <div>{selectedContact?.operatorRate?.comment}</div>
              {writeContent()}
            </div>
          }
        >
          <Rate
            value={selectedContact?.operatorRate?.rateValue || 0} // User rating in stars
            disabled
            style={{ fontSize: 16, marginLeft: '10px' }}
          />
        </Tooltip>
      )
    } else {
      const handleCollapseClick = (e) => {
        // Prevent parent click event from firing
        e.stopPropagation()
      }
      return (
        <Collapse
          items={collapseItems}
          bordered={false}
          expandIconPosition={'right'}
          style={{ background: 'transparent', padding: 0 }}
          onClick={handleCollapseClick} // Prevent parent click from firing
        />
      )
    }
  } else return null
}

export default ShowRateReasons
