import React from 'react'
import { Pagination, Table } from 'antd'

const AntTable = ({
  headCells,
  total,
  rows = [],
  onClickRow,
  className = '',
  rowKey = 'id',
  childrenColumnName = '1231231231312312324323452345',
  setFilters,
  filters,
  rowSelection,
}) => {
  const onChangePage = (page, pageSize) => {
    setFilters && setFilters((filters) => ({ ...filters, page: page - 1, pageSize: pageSize }))
  }
  return (
    <div className={className}>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: () => onClickRow(record, rowIndex), // click row
          }
        }}
        expandable={{ childrenColumnName: childrenColumnName }}
        pagination={false}
        columns={headCells}
        dataSource={rows}
        rowSelection={rowSelection}
        className={'pb-4'}
        rowKey={rowKey}
        rowHoverable={true}
        rowClassName={onClickRow && 'cursor-pointer'}
      />
      {filters?.pageSize && (
        <Pagination
          defaultPageSize={filters?.pageSize}
          total={total}
          defaultCurrent={filters?.page + 1}
          onChange={onChangePage}
          showSizeChanger={true}
        />
      )}
    </div>
  )
}
export default AntTable
