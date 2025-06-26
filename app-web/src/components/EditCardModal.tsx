import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from './Modal'
import { Tabs } from './Tabs'
import { Button } from './Button'
import { useCards, type Card as CardType } from '../contexts/CardsContext'
import { CameraScanner } from './CameraScanner'

interface CardFormData {
  name: string
  barcode?: string
  type?: string
  notes?: string
}

interface EditCardModalProps {
  card: CardType | null
  isOpen: boolean
  onClose: () => void
}

export function EditCardModal({ card, isOpen, onClose }: EditCardModalProps) {
  const { updateCard } = useCards()
  const [activeTab, setActiveTab] = useState('manual')
  const [scannedCode, setScannedCode] = useState<string>('')
  const [, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, reset } = useForm<CardFormData>({
    defaultValues: {
      name: '',
      barcode: '',
      type: '',
      notes: '',
    }
  })

  // Set form values when card changes
  useEffect(() => {
    if (card && isOpen) {
      reset({
        name: card.name,
        barcode: card.barcode || '',
        type: card.type || '',
        notes: card.notes || '',
      })
      setImagePreview(card.image || '')
      setScannedCode('')
    }
  }, [card, isOpen, reset])

  const formData = watch()

  const handleScan = (result: string) => {
    setScannedCode(result)
    setValue('barcode', result)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: CardFormData) => {
    if (!card || !data.name.trim()) {
      alert('Please enter a card name')
      return
    }

    updateCard({
      ...card,
      name: data.name,
      barcode: data.barcode || scannedCode,
      type: data.type,
      notes: data.notes,
      image: imagePreview,
    })

    // Reset form and close modal
    handleClose()
  }

  const handleClose = () => {
    reset()
    setScannedCode('')
    setSelectedImage(null)
    setImagePreview('')
    setActiveTab('manual')
    onClose()
  }

  if (!card) return null

  const tabs = [
    {
      id: 'manual',
      label: 'Manual',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edit card details manually
          </p>
        </div>
      ),
    },
    {
      id: 'scanner',
      label: 'Scanner',
      content: (
        <div className="space-y-4">
          <CameraScanner 
            onScan={handleScan} 
            isActive={activeTab === 'scanner' && isOpen}
          />
          
          {scannedCode && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Scanned:</strong> {scannedCode}
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'photo',
      label: 'Photo',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Image
            </Button>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-w-full h-48 object-contain rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      ),
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Card" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Name *
            </label>
            <input
              {...register('name', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter card name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Barcode
            </label>
            <input
              {...register('barcode')}
              type="text"
              value={formData.barcode || scannedCode}
              onChange={(e) => setValue('barcode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Barcode will appear here when scanned"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Type
            </label>
            <input
              {...register('type')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Loyalty, Gift, Membership"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Additional notes about this card"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}