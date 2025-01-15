import React, { useState } from 'react'
import { FolderOpenIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import FAQChat from '@/pages/dashboard/chat/faqAndCategories/FAQ/index.jsx'
import FAQCategory from '@/pages/dashboard/chat/faqAndCategories/categories/index.jsx'

const FAQChatContainer = () => {
  const tabList = [
    {
      title: 'FAQ',
      value: 'FAQ',
      icon: <QuestionMarkCircleIcon className="-mt-1 mr-2 inline-block h-5 w-5" />,
      body: <FAQChat />,
    },
    {
      title: 'Категории',
      value: 'Категории',
      icon: <FolderOpenIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />,
      body: <FAQCategory />,
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

export default FAQChatContainer
