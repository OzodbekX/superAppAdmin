import React from 'react'
import { Layout, List } from 'antd'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { fetchUsersArchiveChats } from '@/utils/api/functions.js'
import ShowRateReasons from '@/pages/dashboard/chat/components/ShowRateReasons.jsx'

const { Sider } = Layout
const ArchiveChatsList = ({
  selectedContact = {},
  selectedArchiveContact,
  setSelectedArchiveContact,
}) => {
  // Function to check if scroll reached the bottom

  const { data: userArchiveChats } = useQuery({
    queryKey: ['userArchiveChats', selectedContact], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchUsersArchiveChats({ offset: 0, limit: 100, userId: selectedContact?.user?.id }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
    refetchOnWindowFocus: false,

    enabled: !!selectedContact?.user?.id,
  })

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setOffSet(userArchiveChats?.length)
    }
  }
  const selectedId = selectedArchiveContact?.id || selectedContact?.id

  return (
    <Sider width={'100%'} className="bg-white shadow-lg rounded-2xl flex-col adaptive-height">
      <div className="text-lg font-semibold text-gray-800 p-4">Предыдущие архивные чаты</div>
      {/* Contact List */}
      <List
        total={userArchiveChats?.length}
        className={'overflow-auto py-4 px-2 pl-4'}
        style={{ height: 'calc(100% - 180px)', scrollbarWidth: 'thin' }}
        itemLayout="horizontal"
        dataSource={userArchiveChats} // Filtered contacts
        onScroll={handleScroll} // Detect scroll
        renderItem={(item) => (
          <List.Item
            className={` hover:bg-blue-200 p-2 rounded-lg cursor-pointer overflow-auto ${
              selectedId === item.id && 'bg-gray-500 text-white'
            } hover:text-blue-400`}
          >
            <List.Item.Meta
              className={'px-2 hover:text-blue-400'}
              title={
                <div
                  onClick={() => setSelectedArchiveContact(item)}
                  className={`font-semibold overflow-hidden   ${
                    selectedId === item.id && 'text-white'
                  }`}
                >
                  <div className={'text-xl mb-1 flex justify-between'}>
                    <div> {item?.faqCategory?.name}</div>
                    {!item?.lastMessage?.isAutoRespondMessage &&
                      item?.lastMessage?.sender?.role === 'USER' && (
                        <div className={' rounded-xl mt-3 bg-red-400  h-2 w-2'} />
                      )}
                  </div>
                  {item?.lastMessage?.content?.trim()?.length > 0 ? (
                    <div
                      className={`flex justify-between align-middle flex-wrap ${
                        selectedId === item.id && 'text-white'
                      }`}
                    >
                      <span
                        className={`text-gray-500 line-clamp-1 text-xs ${
                          selectedId === item.id && 'text-white'
                        } `}
                      >
                        <span className={'mr-2 '}>Сообщение:</span> {item.lastMessage?.content}
                      </span>
                      <div>{moment(item.lastMessage?.updatedAt)?.format('DD.MM.YYYY, HH:mm')}</div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              }
              description={<ShowRateReasons selectedContact={item} />}
            />
          </List.Item>
        )}
      />
    </Sider>
  )
}

export default ArchiveChatsList
