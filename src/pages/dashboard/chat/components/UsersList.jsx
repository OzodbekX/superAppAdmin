import React from 'react'
import { Avatar, Layout, List, Rate } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import moment from 'moment'

const { Sider } = Layout
const UsersList = ({ contacts = [], setFilters, selectedContact = {}, setSelectedContact }) => {
  // Function to check if scroll reached the bottom
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setFilters && setFilters((prev) => ({ ...prev, offset: contacts?.length }))
    }
  }

  return (
    <Sider width={'30%'} className="bg-white shadow-lg rounded-2xl flex-col adaptive-height">
      {/* Contact List */}
      <List
        total={contacts.length}
        className={'overflow-auto py-4 px-2 pl-4'}
        style={{ height: '100%', scrollbarWidth: 'thin' }}
        itemLayout="horizontal"
        dataSource={contacts} // Filtered contacts
        onScroll={handleScroll} // Detect scroll
        renderItem={(item) => (
          <List.Item
            onClick={() => {
              setSelectedContact(item)
            }}
            className={` hover:bg-blue-200 p-2 rounded-lg cursor-pointer overflow-auto ${
              selectedContact?.id === item.id && 'bg-gray-500 text-white'
            } hover:text-blue-400`}
          >
            <List.Item.Meta
              className={'px-2 hover:text-blue-400'}
              avatar={<Avatar size="large" icon={<UserCircleIcon />} />}
              title={
                <div className={` ${selectedContact?.id === item.id && 'text-white'}`}>
                  <div className="flex flex-wrap justify-between">
                    <div
                      className={`font-semibold overflow-hidden  line-clamp-1  flex-1${
                        selectedContact?.id === item.id && 'text-white'
                      }`}
                    >
                      {item?.user?.name || 'User'}
                    </div>
                    <div>
                      {item.lastMessage?.updatedAt &&
                        moment(item.lastMessage?.updatedAt)?.format('DD.MM.YYYY, HH:mm')}
                    </div>
                  </div>
                  {item?.archived && (
                    <div className="flex gap-2 mr-2 flex-1">
                      <Rate
                        value={item?.operatorRate?.rateValue || 0} // User rating in stars
                        disabled
                        style={{ fontSize: 16 }}
                      />
                    </div>
                  )}
                </div>
              }
              description={
                <div
                  className={`text-gray-500 line-clamp-1 ${
                    selectedContact?.id === item.id && 'text-white'
                  }`}
                >
                  <div> {item.lastMessage?.content}</div>
                </div>
              }
            />
            <div
              style={{ position: 'relative' }}
              className={`text-gray-400 mr-2 text-sm ${
                selectedContact?.id === item.id && 'text-white'
              }`}
            >
              {!item?.lastMessage?.isAutoRespondMessage &&
                item?.lastMessage?.sender?.role === 'USER' && (
                  <div
                    style={{
                      top: -10,
                      right: 0,
                      position: 'absolute',
                    }}
                    className={' rounded-xl bg-red-400  h-2 w-2'}
                  />
                )}
              {!item?.archived &&
                item.lastMessage?.updatedAt &&
                moment(item.lastMessage?.updatedAt)?.format('HH:mm')}
            </div>
          </List.Item>
        )}
      />
    </Sider>
  )
}

export default UsersList
