import { useEffect, useRef } from 'react'
import { Button } from './Button'
import { useCards } from '../contexts/CardsContext'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { state, addCard } = useCards()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleExport = () => {
    const dataStr = JSON.stringify(state.cards, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `card-stash-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedCards = JSON.parse(text)
      
      if (!Array.isArray(importedCards)) {
        throw new Error('Invalid format: expected an array of cards')
      }

      // Validate and import each card
      let importCount = 0
      for (const card of importedCards) {
        if (card.name && typeof card.name === 'string') {
          addCard({
            name: card.name,
            barcode: card.barcode || '',
            type: card.type || '',
            notes: card.notes || '',
            image: card.image || '',
          })
          importCount++
        }
      }

      alert(`Successfully imported ${importCount} cards`)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      alert('Error importing data: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Data Management Section */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Data Management
              </h3>
              <div className="space-y-4">
                {/* Export */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Export Data
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Download all your cards as a JSON file. You can use this to backup your data or transfer it to another device.
                  </p>
                  <Button onClick={handleExport} variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Cards ({state.cards.length})
                  </Button>
                </div>

                {/* Import */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Import Data
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Import cards from a JSON file. This will add the imported cards to your existing collection.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    variant="outline"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Import Cards
                  </Button>
                </div>
              </div>
            </section>

            {/* Statistics */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Statistics
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Cards</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {state.cards.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cards with Barcodes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {state.cards.filter(card => card.barcode).length}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}