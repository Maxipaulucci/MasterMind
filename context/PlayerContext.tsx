import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Cargar el nombre del jugador desde AsyncStorage al inicializar
  useEffect(() => {
    const loadPlayerName = async () => {
      try {
        const savedName = await AsyncStorage.getItem('playerName');
        if (savedName) {
          setPlayerName(savedName);
        }
      } catch (error) {
        console.log('Error loading player name:', error);
      }
    };
    loadPlayerName();
  }, []);

  // Función para actualizar el nombre del jugador y guardarlo en AsyncStorage
  const updatePlayerName = async (name: string) => {
    try {
      await AsyncStorage.setItem('playerName', name);
      setPlayerName(name);
    } catch (error) {
      console.log('Error saving player name:', error);
      setPlayerName(name); // Aún actualizar el estado local si falla el guardado
    }
  };

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName: updatePlayerName }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext); 