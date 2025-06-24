import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ResultRow({ intento, resultado, index }) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{index}</Text>
      <Text style={styles.text}>{intento}</Text>
      <Text style={styles.text}>{resultado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1e1e1e',
  },
  text: {
    fontSize: 16,
    color: '#e0e0e0',
  },
}); 