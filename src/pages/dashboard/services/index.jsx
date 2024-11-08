import React, { useState } from 'react'
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { FolderOpenIcon, TagIcon } from '@heroicons/react/24/solid'
import ServiceOptions from '@/pages/dashboard/services/serviceOptions/index.jsx'
import ServiceTypes from '@/pages/dashboard/services/servicesType/index.jsx'
import { SquaresPlusIcon } from '@heroicons/react/24/solid/index.js'
import ConnectServiceToOptions from '@/pages/dashboard/services/connectServiceToOption/index.jsx'

const Services = () => {
  const tabList = [
    {
      title: 'Service',
      value: 'Service',
      icon: <FolderOpenIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />,
      body: <ServiceTypes />,
    },
    {
      title: 'Виды обслуживания.',
      value: 'Виды обслуживания.',
      icon: <TagIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: <ServiceOptions />,
    },
    {
      title: 'Связать',
      value: 'Связать',
      icon: <SquaresPlusIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: <ConnectServiceToOptions />,
    },
  ]
  const [tabValue, setTabValue] = useState(tabList?.[0].value)
  return (
    <div className={'rounded-3xl bg-white'}>
      <Tabs value={tabValue}>
        <TabsHeader className={'w-1/2 px-5 m-4'}>
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

export default Services
