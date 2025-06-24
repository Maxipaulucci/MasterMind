import React, { createContext, useContext, useState } from 'react';

interface PlayerContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
}

const PlayerContext = createContext<PlayerContextType>({
  playerName: '',
  setPlayerName: () => {},
});

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState('');
  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext); 