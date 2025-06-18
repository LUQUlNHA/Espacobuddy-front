import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';

import { getInfo, decodeToken } from '../utils/keycloak';
import { getByUserId } from '../utils/database'; // certifique-se de que essa função está implementada

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Tela de configurações do app, onde o usuário pode alterar configurações de
 * alertas e notificações, e visualizar informações do seu perfil.
 *

 */
export default function Settings() {
  const [lowFoodAlert, setLowFoodAlert] = useState(true);
  const [feedingNotification, setFeedingNotification] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [stockKg, setStockKg] = useState(''); // novo estado

  const getUserInfo = async () => {
    const token = await getInfo('access_token');
    if (!token) return;

    const decoded = await decodeToken(token);
    if (decoded) {
      setName(decoded.given_name || decoded.name || '');
      setEmail(decoded.email || decoded.preferred_username || '');

      const userId = decoded.sub;

      try {
        const feederData = await getByUserId('user_feeders', userId);
        if (feederData?.stock_kg !== undefined && feederData?.stock_kg !== null) {
          setStockKg(`${feederData.stock_kg} kg`);
        } else {
          setStockKg('Não informado');
        }
      } catch (error) {
        console.log('Erro ao buscar ração:', error);
        setStockKg('Erro ao carregar');
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações do Perfil</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ração total disponível</Text>
          <TextInput
            style={styles.input}
            value={stockKg}
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
