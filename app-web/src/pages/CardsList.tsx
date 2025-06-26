import { useState } from 'react'
import { useCards, type Card as CardType } from '../contexts/CardsContext'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { AddCardModal } from '@/components/AddCardModal'
import { CardDetailsModal } from '@/components/CardDetailsModal'
import { EditCardModal } from '@/components/EditCardModal'

export function CardsList() {
  const { state } = useCards()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEditCard = (card: CardType) => {
    setSelectedCard(card)
    setShowDetailsModal(false)
    setShowEditModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Cards ({state.cards.length})
        </h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add Card
        </Button>
      </div>

      {state.cards.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No cards</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first card.
            </p>
            <div className="mt-6">
              <Button onClick={() => setShowAddModal(true)}>
                Add your first card
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {state.cards.map((card) => (
            <Card 
              key={card.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedCard(card)
                setShowDetailsModal(true)
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">{card.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {card.barcode && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Barcode:</span> {card.barcode}
                  </p>
                )}
                {card.type && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Type:</span> {card.type}
                  </p>
                )}
                {card.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {card.notes}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Added {card.createdAt.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddCardModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />

      <CardDetailsModal
        card={selectedCard}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedCard(null)
        }}
        onEdit={handleEditCard}
      />

      <EditCardModal
        card={selectedCard}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedCard(null)
        }}
      />
    </div>
  )
}