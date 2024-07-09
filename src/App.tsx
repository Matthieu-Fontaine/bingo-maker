import React, { useState, useEffect } from 'react';
import BingoContentManager from './BingoContentManager'; // Assurez-vous que le chemin est correct
import { API_URL } from './env';

interface BingoCell {
  item: string;
  checked: boolean;
}

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [bingoGrid, setBingoGrid] = useState<BingoCell[]>([]);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    document.title = "Bingo Les Ardentes";
  }, []);

  useEffect(() => {
    const fetchBingoContent = async () => {
      const response = await fetch(API_URL + 'api/bingo-content');
      const data = await response.json();
      setBingoGrid(data);
    };

    fetchBingoContent();
  }, []);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let correctName = name.trim();
    correctName = correctName.toLowerCase();

    const response = await fetch(API_URL + 'api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: correctName }),
    });

    const data = await response.json();

    if (Array.isArray(data.bingo_grid)) {
      setBingoGrid(data.bingo_grid);
    } else {
      console.error("bingo_grid is not an array:", data.bingo_grid);
    }
  };

  const toggleCheck = async (index: number) => {
    const newGrid = [...bingoGrid];
    newGrid[index].checked = !newGrid[index].checked;
    setBingoGrid(newGrid);

    // Mettre à jour la grille dans la base de données
    await fetch(API_URL + `api/user/${name}/bingo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bingo_grid: newGrid }),
    });
    checkBingo();
  };

  const checkBingo = () => {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (
        bingoGrid[i * 5].checked &&
        bingoGrid[i * 5 + 1].checked &&
        bingoGrid[i * 5 + 2].checked &&
        bingoGrid[i * 5 + 3].checked &&
        bingoGrid[i * 5 + 4].checked
      ) {
        // Call a function for row bingo
        handleBingo();
        return;
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if (
        bingoGrid[i].checked &&
        bingoGrid[i + 5].checked &&
        bingoGrid[i + 10].checked &&
        bingoGrid[i + 15].checked &&
        bingoGrid[i + 20].checked
      ) {
        // Call a function for column bingo
        handleBingo();
        return;
      }
    }

    // Check diagonals
    if (
      (bingoGrid[0].checked &&
        bingoGrid[6].checked &&
        bingoGrid[12].checked &&
        bingoGrid[18].checked &&
        bingoGrid[24].checked) ||
      (bingoGrid[4].checked &&
        bingoGrid[8].checked &&
        bingoGrid[12].checked &&
        bingoGrid[16].checked &&
        bingoGrid[20].checked)
    ) {
      // Call a function for diagonal bingo
      handleBingo();
      return;
    }
  };

  const handleBingo = () => {
    console.log("Bingo!");
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-beige-pastel">
      <h1 className="text-7xl font-bold mb-7 text-center bg-gradient-to-r from-[#B16CEA] via-[#FF5E69] to-[#FFA84B] text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-[#B16CEA] hover:via-[#FF8C55] hover:to-[#FFA84B] hover:cursor-default">
        Les Ardentes
      </h1>
      <button
        onClick={() => setShowManager(!showManager)}
        className="bg-gray-500 text-white py-2 px-4 mb-4 hidden"
      >
        {showManager ? 'Retour au Bingo' : 'Gérer les contenus de Bingo'}
      </button>

      {showManager ? (
        <BingoContentManager />
      ) : (
        !bingoGrid.length ? (
          <form className="flex flex-col justify-center" onSubmit={handleNameSubmit}>
            <label htmlFor="name" className="block text-xl mb-2">
              Entrez ton prénom:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4">
              Soumettre
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-5 w-full max-w-screen-lg sm:border-2 md:border-4">
            {bingoGrid.map((cell, index) => (
              <div
                key={index}
                className={`h-20 sm:h-28 md:h-36 sm:border-2 md:border-4
                  w-full text-xs md:text-lg border cursor-pointer
                  flex items-center justify-center text-center ${cell.checked ? 'bg-rouge-pastel' : 'bg-jaune-pastel'}`}
                onClick={() => toggleCheck(index)}
              >
                <p>{cell.item}</p>
              </div>
            ))}
          </div>
        )
      )}

      <footer className="text-center mt-7">
        <p>
          Fait avec ❤️ par {'Matthieu'}
        </p>
      </footer>
    </div>
  );
};

export default App;
