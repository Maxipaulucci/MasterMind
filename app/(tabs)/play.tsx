import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { usePlayer } from '../../context/PlayerContext';
import { agregarResultado } from '../../data/rankingData';
import { verificarIntento } from '../../utils/gameLogic';

const { width, height } = Dimensions.get('window');

// Componente de partícula de confeti
const ConfettiParticle = ({ delay, color, startX, startY }: { delay: number; color: string; startX: number; startY: number }) => {
  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(startX);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const startAnimation = () => {
      scale.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(height + 100, { duration: 3500 + Math.random() * 2000 });
      translateX.value = withTiming(startX + (Math.random() - 0.5) * 200, { duration: 3500 + Math.random() * 2000 });
      rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 });
      }, 3000);
    };
    setTimeout(startAnimation, delay);
  }, [delay, startX, startY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

export default function PlayScreen() {
  const router = useRouter();
  const { difficulty: initialDifficulty } = useLocalSearchParams();
  const { playerName } = usePlayer();
  const dificultadParam = Array.isArray(initialDifficulty) ? initialDifficulty[0] : initialDifficulty;
  const nombreJugador = typeof playerName === 'string' ? playerName : '';
  const [difficulty, setDifficulty] = useState(dificultadParam || 'medio');
  const [numeroSecreto, setNumeroSecreto] = useState<number[]>([]);
  const [intentos, setIntentos] = useState<any[]>([]);
  const [intentoActual, setIntentoActual] = useState('');
  const [intentosRestantes, setIntentosRestantes] = useState(15);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinalButtons, setShowFinalButtons] = useState(false);
  const finalSheetTranslateY = useSharedValue(400);
  
  // Animaciones
  const victoryScale = useSharedValue(1);
  const numberRevealScale = useSharedValue(1);
  const numberRevealOpacity = useSharedValue(1);

  // Audio
  const soundRef = useRef<Audio.Sound>();

  useEffect(() => {
    loadVictorySound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadVictorySound = async () => {
    try {
      // TODO: Agregar archivo de sonido de victoria
      // const { sound } = await Audio.Sound.createAsync(
      //   require('../../assets/sounds/victory.mp3')
      // );
      // soundRef.current = sound;
    } catch (error) {
      console.log('Error loading sound:', error);
    }
  };

  const playVictorySound = async () => {
    try {
      // TODO: Reproducir sonido cuando se agregue el archivo
      // if (soundRef.current) {
      //   await soundRef.current.replayAsync();
      // }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Estado para mostrar el número máximo de intentos en la UI
  const [intentosMaximos, setIntentosMaximos] = useState(15);

  const configurarJuego = (dificultad: string) => {
    let intentosMaximos = 15;
    let sinRepetir = true;
    let sinCero = true;

    switch (dificultad) {
      case 'facil':
        intentosMaximos = 20;
        sinRepetir = true;
        sinCero = true;
        break;
      case 'medio':
        intentosMaximos = 15;
        sinRepetir = true;
        sinCero = true;
        break;
      case 'dificil':
        intentosMaximos = 10;
        sinRepetir = false;
        sinCero = false;
        break;
    }

    setIntentosMaximos(intentosMaximos);
    setIntentosRestantes(intentosMaximos);
    const nuevoNumero = generarNumeroPersonalizado(sinRepetir, sinCero);
    setNumeroSecreto(nuevoNumero);
    console.log('numero secreto:', nuevoNumero.join(''));
  };

  // Nueva función para generar el número según reglas
  function generarNumeroPersonalizado(sinRepetir: boolean, sinCero: boolean): number[] {
    let numeros: number[] = [];
    let digitos = sinCero ? [1,2,3,4,5,6,7,8,9] : [0,1,2,3,4,5,6,7,8,9];
    if (sinRepetir) {
      for (let i = 0; i < 4; i++) {
        const indice = Math.floor(Math.random() * digitos.length);
        numeros.push(digitos[indice]);
        digitos.splice(indice, 1);
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const indice = Math.floor(Math.random() * digitos.length);
        numeros.push(digitos[indice]);
      }
    }
    return numeros;
  }

  useEffect(() => {
    let intentos = 15;
    let sinRepetir = true;
    let sinCero = true;
    switch (difficulty) {
      case 'facil':
        intentos = 20;
        sinRepetir = true;
        sinCero = true;
        break;
      case 'medio':
        intentos = 15;
        sinRepetir = true;
        sinCero = true;
        break;
      case 'dificil':
        intentos = 10;
        sinRepetir = false;
        sinCero = false;
        break;
    }
    setIntentosMaximos(intentos);
    setIntentosRestantes(intentos);
    const nuevoNumero = generarNumeroPersonalizado(sinRepetir, sinCero);
    setNumeroSecreto(nuevoNumero);
    setIntentos([]);
    setJuegoTerminado(false);
    setMensaje('');
    setIntentoActual('');
    setShowConfetti(false);
  }, [difficulty]);

  const triggerVictoryAnimations = () => {
    playVictorySound();
    setShowConfetti(true);
    setShowFinalButtons(false);
    // Animación del número revelándose (más llamativa)
    numberRevealScale.value = withSequence(
      withTiming(1.5, { duration: 350 }),
      withSpring(0.8, { damping: 5, stiffness: 80 }),
      withSpring(1.2, { damping: 8, stiffness: 120 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );
    // Animación de victoria (más rebote y escala)
    victoryScale.value = withSequence(
      withTiming(1.4, { duration: 250 }),
      withSpring(0.9, { damping: 6, stiffness: 90 }),
      withSpring(1.1, { damping: 8, stiffness: 120 }),
      withSpring(1, { damping: 12, stiffness: 120 })
    );
    // Ocultar confeti después de 4 segundos y mostrar botones
    setTimeout(() => {
      setShowConfetti(false);
      setShowFinalButtons(true);
    }, 4000);
  };

  const reiniciarJuego = () => {
    setIntentos([]);
    let intentosIniciales = 15;
    let sinRepetir = true;
    let sinCero = true;
    switch (difficulty) {
      case 'facil':
        intentosIniciales = 20;
        sinRepetir = true;
        sinCero = true;
        break;
      case 'medio':
        intentosIniciales = 15;
        sinRepetir = true;
        sinCero = true;
        break;
      case 'dificil':
        intentosIniciales = 10;
        sinRepetir = false;
        sinCero = false;
        break;
      default:
        intentosIniciales = 15;
    }
    setIntentosRestantes(intentosIniciales);
    setJuegoTerminado(false);
    setMensaje('');
    setIntentoActual('');
    setShowConfetti(false);
    setShowFinalButtons(false);
    setPistaUsada(false);
    setPosicionPista(null);
    // Generar nuevo número secreto
    const nuevoNumero = generarNumeroPersonalizado(sinRepetir, sinCero);
    setNumeroSecreto(nuevoNumero);
    console.log('numero secreto:', nuevoNumero.join(''));
    setShowOverlay(false);
  };

  const finalizarJuego = () => {
    setShowFinalButtons(false);
    setShowOverlay(false);
    setTimeout(() => {
      router.push('/game');
    }, 300);
  };

  const manejarIntento = async () => {
    if (intentoActual.length !== 4 || isNaN(Number(intentoActual))) {
      return;
    }
    const resultado = verificarIntento(intentoActual, numeroSecreto);
    const nuevoIntento = {
      nro: intentoActual,
      bien: resultado.bien,
      regular: resultado.regular,
      mal: resultado.mal,
    };
    setIntentos([...intentos, nuevoIntento]);
    setIntentosRestantes((prev) => prev - 1);
    setMensaje('');
    if (resultado.bien === 4) {
      setShowOverlay(true);
      setJuegoTerminado(true);
      setMensaje('¡Ganaste!');
      if (nombreJugador.trim() !== '') {
        await agregarResultado(nombreJugador, difficulty as 'facil' | 'medio' | 'dificil', true);
      }
      triggerVictoryAnimations();
      setShowFinalButtons(true);
    } else if (intentosRestantes - 1 === 0) {
      setShowOverlay(true);
      setJuegoTerminado(true);
      setMensaje(`😞 Perdiste. El número era ${numeroSecreto.join('')}`);
      if (nombreJugador.trim() !== '') {
        await agregarResultado(nombreJugador, difficulty as 'facil' | 'medio' | 'dificil', false);
      }
      setShowFinalButtons(true);
    }
    setIntentoActual('');
    Keyboard.dismiss();
  };

  const manejarRendirse = () => {
    setShowOverlay(true);
    setJuegoTerminado(true);
    setShowFinalButtons(false);
    setMensaje(`😞 Te rendiste. El número era ${numeroSecreto.join('')}`);
    Alert.alert(
      '¡Casi lo logras!',
      `Mejor suerte la próxima vez! 😊\n\nTe quedaban ${intentosRestantes} intentos.\nEl número era: ${numeroSecreto.join('')}`,
      [
        {
          text: 'Aceptar',
          onPress: async () => {
            if (nombreJugador.trim() !== '') {
              await agregarResultado(nombreJugador, difficulty as 'facil' | 'medio' | 'dificil', false);
            }
            setShowFinalButtons(true);
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={styles.rowIndex}>{index + 1}</Text>
      <Text style={styles.rowNumber}>{item.nro}</Text>
      <View style={[styles.resultBox, styles.bienBox]}>
        <Text style={styles.bienText}>{item.bien}B</Text>
      </View>
      <View style={[styles.resultBox, styles.regularBox]}>
        <Text style={styles.regularText}>{item.regular}R</Text>
      </View>
      <View style={[styles.resultBox, styles.malBox]}>
        <Text style={styles.malText}>{item.mal}M</Text>
      </View>
    </View>
  );

  // Estilos animados
  const victoryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: victoryScale.value }],
  }));

  const numberRevealAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberRevealScale.value }],
  }));

  useEffect(() => {
    if (showFinalButtons) {
      finalSheetTranslateY.value = withTiming(0, { duration: 400 });
    } else {
      finalSheetTranslateY.value = 400;
    }
  }, [showFinalButtons]);

  const finalSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: finalSheetTranslateY.value }],
  }));

  // Estado para la pista revelada
  const [pistaUsada, setPistaUsada] = useState(false);
  const [posicionPista, setPosicionPista] = useState<number|null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setDifficulty(dificultadParam || 'medio');
      setIntentos([]);
      let intentosIniciales = 15;
      let sinRepetir = true;
      let sinCero = true;
      switch (dificultadParam) {
        case 'facil':
          intentosIniciales = 20;
          sinRepetir = true;
          sinCero = true;
          break;
        case 'medio':
          intentosIniciales = 15;
          sinRepetir = true;
          sinCero = true;
          break;
        case 'dificil':
          intentosIniciales = 10;
          sinRepetir = false;
          sinCero = false;
          break;
        default:
          intentosIniciales = 15;
      }
      setIntentosRestantes(intentosIniciales);
      setJuegoTerminado(false);
      setMensaje('');
      setIntentoActual('');
      setShowConfetti(false);
      setShowFinalButtons(false);
      setPistaUsada(false);
      setPosicionPista(null);
      // Generar nuevo número secreto
      const nuevoNumero = generarNumeroPersonalizado(sinRepetir, sinCero);
      setNumeroSecreto(nuevoNumero);
      console.log('numero secreto:', nuevoNumero.join(''));
    }, [dificultadParam])
  );

  // Función para usar la pista
  const usarPista = () => {
    if (numeroSecreto.length === 4 && !pistaUsada) {
      const pos = Math.floor(Math.random() * 4);
      setPosicionPista(pos);
      setPistaUsada(true);
    }
  };

  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <View style={styles.container}>
      {showOverlay && (
        <View style={styles.overlay} pointerEvents="box-none" />
      )}
      {/* Confeti */}
      {showConfetti && (
        <View style={styles.confettiContainer}>
          {Array.from({ length: 60 }).map((_, index) => (
            <ConfettiParticle
              key={index}
              delay={index * 35}
              color={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)]}
              startX={Math.random() * width}
              startY={-50}
            />
          ))}
        </View>
      )}

      {/* Encabezado */}
      <View style={styles.headerBox}>
        {/* Botón de pista solo en fácil, si no se usó y el juego no terminó */}
        {difficulty === 'facil' && !pistaUsada && !juegoTerminado && (
          <TouchableOpacity style={styles.pistaButton} onPress={usarPista}>
            <Ionicons name="bulb-outline" size={22} color="#FFD600" />
          </TouchableOpacity>
        )}
        <Animated.Text style={[styles.headerNumber, numberRevealAnimatedStyle]}>
          {/* Mostrar el número con la pista si corresponde */}
          {juegoTerminado
            ? numeroSecreto.join('')
            : numeroSecreto.map((dig, idx) =>
                posicionPista === idx ? dig : 'X'
              ).join('')}
        </Animated.Text>
        <Text style={styles.headerIntentos}>Intentos restantes: {intentosRestantes} / {intentosMaximos}</Text>
      </View>

      {/* Historial de intentos */}
      <FlatList
        data={intentos}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        style={styles.historyList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Input y botones */}
      {!juegoTerminado && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={styles.inputBoxWrapper}>
            <View style={styles.inputBox}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={intentoActual}
                  onChangeText={setIntentoActual}
                  placeholder="1234"
                  placeholderTextColor="#888"
                  returnKeyType="done"
                  onSubmitEditing={manejarIntento}
                />
                <TouchableOpacity style={styles.ingresarButton} onPress={manejarIntento}>
                  <Text style={styles.ingresarButtonText}>Ingresar</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.rendirseButton} onPress={manejarRendirse}>
                <Text style={styles.rendirseButtonText}>Rendirse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Mensaje final con animación */}
      {/* No mostrar cartel de '¡Ganaste!' */}

      {/* Botones finales después del confeti en un modal tipo pestañita */}
      {showFinalButtons && (
        <View style={styles.finalModalOverlay}>
          <Animated.View style={[styles.finalModalContent, finalSheetAnimatedStyle]}>
            <Text style={styles.finalModalTitle}>¿Qué quieres hacer?</Text>
            <View style={styles.finalButtonsContainer}>
              <TouchableOpacity style={styles.finalButton} onPress={reiniciarJuego}>
                <Text style={styles.finalButtonText}>Volver a jugar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.finalButton} onPress={finalizarJuego}>
                <Text style={styles.finalButtonText}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confettiParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inputBoxWrapper: {
    marginBottom: 20,
    marginTop: 20,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  headerNumber: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 10,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  headerIntentos: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 8,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  rowIndex: {
    width: 28,
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rowNumber: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
  },
  resultBox: {
    minWidth: 38,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginLeft: 6,
  },
  bienBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.18)',
  },
  regularBox: {
    backgroundColor: 'rgba(255, 193, 7, 0.18)',
  },
  malBox: {
    backgroundColor: 'rgba(244, 67, 54, 0.18)',
  },
  bienText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  regularText: {
    color: '#FFC107',
    fontWeight: 'bold',
    fontSize: 16,
  },
  malText: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#222',
    fontSize: 20,
    paddingHorizontal: 16,
    marginRight: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
  ingresarButton: {
    backgroundColor: '#2E86AB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingresarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rendirseButton: {
    marginTop: 4,
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rendirseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  mensaje: {
    marginTop: 10,
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  finalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  finalButton: {
    backgroundColor: '#45B7D1', // Turquesa
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    minWidth: 130,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  finalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  finalModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
  },
  finalModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 30,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
  },
  finalModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  pistaButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 10,
  },
}); 