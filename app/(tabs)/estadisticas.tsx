import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayer } from '../../context/PlayerContext';
import { cargarRanking } from '../../data/rankingData';

interface EstadisticasJugador {
  juegos: number;
  victorias: number;
  derrotas: number;
}

export default function EstadisticasScreen() {
  const router = useRouter();
  const { playerName } = usePlayer();
  const [dificultad, setDificultad] = useState<'facil' | 'medio' | 'dificil'>('medio');
  const [estadisticas, setEstadisticas] = useState<EstadisticasJugador>({
    juegos: 0,
    victorias: 0,
    derrotas: 0,
  });

  useEffect(() => {
    cargarEstadisticas();
  }, [dificultad, playerName]);

  const cargarEstadisticas = async () => {
    try {
      const ranking = await cargarRanking();
      const jugadorStats = ranking.filter(
        item => item.nombre === playerName && item.dificultad === dificultad
      );

      const victorias = jugadorStats.filter(item => item.ganado).length;
      const derrotas = jugadorStats.filter(item => !item.ganado).length;
      const juegos = victorias + derrotas;

      setEstadisticas({
        juegos,
        victorias,
        derrotas,
      });
    } catch (error) {
      console.log('Error cargando estadísticas:', error);
    }
  };

  const handleVolver = () => {
    router.replace('/game');
  };

  const getDificultadColor = (dificultadSeleccionada: 'facil' | 'medio' | 'dificil') => {
    switch (dificultadSeleccionada) {
      case 'facil':
        return '#4CAF50';
      case 'medio':
        return '#FFC107';
      case 'dificil':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Botón Volver */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.volverButton} onPress={handleVolver}>
          <Ionicons name="arrow-back" size={22} color="#2E86AB" />
          <Text style={styles.volverText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <View style={styles.container}>
        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Estadísticas</Text>
        </View>

        {/* Tabla de estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsHeaderText}>JUEGOS</Text>
            </View>
            <View style={styles.statsHeader}>
              <Text style={styles.statsHeaderText}>VICTORIAS</Text>
            </View>
            <View style={styles.statsHeader}>
              <Text style={styles.statsHeaderText}>DERROTAS</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statsCell}>
              <Text style={styles.statsValue}>{estadisticas.juegos}</Text>
            </View>
            <View style={styles.statsCell}>
              <Text style={styles.statsValue}>{estadisticas.victorias}</Text>
            </View>
            <View style={styles.statsCell}>
              <Text style={styles.statsValue}>{estadisticas.derrotas}</Text>
            </View>
          </View>
        </View>

        {/* Botones de dificultad */}
        <View style={styles.difficultyContainer}>
          <TouchableOpacity 
            style={[
              styles.difficultyButton, 
              { backgroundColor: '#4CAF50' },
              dificultad === 'facil' && styles.selectedDifficulty
            ]} 
            onPress={() => setDificultad('facil')}
          >
            <Text style={styles.difficultyButtonText}>Fácil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.difficultyButton, 
              { backgroundColor: '#FFC107' },
              dificultad === 'medio' && styles.selectedDifficulty
            ]} 
            onPress={() => setDificultad('medio')}
          >
            <Text style={styles.difficultyButtonText}>Medio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.difficultyButton, 
              { backgroundColor: '#F44336' },
              dificultad === 'dificil' && styles.selectedDifficulty
            ]} 
            onPress={() => setDificultad('dificil')}
          >
            <Text style={styles.difficultyButtonText}>Difícil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  headerContainer: {
    // Removido padding para que coincida con ranking
  },
  volverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    margin: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  volverText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statsHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statsHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statsCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 10,
    gap: 14,
    minWidth: 260,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 32,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedDifficulty: {
    borderWidth: 3,
    borderColor: '#111',
  },
  difficultyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
}); 