import React from 'react'
import { Avatar, Input, Layout, List } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import moment from 'moment'
import { debounce } from 'lodash'
import { userStore } from '@/utils/zustand.js'

const { Sider } = Layout
const { Search } = Input
const UsersList = ({
                     contacts = [],
                     setSearchQuery,
                     setContactList,
                     setOffSet,
                     selectedContact = [],
                     setSelectedContact,
                   }) => {
  // Function to check if scroll reached the bottom
  const { userName } = userStore((state) => state)

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setOffSet(contacts?.length)
    }
  }

  const updateFilters = debounce((e) => {
    setSearchQuery(e.target.value)
    setOffSet(0)
    setContactList([])
  }, 1000) // 1000ms debounce

  return (
      <Sider
          width={300}
          style={{ height: 'calc(100vh - 200px)' }}
          className="bg-white shadow-lg rounded-2xl flex-col"
      >
        <div className="text-lg font-semibold text-gray-800 p-4">Chats</div>

        {/* Search Input */}
        <Search
            placeholder="Поиск контактов"
            enterButton={false}
            onChange={updateFilters}
            className="mb-4 px-4"
        />

        {/* Contact List */}
        <List
            total={contacts.length}
            className={'overflow-auto py-4 px-2 pl-4'}
            style={{ height: 'calc(100% - 120px)', scrollbarWidth: 'thin' }}
            itemLayout="horizontal"
            dataSource={contacts} // Filtered contacts
            onScroll={handleScroll} // Detect scroll
            renderItem={(item) => (
                <List.Item
                    onClick={() => setSelectedContact(item)}
                    className={` hover:bg-blue-200 p-2 rounded-lg cursor-pointer overflow-auto ${
                        selectedContact?.id === item.id && 'bg-gray-500 text-white'
                    } hover:text-blue-400`}
                >
                  <List.Item.Meta
                      className={'px-2 hover:text-blue-400'}
                      avatar={<Avatar size="large" icon={<UserCircleIcon />} />}
                      title={
                        <span
                            className={`font-semibold overflow-hidden  line-clamp-1 ${
                                selectedContact?.id === item.id && 'text-white'
                            }`}
                        >
                  {item?.user?.name || 'User'}
                </span>
                      }
                      description={
                        <span
                            className={`text-gray-500 line-clamp-1 ${
                                selectedContact?.id === item.id && 'text-white'
                            }`}
                        >
                  {item.lastMessage?.content}
                </span>
                      }
                  />
                  <div
                      style={{ position: 'relative' }}
                      className={`text-gray-400 mr-2 text-sm ${
                          selectedContact?.id === item.id && 'text-white'
                      }`}
                  >
                    {!item?.lastMessage?.isAutoRespondMessage &&
                        item?.lastMessage?.sender?.role === 'user' && (
                            <div
                                style={{
                                  top: -10,
                                  right: 0,
                                  position: 'absolute',
                                }}
                                className={' rounded-xl bg-red-400  h-2 w-2'}
                            />
                        )}
                    {moment(item.lastMessage?.updatedAt)?.format('HH:mm')}
                  </div>
                </List.Item>
            )}
        />
      </Sider>
  )
}

export default UsersList
