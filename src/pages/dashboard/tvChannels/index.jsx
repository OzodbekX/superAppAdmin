import React, { useState } from 'react'
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { FolderOpenIcon, TicketIcon, TvIcon } from '@heroicons/react/24/solid/index.js'
import TVChannelsComponent from '@/pages/dashboard/tvChannels/channels/index.jsx'
import ChannelCategory from '@/pages/dashboard/tvChannels/categories/index.jsx'
import ChannelTariffs from '@/pages/dashboard/tvChannels/tariffs/index.jsx'

const TVChannels = () => {
  const tabList = [
    {
      title: 'Каналы',
      value: 'Каналы',
      icon: <TvIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: <TVChannelsComponent />,
    },
    {
      title: 'Категории',
      value: 'Категории',
      icon: <FolderOpenIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />,
      body: <ChannelCategory />,
    },
    {
      title: 'Тарифы',
      value: 'Тарифы',
      icon: <TicketIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />,
      body: <ChannelTariffs />,
    },
  ]
  const [tabValue, setTabValue] = useState(tabList?.[0].value)

  return (
    <div className={'bg-white'}>
      <Tabs value={tabValue}>
        <TabsHeader className={'w-1/2  px-5 m-4 mb-0'}>
          {tabList?.map((item, index) => (
            <Tab onClick={() => setTabValue(item.value)} key={index} value={item.value}>
              {item.icon}
              {item.title}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {tabList.map(({ body, value }) => (
            <TabPanel key={value} value={value}>
              {body}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  )
}
export default TVChannels
