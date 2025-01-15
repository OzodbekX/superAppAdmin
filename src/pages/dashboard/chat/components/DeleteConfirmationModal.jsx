import React from 'react'
import { Button, Modal } from 'antd'

const DeleteConfirmationModal = ({ isVisible, onDelete, onCancel }) => {
  return (
    <Modal
      title={null}
      open={isVisible}
      onOk={onDelete}
      onCancel={onCancel}
      footer={null}
      width={390}
      centered={true}
    >
      <div>
        <h4>Удалить сообщение?</h4>
        <div className="mt-10 flex flex-col gap-2">
          <Button
            type={'primary'}
            color={'danger'}
            className={'bg-red-500 text-white'}
            onClick={onDelete}
          >
            Удалить
          </Button>
          <Button type={'primary'} color={'default'} className={'text-black'} onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
