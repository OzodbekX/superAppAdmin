// ApplicationList.jsx
import React, { useMemo, useState } from 'react'
import AntTable from '@/components/AntTable'

const headCells = [
  {
    id: 'title',
    key: 'title',
    title: 'Подкатегория',
    render: (row) => <div className={row.type === 'CATEGORY' ? 'font-bold' : ''}>{row.title} </div>,
  },
  {
    id: 'connectionWithOperatorCount',
    key: 'connectionWithOperatorCount',
    align: 'center',
    title: 'Количество чатов',
    render: (row) => (
      <div className={row.type === 'CATEGORY' ? 'font-bold text-center' : ' text-center'}>
        {row.chatCount}
      </div>
    ),
  },
  {
    id: 'connectionWithOperatorCount',
    key: 'connectionWithOperatorCount',
    align: 'center',
    title: 'Связь с оператором подсчета',
    render: (row) => (
      <div className={row.type === 'CATEGORY' ? 'font-bold text-center' : ' text-center'}>
        {row.connectionWithOperatorCount}
      </div>
    ),
  },
]
function removeEmptySubCategories(tree) {
  return tree
    .map((node) => {
      // Recursively process the subCategories
      if (node.subCategories && node.subCategories.length > 0) {
        node.subCategories = removeEmptySubCategories(node.subCategories)
      }

      // Return the node only if subCategories is not an empty array
      return node.subCategories && node.subCategories.length > 0
        ? node
        : { ...node, subCategories: undefined } // Optional: Remove empty subCategories field
    })
    .filter((node) => node.subCategories || node.subCategories === undefined)
}

const ApplicationList = ({ data, total, setSelectedItem }) => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0 })

  const splitArrayAndGetItem = useMemo(() => {
    if (!Array.isArray(data)) {
      return []
    }

    if (typeof filters?.pageSize !== 'number' || filters?.pageSize <= 0) {
      return []
    }

    if (typeof filters?.page !== 'number' || filters?.page < 0 || filters?.page >= data.length) {
      return []
    }
    let list = removeEmptySubCategories(data)

    // Split the data into chunks
    const chunks = []
    for (let i = 0; i < data.length; i += filters?.pageSize) {
      chunks.push(list.slice(i, i + filters?.pageSize))
    }

    return chunks[filters?.page]
  }, [data, filters])

  return (
    <div className="p-4 bg-white">
      <AntTable
        childrenColumnName={'subCategories'}
        onClickRow={setSelectedItem}
        headCells={headCells}
        rows={splitArrayAndGetItem}
        total={total}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

export default ApplicationList
