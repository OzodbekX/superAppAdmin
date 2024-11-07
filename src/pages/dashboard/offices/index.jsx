import React, { useState } from 'react'
import { BuildingOfficeIcon, FolderOpenIcon } from '@heroicons/react/24/solid'
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import Offices from '@/pages/dashboard/offices/offices/index.jsx'
import Cities from '@/pages/dashboard/offices/cities/index.jsx'

const OfficeAndCities = () => {
  const tabList = [
    {
      title: 'Офисы',
      value: 'offices',
      icon: <BuildingOfficeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: <Offices />,
    },
    {
      title: 'Города',
      value: 'Города',
      icon: <FolderOpenIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />,
      body: <Cities />,
    },
  ]
  const [tabValue, setTabValue] = useState(tabList?.[0].value)
  return (
    <div className={'bg-white rounded-3xl '}>
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

export default OfficeAndCities
