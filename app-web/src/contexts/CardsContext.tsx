import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'

export interface Card {
  id: string
  name: string
  barcode?: string
  type?: string
  notes?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

interface CardsState {
  cards: Card[]
  loading: boolean
  error: string | null
}

type CardsAction =
  | { type: 'ADD_CARD'; payload: Omit<Card, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_CARD'; payload: Card }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'SET_CARDS'; payload: Card[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

interface CardsContextType {
  state: CardsState
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCard: (card: Card) => void
  deleteCard: (id: string) => void
  clearError: () => void
}

const CardsContext = createContext<CardsContextType | undefined>(undefined)

const initialState: CardsState = {
  cards: [],
  loading: false,
  error: null,
}

function cardsReducer(state: CardsState, action: CardsAction): CardsState {
  switch (action.type) {
    case 'ADD_CARD':
      const newCard: Card = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return { ...state, cards: [...state.cards, newCard] }
    
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id
            ? { ...action.payload, updatedAt: new Date() }
            : card
        ),
      }
    
    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload),
      }
    
    case 'SET_CARDS':
      return { ...state, cards: action.payload }
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    default:
      return state
  }
}

const STORAGE_KEY = 'card-stash-cards'

export function CardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cardsReducer, initialState)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cards from localStorage on mount
  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(STORAGE_KEY)
      if (storedCards) {
        const parsedCards = JSON.parse(storedCards).map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        }))
        console.log('Cards loaded from localStorage:', parsedCards.length, 'cards')
        dispatch({ type: 'SET_CARDS', payload: parsedCards })
      } else {
        console.log('No cards found in localStorage')
      }
      setIsLoaded(true)
    } catch (error) {
      console.error('Error loading cards from localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cards' })
      setIsLoaded(true)
    }
  }, [])

  // Save cards to localStorage whenever cards change (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards))
      console.log('Cards saved to localStorage:', state.cards.length, 'cards')
    } catch (error) {
      console.error('Error saving cards to localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save cards' })
    }
  }, [state.cards, isLoaded])

  const addCard = (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_CARD', payload: cardData })
  }

  const updateCard = (card: Card) => {
    dispatch({ type: 'UPDATE_CARD', payload: card })
  }

  const deleteCard = (id: string) => {
    dispatch({ type: 'DELETE_CARD', payload: id })
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  const value: CardsContextType = {
    state,
    addCard,
    updateCard,
    deleteCard,
    clearError,
  }

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>
}

export function useCards() {
  const context = useContext(CardsContext)
  if (context === undefined) {
    throw new Error('useCards must be used within a CardsProvider')
  }
  return context
}