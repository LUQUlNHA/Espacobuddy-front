import {
  View,
  Text,
  TextInput,
  Image,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getInfo, decodeToken } from '../utils/keycloak';
import { listTable, updateRoutineName } from '../utils/database';
import MqttService from '../utils/mqttService';
import { URLS } from '../utils/enviroment';

export default function Home() {
  const [devices, setDevices] = useState([]);
  const router = useRouter();
  const { routine } = useLocalSearchParams();

  const [smallOn, setSmallOn] = useState(false);
  const [mediumOn, setMediumOn] = useState(true);
  const [largeOn, setLargeOn] = useState(false);

  const [rotinas, setRotinas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedRoutineName, setEditedRoutineName] = useState('');
  const [currentEditingRoutineId, setCurrentEditingRoutineId] = useState(null);

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const token = await getInfo("access_token");
        const decoded = await decodeToken(token);
        const userId = decoded.sub;

        const result = await listTable('user_feeders', { user_id: userId });

        if (!result?.data || result.data.length === 0) {
          setDevices([]);
          return;
        }

        const devices = result.data.map((entry, index) => ({
          id: entry.feeder_id || index,
          nickname: entry.nickname || `Dispositivo ${index + 1}`,
        }));

        setDevices(devices);
      } catch (error) {
        console.error("Erro ao carregar devices:", error);
      }
    };

    fetchDeviceId();
  }, []);

  useEffect(() => {
    MqttService.connect().catch((err) => console.error("Erro ao conectar ao MQTT:", err));
    return () => MqttService.disconnect();
  }, []);

  const handleDispense = () => {
    const topic = `${URLS.mqtt_pub_url}/${devices[0]?.id}`;
    let portion = "medium";
    if (smallOn) portion = "small";
    else if (largeOn) portion = "large";

    const message = {
      feed: {
        portion: portion,
        time: new Date().toISOString(),
      },
      device_id: devices[0]?.id,
    };

    MqttService.publish(topic, message);
  };

  const handleRoutinePress = (rotina) => {
    router.push({
      pathname: '/criarRotinas',
      params: { routineName: rotina.nome },
    });
  };

  const handleEditRoutine = (id, nome) => {
    setCurrentEditingRoutineId(id);
    setEditedRoutineName(nome);
    setIsModalVisible(true);
  };

  const handleSaveRoutine = async () => {
    if (editedRoutineName.trim()) {
      try {
        const result = await updateRoutineName(currentEditingRoutineId, editedRoutineName);
        if (result.success) {
          setRotinas((prev) =>
            prev.map((r) =>
              r.id === currentEditingRoutineId ? { ...r, nome: editedRoutineName } : r
            )
          );
        }
      } catch (err) {
        console.error('Erro ao atualizar rotina:', err);
      }
      setIsModalVisible(false);
      setEditedRoutineName('');
    }
  };

  const toggleSize = (size) => {
    setSmallOn(size === 'small');
    setMediumOn(size === 'medium');
    setLargeOn(size === 'large');
  };

  useEffect(() => {
    const fetchUserRoutines = async () => {
      try {
        const token = await getInfo("access_token");
        const decoded = await decodeToken(token);
        const userId = decoded.sub;

        const result = await listTable('rotines', { user_id: userId });

        if (result.success) {
          const fetched = result.data.map((r) => ({
            id: r.id,
            nome: r.routine_name,
          }));
          setRotinas(fetched);
        }
      } catch (error) {
        console.log("Erro ao carregar rotinas do usuário:", error);
      }
    };

    fetchUserRoutines();
  }, []);

  useEffect(() => {
    if (routine) {
      const routineName = routine?.routineName || routine.name || routine;
      if (routineName) {
        const alreadyExists = rotinas.some((r) => r.nome === routineName);
        if (!alreadyExists) {
          setRotinas((prev) => [
            ...prev,
            { id: Date.now(), nome: routineName },
          ]);
        }
      }
    }
  }, [routine]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Controle de Alimentação</Text>
          <TouchableOpacity onPress={() => router.push('/anuncio2')}>
            <Text style={styles.promoButton}>Promoções</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Buscar por receitas..."
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.dispenseButton} onPress={handleDispense}>
          <Text style={styles.dispenseText}>Dispensar Comida</Text>
        </TouchableOpacity>

        <SliderRow label="Small" active={smallOn} onPress={() => toggleSize('small')} />
        <SliderRow label="Medium" active={mediumOn} onPress={() => toggleSize('medium')} />
        <SliderRow label="Large" active={largeOn} onPress={() => toggleSize('large')} />

        <Image
          source={require('../assets/images/alimentador.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.imageLabel}>Comida Média Dispensada</Text>
        <Text style={styles.success}>SUCESSO</Text>

        <TouchableOpacity
          style={styles.createRoutineButton}
          onPress={() => router.push('/criarRotinas')}
        >
          <Text style={styles.createRoutineText}>Criar Rotina</Text>
        </TouchableOpacity>

        {rotinas.map((rotina) => (
          <View key={rotina.id} style={styles.routineCard}>
            <View style={styles.routineInfo}>
              <Text style={styles.routineName}>{rotina.name}</Text>
              <Text style={styles.routineDetail}>⏰ {rotina.time}</Text>
              <Text style={styles.routineDetail}>🍽️ Porção: {rotina.portionSize}</Text>
              <Text style={styles.routineDetail}>
                🔔 Notificações: {rotina.notificationsEnabled ? 'Ativadas' : 'Desativadas'}
              </Text>
            </View>
            <View style={styles.routineActions}>
              <TouchableOpacity onPress={() => handleRoutinePress(rotina)}>
                <Ionicons name="play-circle-outline" size={28} color="#008080" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditRoutine(rotina.id, rotina.name)}>
                <MaterialIcons name="edit" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Rotina</Text>
              <TextInput
                style={styles.modalInput}
                value={editedRoutineName}
                onChangeText={setEditedRoutineName}
                placeholder="Digite o novo nome da rotina"
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
                <Button title="Salvar" onPress={handleSaveRoutine} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

function SliderRow({ label, active, onPress }) {
  return (
    <View style={styles.sliderRow}>
      <Text>{label}</Text>
      <View
        style={[
          styles.bar,
          {
            width: active ? '70%' : '40%',
            backgroundColor: active ? '#008080' : '#ccc',
          },
        ]}
      />
      <Switch value={active} onValueChange={onPress} />
    </View>
  );
}

function BottomNav() {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <Ionicons name="home" size={24} color="#008080" />
        <Text>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/manual')}>
        <Ionicons name="fast-food-outline" size={24} />
        <Text>Alimentar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}>
        <Ionicons name="time-outline" size={24} />
        <Text>Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
        <Ionicons name="settings-outline" size={24} />
        <Text>Ajustes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 15, paddingBottom: 80 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  promoButton: {
    fontSize: 14,
    color: '#008080',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#008080',
    borderRadius: 11,
  },
  search: {
    backgroundColor: '#f0f0f0', borderRadius: 10, padding: 10, marginBottom: 15,
  },
  dispenseButton: {
    backgroundColor: '#008080', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20,
  },
  dispenseText: { color: '#fff', fontWeight: 'bold' },
  sliderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  bar: { height: 8, borderRadius: 5, marginHorizontal: 10 },
  image: { width: '100%', height: 280, borderRadius: 10, marginTop: 15 },
  imageLabel: { textAlign: 'center', marginTop: 5, fontWeight: '500' },
  success: { textAlign: 'center', color: 'green', marginBottom: 10 },
  createRoutineButton: {
    borderColor: '#008080', borderWidth: 1, borderRadius: 10, padding: 10, alignItems: 'center', marginVertical: 10,
  },
  createRoutineText: { color: '#008080', fontWeight: 'bold' },
  routineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routineInfo: { flex: 1 },
  routineName: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333',
  },
  routineDetail: {
    fontSize: 14, color: '#555', marginBottom: 2,
  },
  routineActions: {
    flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  navItem: { alignItems: 'center' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: {
    width: '100%', padding: 10, borderWidth: 1, borderRadius: 10, marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%',
  },
});
