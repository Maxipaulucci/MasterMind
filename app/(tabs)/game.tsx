import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePlayer } from '../../context/PlayerContext';

export default function GameScreen() {
  const { playerName: initialPlayerName } = useLocalSearchParams();
  const router = useRouter();
  const { playerName, setPlayerName } = usePlayer();
  const [showRules, setShowRules] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [difficulty, setDifficulty] = useState('medio'); // Predeterminado: medio
  const [rulesDifficulty, setRulesDifficulty] = useState('medio'); // Para las reglas en el modal
  const [showChangeName, setShowChangeName] = useState(false);
  const [newName, setNewName] = useState('');
  
  // Inicializar el nombre del jugador desde los parámetros de la URL solo una vez
  useEffect(() => {
    if (initialPlayerName && !playerName) {
      setPlayerName(initialPlayerName);
    }
  }, [initialPlayerName, playerName, setPlayerName]);
  
  const handleJugar = () => {
    router.push({ pathname: '/play', params: { difficulty } });
  };

  const handleReglas = () => {
    setRulesDifficulty(difficulty);
    setShowRules(true);
  };

  const handleRanking = () => {
    router.push({ pathname: '/ranking', params: { dificultad: difficulty } });
  };

  const handleEstadisticas = () => {
    router.push('/estadisticas');
  };

  const handleDifficulty = () => {
    setShowDifficulty(true);
  };

  const closeRules = () => {
    setShowRules(false);
  };

  const closeDifficulty = () => {
    setShowDifficulty(false);
  };

  const selectDifficulty = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
    setShowDifficulty(false);
  };

  const selectRulesDifficulty = (selectedDifficulty: string) => {
    setRulesDifficulty(selectedDifficulty);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'facil':
        return '#4CAF50'; // Verde
      case 'medio':
        return '#FFC107'; // Amarillo
      case 'dificil':
        return '#F44336'; // Rojo
      default:
        return '#FFC107'; // Amarillo por defecto
    }
  };

  const getDifficultyText = () => {
    switch (difficulty) {
      case 'facil':
        return 'Fácil';
      case 'medio':
        return 'Medio';
      case 'dificil':
        return 'Difícil';
      default:
        return 'Medio';
    }
  };

  const getRulesByDifficulty = () => {
    switch (rulesDifficulty) {
      case 'facil':
        return `1. El juego genera un número secreto de 4 cifras.\n
2. El número secreto no contiene dígitos repetidos ni el numero 0.\n
3. Tienes 20 intentos para adivinar el número.\n
4. Después de cada intento, recibirás pistas:
* B: Dígito correcto en la posición correcta
* R: Dígito correcto en posición incorrecta
* M: Dígito incorrecto\n
5. Tienes una pista la cual te brindara un numero de los 4 secretos.\n
6. Si te rindes, se contará como una derrota.\n
7. ¡Diviértete y buena suerte!`;
      
      case 'medio':
        return `1. El juego genera un número secreto de 4 cifras.\n
2. El número secreto no contiene dígitos repetidos ni el numero 0.\n
3. Tienes 15 intentos para adivinar el número.\n
4. Después de cada intento, recibirás pistas:
* B: Dígito correcto en la posición correcta
* R: Dígito correcto en posición incorrecta
* M: Dígito incorrecto\n
5. Si te rindes, se contará como una derrota.\n
6. ¡Diviértete y buena suerte!`;
      
      case 'dificil':
        return `1. El juego genera un número secreto de 4 cifras.\n
2. El número secreto puede contener dígitos repetidos y/o el numero 0.\n
3. Tienes 10 intentos para adivinar el número.\n
4. Después de cada intento, recibirás pistas:
* B: Dígito correcto en la posición correcta
* R: Dígito correcto en posición incorrecta
* M: Dígito incorrecto\n
5. Si te rindes, se contará como una derrota.\n
6. ¡Diviértete y buena suerte!`;
      
      default:
        return `1. El juego genera un número secreto de 4 cifras.
2. El número secreto no contiene dígitos repetidos ni el numero 0.
3. Tienes 15 intentos para adivinar el número.
4. Después de cada intento, recibirás pistas:
* B: Dígito correcto en la posición correcta
* R: Dígito correcto en posición incorrecta
* M: Dígito incorrecto
5. Si te rindes, se contará como una derrota.
6. ¡Diviértete y buena suerte!`;
    }
  };

  // Cambiar nombre
  const handleOpenChangeName = () => {
    setNewName('');
    setShowChangeName(true);
  };
  const handleAcceptChangeName = () => {
    if (newName.trim() === '') {
      Alert.alert(
        '¡Advertencia!',
        'Al haber ingresado sin nombre, sus resultados no podrán visualizarse en el ranking.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              setPlayerName('');
              setShowChangeName(false);
            },
          },
        ]
      );
      return;
    }
    setPlayerName(newName.trim());
    console.log('Nombre cambiado en game.tsx:', newName.trim());
    setShowChangeName(false);
  };
  const handleCancelChangeName = () => {
    setShowChangeName(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoRow}>
        <TouchableOpacity style={styles.userLogoButton} onPress={handleOpenChangeName}>
          <View style={styles.userLogoCircle}>
            <Ionicons name="person" size={28} color="#2E86AB" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* Mensaje de bienvenida */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            ¡Bienvenido{playerName ? ` ${playerName}` : ''}!
          </Text>
        </View>

        {/* Botones de juego */}
        <View style={styles.buttonsContainer}>
          {/* Botones superiores */}
          <View style={styles.topButtonsRow}>
            <TouchableOpacity style={styles.button} onPress={handleJugar}>
              <Text style={styles.buttonText}>Jugar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: getDifficultyColor() }]} 
              onPress={handleDifficulty}
            >
              <Text style={styles.buttonText}>{getDifficultyText()}</Text>
            </TouchableOpacity>
          </View>

          {/* Botones inferiores */}
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity style={styles.button} onPress={handleReglas}>
              <Text style={styles.buttonText}>Reglas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={handleRanking}>
              <Text style={styles.buttonText}>Ranking</Text>
            </TouchableOpacity>
          </View>

          {/* Botón de estadísticas */}
          <View style={styles.statsButtonRow}>
            <TouchableOpacity style={styles.button} onPress={handleEstadisticas}>
              <Text style={styles.buttonText}>Estadísticas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de Reglas */}
        <Modal
          visible={showRules}
          transparent={true}
          animationType="fade"
          onRequestClose={closeRules}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Botón de cerrar */}
              <TouchableOpacity style={styles.closeButton} onPress={closeRules}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>

              {/* Título */}
              <Text style={styles.modalTitle}>Reglas del Juego</Text>

              {/* Contenido de las reglas */}
              <ScrollView 
                style={styles.rulesContent} 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.rulesScrollContent}
              >
                <Text style={styles.ruleText}>
                  {getRulesByDifficulty()}
                </Text>
              </ScrollView>

              {/* Botones de dificultad */}
              <View style={styles.rulesDifficultyButtons}>
                <View style={styles.rulesDifficultyButtonContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.rulesDifficultyButton, 
                      { backgroundColor: '#4CAF50' },
                      rulesDifficulty === 'facil' && styles.selectedRulesDifficulty
                    ]}
                    onPress={() => selectRulesDifficulty('facil')}
                  >
                    <Text style={styles.rulesDifficultyButtonText}>Fácil</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.rulesDifficultyButtonContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.rulesDifficultyButton, 
                      { backgroundColor: '#FFC107' },
                      rulesDifficulty === 'medio' && styles.selectedRulesDifficulty
                    ]}
                    onPress={() => selectRulesDifficulty('medio')}
                  >
                    <Text style={styles.rulesDifficultyButtonText}>Medio</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.rulesDifficultyButtonContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.rulesDifficultyButton, 
                      { backgroundColor: '#F44336' },
                      rulesDifficulty === 'dificil' && styles.selectedRulesDifficulty
                    ]}
                    onPress={() => selectRulesDifficulty('dificil')}
                  >
                    <Text style={styles.rulesDifficultyButtonText}>Difícil</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botón Aceptar */}
              <TouchableOpacity style={styles.acceptButton} onPress={closeRules}>
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de Dificultad */}
        <Modal
          visible={showDifficulty}
          transparent={true}
          animationType="fade"
          onRequestClose={closeDifficulty}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.difficultyModalContent}>
              {/* Título */}
              <Text style={styles.modalTitle}>Seleccionar Dificultad</Text>

              {/* Opciones de dificultad */}
              <View style={styles.difficultyOptions}>
                <TouchableOpacity 
                  style={[
                    styles.difficultyButton, 
                    { backgroundColor: '#4CAF50' },
                    difficulty === 'facil' && styles.selectedDifficulty
                  ]} 
                  onPress={() => selectDifficulty('facil')}
                >
                  <Text style={styles.difficultyButtonText}>Fácil</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.difficultyButton, 
                    { backgroundColor: '#FFC107' },
                    difficulty === 'medio' && styles.selectedDifficulty
                  ]} 
                  onPress={() => selectDifficulty('medio')}
                >
                  <Text style={styles.difficultyButtonText}>Medio</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.difficultyButton, 
                    { backgroundColor: '#F44336' },
                    difficulty === 'dificil' && styles.selectedDifficulty
                  ]} 
                  onPress={() => selectDifficulty('dificil')}
                >
                  <Text style={styles.difficultyButtonText}>Difícil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de cambio de nombre */}
        <Modal
          visible={showChangeName}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelChangeName}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.changeNameModalContent}>
              <Text style={styles.modalTitle}>¿Cambiar nombre?</Text>
              <TextInput
                style={styles.changeNameInput}
                placeholder="Nuevo nombre"
                placeholderTextColor="#bbb"
                value={newName}
                onChangeText={setNewName}
                autoFocus
                maxLength={20}
              />
              <View style={styles.changeNameButtonsRow}>
                <TouchableOpacity style={[styles.acceptButton, {flex: 1, marginRight: 8}]} onPress={handleAcceptChangeName}>
                  <Text style={styles.acceptButtonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cancelButton, {flex: 1, marginLeft: 8}]} onPress={handleCancelChangeName}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10,
    zIndex: 10,
  },
  userLogoButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  userLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E86AB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  topButtonsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statsButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2E86AB',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    height: 600,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2E86AB',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  rulesContent: {
    flex: 1,
    marginBottom: 25,
  },
  rulesScrollContent: {
    paddingVertical: 10,
  },
  ruleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  acceptButton: {
    backgroundColor: '#2E86AB',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  difficultyModalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    height: 300,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: 'space-between',
  },
  difficultyOptions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  difficultyButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  difficultyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  selectedDifficulty: {
    borderColor: '#333',
    borderWidth: 3,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  rulesDifficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 10,
  },
  rulesDifficultyButtonContainer: {
    width: '30%',
    padding: 2,
  },
  rulesDifficultyButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 45,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rulesDifficultyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    textAlign: 'center',
  },
  selectedRulesDifficulty: {
    borderColor: '#333',
    borderWidth: 2,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  changeNameModalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  changeNameInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'rgba(240,240,240,0.95)',
    marginBottom: 20,
    color: '#333',
    fontWeight: '400',
  },
  changeNameButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
    gap: 0,
  },
  cancelButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#2E86AB',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 