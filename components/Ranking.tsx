import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { calcularRankingPorDificultad } from '../data/rankingData';

const medallas = [
  { color: '#FFD700', icon: 'medal-outline' }, // Oro
  { color: '#C0C0C0', icon: 'medal-outline' }, // Plata
  { color: '#CD7F32', icon: 'medal-outline' }, // Bronce
];

export default function Ranking({ dificultad = 'medio' }) {
  const [resumen, setResumen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    calcularRankingPorDificultad(dificultad).then((res) => {
      if (isActive) {
        setResumen(res);
        setLoading(false);
      }
    });
    return () => { isActive = false; };
  }, [dificultad]);

  // Solo los 3 primeros para el podio
  const top3 = [resumen[0], resumen[1], resumen[2]];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      <View style={styles.podioContainer}>
        {top3.map((item, idx) => (
          <View key={idx} style={styles.podioRow}>
            <Ionicons
              name={medallas[idx].icon}
              size={28}
              color={medallas[idx].color}
              style={styles.medalla}
            />
            <Text style={styles.posicion}>{idx + 1}.</Text>
            <Text style={styles.nombre}>{item?.nombre || ''}</Text>
          </View>
        ))}
      </View>

      {/* Título de puntuaciones */}
      <Text style={styles.puntuacionesTitle}>Puntuaciones:</Text>

      {/* Tabla de puntuaciones */}
      <View style={styles.tablaContainer}>
        {loading ? (
          <View style={styles.tablaRowVacia}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.tablaTextoVacio}>Cargando...</Text>
          </View>
        ) : resumen.length === 0 ? (
          <View style={styles.tablaRowVacia}>
            <Text style={styles.tablaTextoVacio}>No hay datos para esta dificultad.</Text>
          </View>
        ) : (
          <>
            <View style={styles.tablaHeaderRow}>
              <View style={styles.tablaHeaderCellPosicion}>
                <Text style={styles.tablaHeaderText}>Pos.</Text>
              </View>
              <View style={styles.tablaHeaderCellNombre}>
                <Text style={styles.tablaHeaderText}>Nombre</Text>
              </View>
              <View style={styles.tablaHeaderCellVictorias}>
                <Text style={styles.tablaHeaderText}>Vict.</Text>
              </View>
              <View style={styles.tablaHeaderCellDerrotas}>
                <Text style={styles.tablaHeaderText}>Der.</Text>
              </View>
              <View style={styles.tablaHeaderCellPuntuacion}>
                <Text style={styles.tablaHeaderTextPuntuacion}>Puntuación</Text>
                <Text style={styles.tablaHeaderTextTotal}>Total</Text>
              </View>
            </View>
            {resumen.map((usuario, idx) => (
              <View key={usuario.nombre} style={styles.tablaDataRow}>
                <View style={styles.tablaHeaderCellPosicion}>
                  <Text style={styles.tablaDataText}>{idx + 1}</Text>
                </View>
                <View style={styles.tablaHeaderCellNombre}>
                  <Text style={styles.tablaDataText}>{usuario.nombre}</Text>
                </View>
                <View style={styles.tablaHeaderCellVictorias}>
                  <Text style={styles.tablaDataText}>{usuario.victorias}</Text>
                </View>
                <View style={styles.tablaHeaderCellDerrotas}>
                  <Text style={styles.tablaDataText}>{usuario.derrotas}</Text>
                </View>
                <View style={styles.tablaHeaderCellPuntuacion}>
                  <Text style={styles.tablaDataText}>{usuario.puntuacion}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  podioContainer: {
    width: '100%',
    marginTop: 6,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  podioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 6,
  },
  medalla: {
    marginRight: 8,
  },
  posicion: {
    fontSize: 20,
    color: '#fff',
    width: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nombre: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  puntuacionesTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  tablaContainer: {
    width: '100%',
    backgroundColor: 'rgba(24,26,32,0.97)',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 0,
    minHeight: 110,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  tablaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 4,
    marginBottom: 4,
  },
  tablaHeaderCellPosicion: {
    flex: 1.1,
    alignItems: 'center',
  },
  tablaHeaderCellNombre: {
    flex: 2.2,
    alignItems: 'center',
  },
  tablaHeaderCellVictorias: {
    flex: 1.3,
    alignItems: 'center',
  },
  tablaHeaderCellDerrotas: {
    flex: 1.3,
    alignItems: 'center',
  },
  tablaHeaderCellPuntuacion: {
    flex: 1.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tablaHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  tablaHeaderTextPuntuacion: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: -2,
  },
  tablaHeaderTextTotal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
    marginTop: -2,
  },
  tablaDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  tablaDataText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  tablaRowVacia: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tablaTextoVacio: {
    color: '#aaa',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 