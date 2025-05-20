import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { decodeToken, getInfo } from '../utils/keycloak';
import { listTable } from '../utils/database';

export default function DevicePairing() {
  const router = useRouter();
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getInfo("access_token");
        const decodedToken = await decodeToken(token);
        const userId = decodedToken.sub;
  
        const result = await listTable("user_feeders", { user_id: userId });
  
        const devices = result.data.map((entry, index) => {
          const feeder = {
            id: entry.feeder_id,
            nickname: entry.nickname,
          };
          return feeder;
        });
  
        setDevices(devices);
      } catch (err) {
        console.error("Erro ao buscar dispositivos:", err);
      }
    };
  
    fetchDevices();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
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

      {/* Lista dos dispositivos emparelhados */}
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

      {/* Botão Adicionar Novo */}
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
