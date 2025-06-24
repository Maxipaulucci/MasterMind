import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RankingItem {
  nombre: string;
  dificultad: 'facil' | 'medio' | 'dificil';
  ganado: boolean;
  fecha?: Date;
}

export interface RankingResumen {
  nombre: string;
  victorias: number;
  derrotas: number;
  puntuacion: number;
}

const RANKING_KEY = 'mastermind_ranking';

export async function cargarRanking(): Promise<RankingItem[]> {
  const data = await AsyncStorage.getItem(RANKING_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

export async function agregarResultado(nombre: string, dificultad: 'facil' | 'medio' | 'dificil', ganado: boolean): Promise<void> {
  const nuevoResultado: RankingItem = {
    nombre,
    dificultad,
    ganado,
    fecha: new Date(),
  };
  const ranking = await cargarRanking();
  ranking.push(nuevoResultado);
  if (ranking.length > 50) {
    ranking.splice(0, ranking.length - 50);
  }
  await AsyncStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
}

export async function limpiarRanking(): Promise<void> {
  await AsyncStorage.setItem(RANKING_KEY, JSON.stringify([]));
}

export function obtenerRankingSync(): Promise<RankingItem[]> {
  return cargarRanking();
}

/**
 * Calcula el ranking agrupado por usuario para una dificultad dada.
 * @param dificultad 'facil' | 'medio' | 'dificil'
 * @returns Array de RankingResumen ordenado por puntuación descendente
 */
export async function calcularRankingPorDificultad(dificultad: 'facil' | 'medio' | 'dificil'): Promise<RankingResumen[]> {
  const ranking = await cargarRanking();
  const filtrados = ranking.filter(item => item.dificultad === dificultad);
  const resumenPorUsuario: { [nombre: string]: RankingResumen } = {};

  filtrados.forEach(item => {
    if (!resumenPorUsuario[item.nombre]) {
      resumenPorUsuario[item.nombre] = {
        nombre: item.nombre,
        victorias: 0,
        derrotas: 0,
        puntuacion: 0,
      };
    }
    if (item.ganado) {
      resumenPorUsuario[item.nombre].victorias += 1;
      if (dificultad === 'facil') resumenPorUsuario[item.nombre].puntuacion += 1;
      if (dificultad === 'medio') resumenPorUsuario[item.nombre].puntuacion += 2;
      if (dificultad === 'dificil') resumenPorUsuario[item.nombre].puntuacion += 3;
    } else {
      resumenPorUsuario[item.nombre].derrotas += 1;
      if (dificultad === 'facil') resumenPorUsuario[item.nombre].puntuacion -= 3;
      if (dificultad === 'medio') resumenPorUsuario[item.nombre].puntuacion -= 2;
      if (dificultad === 'dificil') resumenPorUsuario[item.nombre].puntuacion -= 1;
    }
  });

  return Object.values(resumenPorUsuario).sort((a, b) => b.puntuacion - a.puntuacion);
} 