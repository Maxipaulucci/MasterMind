import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { agregarResultado } from '../data/rankingData';
import { generarNumeroAleatorio, verificarIntento } from '../utils/gameLogic';
import InputForm from './InputForm';
import ResultRow from './ResultRow';

export default function GameBoard({ onGameEnd, sinRepetir }) {
  const [numeroSecreto, setNumeroSecreto] = useState([]);
  const [intentos, setIntentos] = useState([]);
  const [intentoActual, setIntentoActual] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [intentosRestantes, setIntentosRestantes] = useState(10);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  useEffect(() => {
    const secreto = generarNumeroAleatorio(sinRepetir);
    setNumeroSecreto(secreto);
    console.log('Número secreto real:', secreto.join(''));
  }, [sinRepetir]);

  const manejarIntento = () => {
    if (intentoActual.length !== 4 || isNaN(intentoActual)) {
      Alert.alert('Error', 'Debes ingresar un número de 4 cifras.');
      return;
    }

    const resultado = verificarIntento(intentoActual, numeroSecreto);
    const nuevoIntento = {
      nro: intentoActual,
      resultado: `${resultado.bien}B ${resultado.regular}R ${resultado.mal}M`,
    };

    const nuevosIntentos = [...intentos, nuevoIntento];
    setIntentos(nuevosIntentos);
    setIntentosRestantes((prev) => prev - 1);

    if (resultado.bien === 4) {
      setMensaje('🎉 ¡Ganaste!');
      agregarResultado(true);
      setJuegoTerminado(true);
    } else if (intentosRestantes - 1 === 0) {
      setMensaje(`😞 Perdiste. El número era ${numeroSecreto.join('')}`);
      agregarResultado(false);
      setJuegoTerminado(true);
    }

    setIntentoActual('');
  };

  const reiniciarJuego = () => {
    setNumeroSecreto(generarNumeroAleatorio(sinRepetir));
    setIntentos([]);
    setIntentoActual('');
    setMensaje('');
    setIntentosRestantes(10);
    setJuegoTerminado(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Número: {juegoTerminado ? numeroSecreto.join('') : 'XXXX'}
      </Text>

      <FlatList
        data={intentos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ResultRow intento={item.nro} resultado={item.resultado} index={index + 1} />
        )}
        style={styles.lista}
      />

      {!juegoTerminado && (
        <InputForm intento={intentoActual} setIntento={setIntentoActual} onSubmit={manejarIntento} />
      )}

      <Text style={styles.mensaje}>{mensaje}</Text>

      {juegoTerminado && (
        <View style={styles.botones}>
          <TouchableOpacity style={styles.boton} onPress={reiniciarJuego}>
            <Text style={styles.botonTexto}>Jugar Otra Vez</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boton} onPress={onGameEnd}>
            <Text style={styles.botonTexto}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  lista: {
    flexGrow: 0,
    marginBottom: 10,
  },
  mensaje: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 12,
    color: '#FFFFFF',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  boton: {
    backgroundColor: '#5A67D8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 