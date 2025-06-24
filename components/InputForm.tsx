import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePlayer } from '../context/PlayerContext';

export default function InputForm({ onSubmit, ...props }) {
  const { playerName, setPlayerName } = usePlayer();

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={4}
        value={playerName}
        onChangeText={text => { setPlayerName(text); console.log('Nuevo nombre:', text); }}
        placeholder="1234"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.boton} onPress={() => onSubmit(playerName)}>
        <Text style={styles.botonTexto}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#2A2A2A',
    padding: 10,
    width: 100,
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    borderRadius: 8,
    marginRight: 10,
  },
  boton: {
    backgroundColor: '#5A67D8',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 