import * as SQLite from 'expo-sqlite';
import {SQLiteDatabase} from 'expo-sqlite';

const db = SQLite.openDatabaseSync('card-stash.db');

if (!db) {
  console.error('Database failed to initialize.');
}

// Initialize Database
export const initDB = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS cards
                 (
                   id
                   INTEGER
                   PRIMARY
                   KEY
                   AUTOINCREMENT,
                   name
                   TEXT
                   NOT
                   NULL,
                   barcode_value
                   TEXT
                   NOT
                   NULL,
                   barcode_type
                   TEXT
                   NOT
                   NULL,
                   created_at
                   TIMESTAMP
                   DEFAULT
                   CURRENT_TIMESTAMP,
                   updated_at
                   TIMESTAMP
                   DEFAULT
                   CURRENT_TIMESTAMP
                 );`;

  db.execSync(query);
};

// Add a Card
export const addCard = (db: SQLiteDatabase, name: string, barcode_value: string, barcode_type: string) => {
  try {
    const now = new Date().toISOString();
    // @ts-ignore
    let result = db.runSync(
      `INSERT INTO cards (name, barcode_value, barcode_type, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?);`,
      [name, barcode_value, barcode_type, now, now]
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

// Get All Cards
export const getCards = (db: SQLiteDatabase) => {
  try {
    // @ts-ignore
    const result = db.getAllSync(
      'SELECT * FROM cards ORDER BY name ASC;'
    );

    return result;

  } catch (error) {
    console.error(error);
    throw Error('Failed to get cards !!!');
  }
};

// Update a Card
export const updateCard = (id: number, name: string, barcode_value: string, barcode_type: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    // @ts-ignore
    db.withTransactionSync(tx => {
      tx.executeSql(
        'UPDATE cards SET name = ?, barcode_value = ?, barcode_type = ?, updated_at = ? WHERE id = ?;',
        [name, barcode_value, barcode_type, now, id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

// Delete a Card
export const deleteCard = (id: number) => {
  try {
    // @ts-ignore
    const result = db.runSync('DELETE FROM cards WHERE id = $id', { $id: id });

    return result;

  } catch (error) {
    console.error(error);
    throw Error('Failed to delete card');
  }


  return new Promise((resolve, reject) => {
    // @ts-ignore
    db.withTransactionAsync(tx => {
      tx.executeSql(
        'DELETE FROM cards WHERE id = ?;',
        [id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};
