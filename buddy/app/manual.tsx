import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { decodeToken, getInfo } from '../utils/keycloak';
import { listTable } from '../utils/database';

export default function DevicePairing() {
  const router = useRouter();
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    try {
      const token = await getInfo('access_token');
      if (!token) {
        console.warn('Token não encontrado');
        return;
      }

      const decodedToken = await decodeToken(token);
      const userId = decodedToken.sub;

      const result = await listTable('user_feeders', { user_id: userId });

      if (!result?.data) {
        console.warn('Nenhum dado retornado de user_feeders');
        setDevices([]);
        return;
      }

      const devices = result.data.map((entry, index) => ({
        id: entry.feeder_id || index,
        nickname: entry.nickname,
      }));

      setDevices(devices);
    } catch (err) {
      console.error('Erro ao buscar dispositivos:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dispositivos</Text>
        <View style={styles.headerRight}>
          <Ionicons name="bar-chart-outline" size={20} style={styles.icon} />
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profilePic}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addBox, { marginTop: 20, backgroundColor: '#e0f7fa' }]}
        onPress={() => router.push('/cadastro-alimentador')}
      >
        <Ionicons name="create-outline" size={24} color="#00796b" />
        <View style={styles.addInfo}>
          <Text style={[styles.addText, { color: '#00796b' }]}>Cadastrar Alimentador</Text>
        </View>
        <Ionicons name="arrow-forward-circle-outline" size={24} color="#00796b" />
      </TouchableOpacity>

      {devices.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          Nenhum alimentador cadastrado ainda.
        </Text>
      )}

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
    fontSize: 22, fontWeight: 'bold'
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
