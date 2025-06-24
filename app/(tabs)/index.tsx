import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Alert, Animated, Dimensions, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { usePlayer } from '../../context/PlayerContext';

const { width, height } = Dimensions.get('window');

// Componente para las partículas animadas
const FloatingParticle = ({ delay, duration, size, color, movementPattern }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Animación de aparición (0.8 segundos)
      const fadeIn = Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      });

      // Crear movimiento aleatorio basado en el patrón
      let moveY1, moveY2, moveX1, moveX2;
      
      switch (movementPattern) {
        case 0: // Movimiento circular
          moveY1 = -150; moveY2 = 150; moveX1 = -150; moveX2 = 150;
          break;
        case 1: // Movimiento diagonal
          moveY1 = -200; moveY2 = 200; moveX1 = 200; moveX2 = -200;
          break;
        case 2: // Movimiento en zigzag
          moveY1 = -100; moveY2 = 100; moveX1 = -200; moveX2 = 200;
          break;
        case 3: // Movimiento suave
          moveY1 = -80; moveY2 = 80; moveX1 = -80; moveX2 = 80;
          break;
        case 4: // Movimiento amplio
          moveY1 = -250; moveY2 = 250; moveX1 = -100; moveX2 = 100;
          break;
        default: // Movimiento aleatorio
          moveY1 = -180; moveY2 = 180; moveX1 = -180; moveX2 = 180;
      }

      // Animación principal con movimiento variado
      const mainAnimation = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: moveY1,
              duration: duration * 2,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: moveY2,
              duration: duration * 2,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: duration * 2,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: moveX1,
              duration: duration * 1.5,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: moveX2,
              duration: duration * 1.5,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: duration * 1.5,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);

      // Secuencia: aparecer -> animar -> desvanecer
      Animated.sequence([
        fadeIn,
        mainAnimation,
      ]).start();

      // Desvanecimiento al final del ciclo completo
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }).start(() => {
          // Reiniciar la animación después del desvanecimiento
          opacity.setValue(0);
          animatedValue.setValue(0);
          translateY.setValue(0);
          translateX.setValue(0);
          startAnimation();
        });
      }, duration * 2 + 800); // Tiempo total del ciclo
    };

    setTimeout(startAnimation, delay);
  }, [delay, duration, movementPattern]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          transform: [
            { translateY },
            { translateX },
            { scale },
          ],
        },
      ]}
    />
  );
};

export default function HomeScreen() {
  const { playerName, setPlayerName } = usePlayer();
  const router = useRouter();

  // Generar partículas con diferentes propiedades - usando useMemo para evitar regeneración
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      // Las primeras 6 partículas aparecen casi simultáneamente (0-200ms)
      // Las siguientes aparecen de forma escalonada
      const delay = index < 6 ? Math.random() * 200 : 300 + (index - 6) * 600;
      
      return {
        id: index,
        delay: delay,
        duration: 8000 + Math.random() * 4000, // Duración mucho más larga (8-12 segundos)
        size: 3 + Math.random() * 5, // Tamaños más pequeños
        color: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D'][Math.floor(Math.random() * 4)],
        x: Math.random() * width,
        y: Math.random() * height,
        movementPattern: Math.floor(Math.random() * 5),
      };
    });
  }, []); // Array vacío significa que solo se ejecuta una vez

  const handleStartGame = () => {
    if (playerName.trim() === '') {
      Alert.alert(
        '¡Advertencia!', 
        'Al haber ingresado sin nombre, sus resultados no podrán visualizarse en el ranking.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              // Navegar a la pantalla de juego sin nombre
              router.push('/game');
            }
          }
        ]
      );
      return;
    }
    // Si hay nombre, ir directamente al juego
    router.push({
      pathname: '/game',
      params: { playerName: playerName.trim() }
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.backgroundContainer}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={{ flex: 1 }}>
          {/* Fondo animado con partículas */}
          {particles.map((particle) => (
            <View
              key={particle.id}
              style={[
                styles.particleContainer,
                {
                  left: particle.x,
                  top: particle.y,
                },
              ]}
            >
              <FloatingParticle
                delay={particle.delay}
                duration={particle.duration}
                size={particle.size}
                color={particle.color}
                movementPattern={particle.movementPattern}
              />
            </View>
          ))}
          
          {/* Contenido principal */}
          <View style={styles.container}>
            {/* Título principal */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Mastermind</Text>
            </View>

            {/* Subtítulo */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Adivina el número secreto</Text>
            </View>

            {/* Caja gris con el campo de nombre */}
            <View style={styles.nameBox}>
              <Text style={styles.nameLabel}>Nombre:</Text>
              <TextInput
                style={styles.nameInput}
                placeholder="Ingresa tu nombre"
                placeholderTextColor="#888"
                value={playerName}
                onChangeText={text => { setPlayerName(text); }}
                returnKeyType="done"
                onSubmitEditing={handleStartGame}
              />
              <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                <Text style={styles.startButtonText}>Comenzar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    position: 'relative',
  },
  particleContainer: {
    position: 'absolute',
  },
  particle: {
    borderRadius: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginTop: '33%',
    zIndex: 1,
  },
  titleContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 3,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  subtitleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    textAlign: 'center',
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 1,
  },
  nameBox: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
  },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 40,
  },
  nameLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 0.5,
  },
  nameInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    fontWeight: '400',
  },
  startButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 1,
  },
});
