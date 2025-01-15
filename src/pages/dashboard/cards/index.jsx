import CardsList from './list'
import { fetchNavigationCards } from '@/utils/api/functions.js'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import CardsForm from '@/pages/dashboard/cards/form.jsx'

const NavigationCards = () => {
  const [filters, setFilters] = useState({ pageSize: 10, page: 0, reNew: 0 })
  const [selectedCards, setSelectedCards] = useState()

  const { data } = useQuery({
    queryKey: ['fetchNavigationCards', filters], // The query key depends on the page and pageSize
    queryFn: () =>
      fetchNavigationCards({ offset: filters.page * filters.pageSize, limit: filters.pageSize }), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  return (
    <div>
      {selectedCards ? (
        <CardsForm
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
          setFilters={setFilters}
        />
      ) : (
        <CardsList
          cards={data?.data}
          total={data?.meta?.total}
          setFilters={setFilters}
          filters={filters}
          setSelectedCards={setSelectedCards}
        />
      )}
    </div>
  )
}

export default NavigationCards
