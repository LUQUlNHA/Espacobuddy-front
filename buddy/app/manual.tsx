// Importa componentes essenciais do React Native
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// Hooks do React
import { useEffect, useState } from 'react';

// Ícones da biblioteca Expo
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Hook de navegação da Expo Router
import { useRouter } from 'expo-router';

// Funções auxiliares para autenticação e acesso ao Keycloak
import { decodeToken, getInfo } from '../utils/keycloak';

// Função genérica para consultar o banco de dados
import { listTable } from '../utils/database';

export default function DevicePairing() {
  const router = useRouter(); // Controle de navegação
  const [devices, setDevices] = useState([]); // Lista de dispositivos emparelhados do usuário

  // Carrega os dispositivos emparelhados assim que o componente monta
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getInfo("access_token"); // Recupera o token JWT do armazenamento seguro
        const decodedToken = await decodeToken(token); // Decodifica o token
        const userId = decodedToken.sub; // Extrai o ID do usuário (campo `sub`)

        // Busca alimentadores vinculados ao usuário no banco
        const result = await listTable("user_feeders", { user_id: userId });

        // Mapeia os resultados em um array de objetos com id e apelido
        const devices = result.data.map((entry, index) => {
          const feeder = {
            id: entry.feeder_id,
            nickname: entry.nickname,
          };
          return feeder;
        });

        setDevices(devices); // Atualiza o estado com os dispositivos encontrados
      } catch (err) {
        console.error("Erro ao buscar dispositivos:", err);
      }
    };

    fetchDevices();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho da tela com botão de voltar, título e avatar do usuário */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Emparelhar Dispositivo</Text>
        <View style={styles.headerRight}>
          <Ionicons name="bar-chart-outline" size={20} style={styles.icon} />
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profilePic}
          />
        </View>
      </View>

      {/* Lista os dispositivos emparelhados com imagem e nome */}
      {devices.map((device, index) => (
        <View style={styles.deviceBox} key={device.id}>
          <Image
            source={require('../assets/images/alimentador.jpeg')}
            style={styles.deviceImage}
          />
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.nickname || `Alimentador ${index + 1}`}</Text>
          </View>
          <MaterialIcons name="menu" size={24} />
        </View>
      ))}

      {/* Botão para adicionar novo dispositivo */}
      <TouchableOpacity style={styles.addBox}>
        <Ionicons name="image-outline" size={32} color="#ccc" />
        <View style={styles.addInfo}>
          <Text style={styles.addText}>Adicionar aparelho</Text>
        </View>
        <Ionicons name="add-circle-outline" size={24} />
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos para a interface
const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 15, backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20
  },
  title: {
    fontSize: 16, fontWeight: 'bold'
  },
  headerRight: {
    flexDirection: 'row', alignItems: 'center'
  },
  icon: {
    marginRight: 10
  },
  profilePic: {
    width: 32, height: 32, borderRadius: 16
  },
  deviceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 15
  },
  deviceImage: {
    width: 50, height: 50, borderRadius: 10, marginRight: 15
  },
  deviceInfo: {
    flex: 1
  },
  deviceName: {
    fontWeight: 'bold'
  },
  deviceStatus: {
    color: '#888'
  },
  addBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9'
  },
  addInfo: {
    flex: 1, marginLeft: 15
  },
  addText: {
    color: '#555'
  }
});
