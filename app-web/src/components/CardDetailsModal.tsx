import { useState } from 'react'
import Barcode from 'react-barcode'
import { Modal } from './Modal'
import { Button } from './Button'
import { type Card as CardType } from '../contexts/CardsContext'

interface CardDetailsModalProps {
  card: CardType | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (card: CardType) => void
}

export function CardDetailsModal({ card, isOpen, onClose, onEdit }: CardDetailsModalProps) {
  const [isBarcodeEnlarged, setIsBarcodeEnlarged] = useState(false)

  if (!card) return null

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={card.name}
        maxWidth="md"
      >
        <div className="p-6 space-y-6">
          {/* Card Image */}
          {card.image && (
            <div className="flex justify-center">
              <img 
                src={card.image} 
                alt={card.name}
                className="max-w-full h-48 object-contain rounded-lg"
              />
            </div>
          )}

          {/* Card Details */}
          <div className="space-y-4">
            {card.type && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</h4>
                <p className="text-lg text-gray-900 dark:text-white">{card.type}</p>
              </div>
            )}

            {card.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</h4>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{card.notes}</p>
              </div>
            )}

            {/* Barcode Section */}
            {card.barcode && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Barcode</h4>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <button
                      onClick={() => setIsBarcodeEnlarged(true)}
                      className="inline-block hover:opacity-80 transition-opacity cursor-pointer"
                      aria-label="Enlarge barcode"
                    >
                      <Barcode 
                        value={card.barcode} 
                        width={1.5}
                        height={60}
                        displayValue={true}
                        fontSize={14}
                        background="transparent"
                        lineColor="currentColor"
                        className="text-gray-900 dark:text-white"
                      />
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Click to enlarge
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t pt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Added: {new Date(card.createdAt).toLocaleDateString()}</p>
              <p>Last updated: {new Date(card.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action buttons */}
          {onEdit && (
            <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onEdit(card)}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Card
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Enlarged Barcode Modal */}
      {isBarcodeEnlarged && card.barcode && (
        <Modal
          isOpen={isBarcodeEnlarged}
          onClose={() => setIsBarcodeEnlarged(false)}
          title="Barcode"
          maxWidth="lg"
        >
          <div className="p-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg text-center">
              <Barcode 
                value={card.barcode} 
                width={3}
                height={120}
                displayValue={true}
                fontSize={20}
                background="transparent"
                lineColor="currentColor"
                className="text-gray-900 dark:text-white"
              />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Show this barcode to scan at checkout
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => setIsBarcodeEnlarged(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}