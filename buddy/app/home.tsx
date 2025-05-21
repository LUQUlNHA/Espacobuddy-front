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

export default function Home() {
  const router = useRouter();
  const { routine } = useLocalSearchParams();

  const [smallOn, setSmallOn] = useState(false);
  const [mediumOn, setMediumOn] = useState(true);
  const [largeOn, setLargeOn] = useState(false);

  const [rotinas, setRotinas] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedRoutineName, setEditedRoutineName] = useState('');
  const [currentEditingRoutineId, setCurrentEditingRoutineId] = useState(null);

  const handleDispense = () => {
    console.log('Comida dispensada!');
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
        } else {
          console.error('Erro ao salvar rotina:', result.message);
        }
      } catch (err) {
        console.error('Erro ao atualizar rotina:', err);
      }
      setIsModalVisible(false);
      setEditedRoutineName('');
    }
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
        console.error("Erro ao carregar rotinas do usuário:", error);
      }
    };

    fetchUserRoutines();
  }, []);

  useEffect(() => {
    if (routine) {
      try {
        const newRoutine = JSON.parse(routine);
        if (newRoutine?.name) {
          setRotinas((prev) => [...prev, { id: Date.now(), nome: newRoutine.name }]);
        }
      } catch (err) {
        console.error('Erro ao adicionar nova rotina:', err);
      }
    }
  }, [routine]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Controle de Alimentação</Text>
        <Ionicons name="settings-outline" size={24} />
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar por receitas..."
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.dispenseButton} onPress={handleDispense}>
        <Text style={styles.dispenseText}>Dispensar Comida</Text>
      </TouchableOpacity>

      <SliderRow label="Small" active={smallOn} onToggle={setSmallOn} />
      <SliderRow label="Medium" active={mediumOn} onToggle={setMediumOn} />
      <SliderRow label="Large" active={largeOn} onToggle={setLargeOn} />

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
        <TouchableOpacity
          key={rotina.id}
          style={styles.routineItem}
          onPress={() => handleRoutinePress(rotina)}
        >
          <Ionicons name="play-circle-outline" size={24} />
          <Text style={styles.routineText}>{rotina.nome}</Text>
          <TouchableOpacity onPress={() => handleEditRoutine(rotina.id, rotina.nome)}>
            <MaterialIcons name="edit" size={20} />
          </TouchableOpacity>
        </TouchableOpacity>
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

      <BottomNav />
    </ScrollView>
  );
}

function SliderRow({ label, active, onToggle }) {
  const largura = active ? '70%' : '30%';
  return (
    <View style={styles.sliderRow}>
      <Text>{label}</Text>
      <View style={[styles.bar, { width: largura }]} />
      <Switch value={active} onValueChange={onToggle} />
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
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  search: {
    backgroundColor: '#f0f0f0', borderRadius: 10, padding: 10, marginBottom: 15
  },
  dispenseButton: {
    backgroundColor: '#008080', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20
  },
  dispenseText: { color: '#fff', fontWeight: 'bold' },
  sliderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
  },
  bar: {
    height: 8, backgroundColor: '#ccc', borderRadius: 5, marginHorizontal: 10
  },
  image: {
    width: '100%', height: 150, borderRadius: 10, marginTop: 15
  },
  imageLabel: {
    textAlign: 'center', marginTop: 5, fontWeight: '500'
  },
  success: {
    textAlign: 'center', color: 'green', marginBottom: 10
  },
  createRoutineButton: {
    borderColor: '#008080', borderWidth: 1, borderRadius: 10, padding: 10, alignItems: 'center', marginVertical: 10
  },
  createRoutineText: { color: '#008080', fontWeight: 'bold' },
  routineItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  routineText: { flex: 1, marginHorizontal: 10 },
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc', marginTop: 5
  },
  navItem: { alignItems: 'center' },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center'
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: {
    width: '100%', padding: 10, borderWidth: 1, borderRadius: 10, marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%'
  }
});
