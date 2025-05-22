import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useEffect, useState } from 'react';

// Importa funções utilitárias para acessar e decodificar o token JWT
import { getInfo, decodeToken } from '../utils/keycloak'; // ajuste o caminho se necessário

// Componente principal de configurações
export default function Settings() {
  // Estados locais para alternar configurações de notificações
  const [lowFoodAlert, setLowFoodAlert] = useState(true); // alerta de pouca ração
  const [feedingNotification, setFeedingNotification] = useState(false); // alerta de alimentação

  // Estados para exibir informações do usuário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Função assíncrona que busca o token salvo localmente e extrai dados do usuário
  const getUserInfo = async () => {
    const token = await getInfo('access_token'); // busca token armazenado com SecureStore
    if (!token) return;

    const decoded = await decodeToken(token); // decodifica JWT
    if (decoded) {
      // Define os dados no estado, se disponíveis
      setName(decoded.given_name || decoded.name || '');
      setEmail(decoded.email || decoded.preferred_username || '');
    }
  };

  // Executa ao montar o componente para carregar dados do perfil
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Seção de alertas configuráveis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas</Text>

        {/* Alerta de pouca ração */}
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Alerta de pouca ração</Text>
            <Text style={styles.description}>
              Alerta quando a ração estiver acabando e não for suficiente para a próxima refeição.
            </Text>
          </View>
          <Switch value={lowFoodAlert} onValueChange={setLowFoodAlert} />
        </View>

        {/* Alerta de alimentação */}
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

      {/* Seção de dados do perfil extraídos do token */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações do Perfil</Text>

        {/* Campo Nome */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            editable={false} // campo apenas leitura
          />
        </View>

        {/* Campo Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false} // campo apenas leitura
          />
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos do componente
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
