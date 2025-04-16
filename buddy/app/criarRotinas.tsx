import { View, Text, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function CriarRotina() {
  const [hora, setHora] = useState(new Date());

  const handleAjustarHora = () => {
    const novaHora = new Date();
    novaHora.setHours(hora.getHours() + 1); //adiciona 1h hehe
    setHora(novaHora);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajuste de Hora</Text>
      <Text style={styles.timeText}>Hora atual: {hora.toLocaleTimeString()}</Text>
      <Button title="Ajustar Hora" onPress={handleAjustarHora} color="#008080" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
});
