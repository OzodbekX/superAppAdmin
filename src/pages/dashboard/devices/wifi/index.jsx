import WifiList from './list'
import { useState } from 'react'
import WifiForm from './form.jsx'

const WifiRouters = ({ filters, routers, total, onUpdateList, setFilters }) => {
  const [selectedWifi, setSelectedWifi] = useState()

  return (
    <div>
      {selectedWifi ? (
        <WifiForm
          selectedWifi={selectedWifi}
          setSelectedWifi={setSelectedWifi}
          onUpdateList={onUpdateList}
        />
      ) : (
        <WifiList
          wifis={routers}
          total={total}
          setFilters={setFilters}
          filters={filters}
          setSelectedWifi={setSelectedWifi}
        />
      )}
    </div>
  )
}

export default WifiRouters
