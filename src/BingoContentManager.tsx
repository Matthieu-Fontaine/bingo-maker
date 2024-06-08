import React, { useState, useEffect } from 'react';
import { API_URL } from './env';

interface BingoContent {
  id: number;
  item: string;
}

const BingoContentManager: React.FC = () => {
  const [items, setItems] = useState<BingoContent[]>([]);
  const [newItem, setNewItem] = useState('');

  const fetchItems = async () => {
    const response = await fetch(API_URL + '/api/bingo-content');
    const data = await response.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    const response = await fetch(API_URL + '/api/bingo-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: newItem }),
    });
    const data = await response.json();
    setItems([...items, data]);
    setNewItem('');
  };

  const updateItem = async (id: number, newItem: string) => {
    await fetch(API_URL + `/api/bingo-content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: newItem }),
    });
    fetchItems();
  };

  const deleteItem = async (id: number) => {
    await fetch(API_URL + `/api/bingo-content/${id}`, {
      method: 'DELETE',
    });
    fetchItems();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl mb-4">Gérer le contenu des cases de Bingo</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="border p-2"
          placeholder="Nouveau contenu"
        />
        <button onClick={addItem} className="bg-blue-500 text-white py-2 px-4 ml-2">
          Ajouter
        </button>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.id} className="mb-2 flex items-center">
            <input
              type="text"
              value={item.item}
              onChange={(e) => updateItem(item.id, e.target.value)}
              className="border p-2 flex-1"
            />
            <button
              onClick={() => deleteItem(item.id)}
              className="bg-red-500 text-white py-2 px-4 ml-2"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BingoContentManager;
