import { userStore } from '@/utils/zustand.js'
import { Typography } from '@material-tailwind/react'
import AntTable from '@/components/AntTable/index.jsx'
import * as React from 'react'
import { fetchCategoryTariffs } from '@/utils/api/functions.js'
import { Image, Button } from 'antd'

const CategoriesList = ({ categories, setSelectedCategory }) => {
  const lang = userStore((state) => state.language)

  const tableNameSorter = (a, b) => {
    // Convert names to lowercase to make the sorting case-insensitive
    const nameA = a?.name?.[lang].toLowerCase()
    const nameB = b?.name?.[lang].toLowerCase()
    if (nameA < nameB) {
      return -1 // a comes before b
    }
    if (nameA > nameB) {
      return 1 // a comes after b
    }
    return 0 // a and b are equal
  }

  const headCells = [
    {
      id: 'id',
      key: 'id',
      title: '№',
      render: (row, head, index) => {
        return <div>{index + 1}</div>
      },
    },
    {
      id: 'name',
      key: 'name',
      width: '40%',
      sorter: tableNameSorter,
      render: (row, head) => (
        <div key={row?.id} className={'overflow-ellipsis'}>
          {row.name?.[lang]}
        </div>
      ),
      title: 'Наименование',
    },
    {
      id: 'name',
      key: 'name',
      width: '40%',
      title: 'Описание',
      render: (row, head) => (
        <div key={row?.id} className={'overflow-ellipsis'}>
          {row.description?.[lang]}
        </div>
      ),
    },
    {
      id: 'image',
      key: 'image',
      title: 'Изображение',
      render: (row, head) => {
        return <Image height={50} src={row?.imageDesktop?.[lang]} />
      },
    },
  ]

  const onClickAdd = () => {
    setSelectedCategory({
      name: {
        ru: '',
        uz: '',
      },
      description: {
        ru: '',
        uz: '',
      },
    })
  }

  return (
    <div className="p-4 rounded-3xl flex flex-col gap-6 bg-white">
      <div className="flex justify-between align-bottom">
        <div className={'text-3xl font-semibold mt-1'}>Категории</div>
        <Button
          onClick={onClickAdd}
          size={'sm'}
          className={'flex align-middle pointer-events-auto '}
        >
          <Typography className={'font-semibold'} style={{ fontSize: '12px', margin: '3px' }}>
            Добавить
          </Typography>
        </Button>
      </div>
      <AntTable headCells={headCells} rows={categories} onClickRow={setSelectedCategory} />
    </div>
  )
}

export default CategoriesList
