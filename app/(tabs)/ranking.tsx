import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ranking from '../../components/Ranking';
import { cargarRanking, limpiarRanking } from '../../data/rankingData';

const dificultades = [
  { key: 'facil', label: 'Fácil', color: '#4CAF50' },
  { key: 'medio', label: 'Medio', color: '#FFC107' },
  { key: 'dificil', label: 'Difícil', color: '#F44336' },
];

export default function RankingScreen() {
  const params = useLocalSearchParams();
  const dificultadInicial = typeof params.dificultad === 'string' ? params.dificultad : 'medio';
  const [dificultad, setDificultad] = useState(dificultadInicial);
  const router = useRouter();

  // Sincronizar dificultad con el parámetro recibido
  useEffect(() => {
    if (typeof params.dificultad === 'string' && params.dificultad !== dificultad) {
      setDificultad(params.dificultad);
    }
  }, [params.dificultad]);

  // Estado local para el ranking
  const [rankingLocal, setRankingLocal] = useState([]);
  // Filtrar ranking por dificultad
  const rankingFiltrado = rankingLocal.filter((item) => item.dificultad === dificultad);

  const [loading, setLoading] = useState(true);

  const handleReiniciarRanking = async () => {
    Alert.alert(
      'Reiniciar Ranking',
      '¿Estás seguro de que quieres reiniciar el ranking? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await limpiarRanking();
              setRankingLocal([]);
              setLoading(false);
            } catch (error) {
              console.log('Error reiniciando ranking:', error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const cargar = async () => {
        setLoading(true);
        const datos = await cargarRanking();
        if (isActive) {
          setRankingLocal(datos);
          setLoading(false);
        }
      };
      cargar();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <LinearGradient
      colors={['#23243a', '#181A20']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Botón volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/game')}>
          <Ionicons name="arrow-back" size={22} color="#2E86AB" />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        {/* Contenedor flexible para ranking */}
        <View style={styles.flexContainer}>
          <View style={styles.cardContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Cargando...</Text>
              </View>
            ) : (
              <>
                <Ranking ranking={rankingFiltrado} dificultad={dificultad} />

                {/* Barra de tabs de dificultad dentro del contenedor de ranking, pero fuera de puntuaciones */}
                <View style={styles.tabsContainer}>
                  {dificultades.map((dif) => (
                    <TouchableOpacity
                      key={dif.key}
                      style={[
                        styles.tabButton,
                        { backgroundColor: dif.color },
                        dificultad === dif.key && styles.selectedTab
                      ]}
                      onPress={() => setDificultad(dif.key)}
                    >
                      <Text style={[styles.tabText, { color: '#fff' }]}>{dif.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Botón Reiniciar Ranking */}
                <View style={styles.reiniciarContainer}>
                  <TouchableOpacity style={styles.reiniciarButton} onPress={handleReiniciarRanking}>
                    <Text style={styles.reiniciarButtonText}>Reiniciar Ranking</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  gradientBackground: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 18,
  },
  cardContainer: {
    backgroundColor: 'rgba(28, 29, 44, 0.98)',
    borderRadius: 28,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 0,
    paddingVertical: 18,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    minHeight: 340,
    justifyContent: 'flex-start',
    flex: 1,
    gap: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 10,
    gap: 14,
    minWidth: 260,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 32,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 0,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  selectedTab: {
    borderWidth: 2,
    borderColor: '#111',
    borderRadius: 19
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    margin: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#2E86AB',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  reiniciarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  reiniciarButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  reiniciarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 