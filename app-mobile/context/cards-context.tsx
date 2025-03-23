import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { initDB, getCards, addCard, updateCard, deleteCard } from '../lib/database';
import { Card } from '../types/types';
import * as SQLite from "expo-sqlite";

interface CardsContextType {
  cards: Card[];
  loading: boolean;
  handleAddCard: (name: string, barcode_value: string, barcode_type: string) => Promise<void>;
  handleUpdateCard: (id: number, name: string, barcode_value: string, barcode_type: string) => Promise<void>;
  handleDeleteCard: (id: number) => Promise<void>;
}

export const CardsContext = createContext<CardsContextType | undefined>(undefined);

interface CardsProviderProps {
  children: ReactNode;
}

export const CardsProvider: React.FC<CardsProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const db = SQLite.openDatabaseSync('card-stash.db');

  useEffect(() => {
    // @ts-ignore
    initDB(db).then(() => {
      console.log('✅ Database initialized');
      loadCards();
    }).catch(err => console.error('❌ Database init failed:', err));
  }, []);

  const loadCards = async () => {
    setLoading(true);
    const data = await getCards(db);
    setCards(data);
    setLoading(false);
    console.log(data);
  };

  const handleAddCard = async (name: string, barcode_value: string, barcode_type: string) => {
    // @ts-ignore
    addCard(db, name, barcode_value, barcode_type);
    loadCards();
  };

  const handleUpdateCard = async (id: number, name: string, barcode_value: string, barcode_type: string) => {
    await updateCard(id, name, barcode_value, barcode_type);
    loadCards();
  };

  const handleDeleteCard = async (id: number) => {
    await deleteCard(id);
    loadCards();
  };

  return (
    <CardsContext.Provider value={{ cards, loading, handleAddCard, handleUpdateCard, handleDeleteCard }}>
      {children}
    </CardsContext.Provider>
  );
};
