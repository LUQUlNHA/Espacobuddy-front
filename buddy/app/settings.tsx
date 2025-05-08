import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useState } from 'react';

export default function Settings() {
  const [lowFoodAlert, setLowFoodAlert] = useState(true);
  const [feedingNotification, setFeedingNotification] = useState(false);

  return (
    <ScrollView style={styles.container}>

      {/* Seção de Alertas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas</Text>

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Alerta de pouca ração</Text>
            <Text style={styles.description}>
              Alerta quando a ração estiver acabando e não for suficiente para a próxima refeição.
            </Text>
          </View>
          <Switch value={lowFoodAlert} onValueChange={setLowFoodAlert} />
        </View>

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Notificação de alimentação</Text>
            <Text style={styles.description}>
              Alerta quando o alimentador do seu pet estiver prestes a começar uma refeição.
            </Text>
          </View>
          <Switch value={feedingNotification} onValueChange={setFeedingNotification} />
        </View>
      </View>

      {/* Seção de Informações de Perfil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações do Perfil</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value="Pedro"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value="pedro@gmail.com"
            editable={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    color: '#555',
  },
});

