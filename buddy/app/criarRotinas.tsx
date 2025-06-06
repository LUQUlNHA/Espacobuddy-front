import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { listTable, register } from '../utils/database';
import { getInfo, decodeToken } from '../utils/keycloak';

export default function CreateRoutine() {
  const router = useRouter();

  const [selectedFeeder, setSelectedFeeder] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM');
  const [portionSize, setPortionSize] = useState<'Small' | 'Medium' | 'Large'>('Small');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [feeders, setFeeders] = useState<any[]>([]);
  const [loadingFeeders, setLoadingFeeders] = useState(true);
  const [errorFeeders, setErrorFeeders] = useState<string | null>(null);

    // ----- Estados para “rotinas” -----
  const [routines, setRoutines] = useState<any[]>([]);
  const [loadingRoutines, setLoadingRoutines] = useState(true);
  const [errorRoutines, setErrorRoutines] = useState<string | null>(null);

  const time = `${hour}:${minute} ${amPm}`;

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')); // antigo: const minutes = ['00', '15', '30', '45']
  

  // —————— useEffect para carregar alimentadores do usuário ——————
  useEffect(() => {
    const fetchFeeders = async () => {
      try {
        const token = await getInfo('access_token');
        const decoded = await decodeToken(token);
        const userId = decoded.sub;

        const result = await listTable('user_feeders', { user_id: userId });
        if (result.success) {
          const arr = result.data.map((entry: any, idx: number) => ({
            id: entry.feeder_id,
            label: entry.nickname || `Alimentador ${idx + 1}`,
          }));
          setFeeders(arr);
          // Se quiser já pré-selecionar o primeiro:
          if (arr.length > 0) {
            setSelectedFeeder(arr[0].id);
          }
        } else {
          setErrorFeeders('Erro ao listar alimentadores: ' + result.error);
        }
      } catch (err) {
        setErrorFeeders('Erro inesperado: ' + err);
      } finally {
        setLoadingFeeders(false);
      }
    };

    fetchFeeders();
  }, []);

  
  // —————— useEffect para carregar rotinas existentes ——————
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = await getInfo('access_token');
        const decoded = await decodeToken(token);
        const userId = decoded.sub;

        const result = await listTable('routines', { user_id: userId });
        if (result.success) {
          setRoutines(result.data);
        } else {
          setErrorRoutines('Erro ao listar rotinas: ' + result.error);
        }
      } catch (err) {
        setErrorRoutines('Erro inesperado: ' + err);
      } finally {
        setLoadingRoutines(false);
      }
    };

    fetchRoutines();
  }, []);

   // —————— Função para salvar nova rotina no banco ——————
  const handleSave = async () => {
    // 1) extrair userId do token
    const token = await getInfo('access_token');
    const decoded = await decodeToken(token);
    const userId = decoded.sub;

    // 2) converter hora AM/PM para 24h
    let h24 = parseInt(hour, 10);
    if (amPm === 'PM' && h24 < 12) h24 += 12;
    if (amPm === 'AM' && h24 === 12) h24 = 0;
    const schedule_time = `${String(h24).padStart(2, '0')}:${minute}`;

    // 3) montar objeto no formato que o backend espera
    const newRoutine = {
      feeder_id: selectedFeeder,
      routine_name: routineName,
      schedule_time,
      portion_size: portionSize,
      notifications_enabled: notificationsEnabled,
      user_id: userId,
    };

    // 4) chamar register
    const result = await register('routines', newRoutine);

    if (result.success) {
      // 5) após salvar, redirecionar (ou atualizar lista local antes de redirecionar)
      router.push({
        pathname: '/home',
        params: { routine: JSON.stringify(newRoutine) },
      });
    } else {
      Alert.alert('Erro ao salvar rotina', result.error);
    }
  };

    // —————— Renderização da UI ——————
  return (
    <View style={styles.container}>
      {/* Seletor de alimentador */}
      <Text style={styles.subtitle}>Selecione o alimentador</Text>
      <View style={styles.pickerWrapper}>
        {loadingFeeders ? (
          <Text>Carregando alimentadores...</Text>
        ) : errorFeeders ? (
          <Text style={{ color: 'red' }}>{errorFeeders}</Text>
        ) : (
          <Picker
            selectedValue={selectedFeeder}
            onValueChange={(itemValue) => setSelectedFeeder(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um alimentador" value="" />
            {feeders.map((f) => (
              <Picker.Item key={f.id} label={f.label} value={f.id} />
            ))}
          </Picker>
        )}
      </View>

      {/* Entrada do nome da rotina */}
      <Text style={styles.subtitle}>Nome da rotina</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da rotina"
        value={routineName}
        onChangeText={setRoutineName}
        editable={!!selectedFeeder}
      />

      {/* Seletor de horário */}
      <Text style={styles.title}>Horário</Text>
      <TouchableOpacity
        style={styles.timeBox}
        onPress={() => setModalVisible(true)}
        disabled={!selectedFeeder}
      >
        <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.subtitle}>Selecione o horário</Text>
            <View style={styles.pickerRow}>
              <ScrollView style={styles.pickerColumn}>
                {hours.map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => setHour(h)}
                    style={hour === h && styles.selectedItem}
                  >
                    <Text style={hour === h ? styles.selectedText : styles.pickerText}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn}>
                {minutes.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setMinute(m)}
                    style={minute === m && styles.selectedItem}
                  >
                    <Text style={minute === m ? styles.selectedText : styles.pickerText}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn}>
                {['AM', 'PM'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setAmPm(p as 'AM' | 'PM')}
                    style={amPm === p && styles.selectedItem}
                  >
                    <Text style={amPm === p ? styles.selectedText : styles.pickerText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                <Text style={{ color: '#fff' }}>Definir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Seletor de porção */}
      <Text style={styles.subtitle}>Tamanho da porção</Text>
      <View style={styles.portions}>
        {['Small', 'Medium', 'Large'].map((size) => (
          <TouchableOpacity
            key={size}
            style={[styles.portionBtn, portionSize === size && styles.portionSelected]}
            onPress={() => setPortionSize(size as 'Small' | 'Medium' | 'Large')}
            disabled={!selectedFeeder}
          >
            <Text style={{ color: portionSize === size ? '#fff' : '#00B894' }}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Switch de notificações */}
      <View style={styles.switchContainer}>
        <Text style={styles.subtitle}>Notificações Ativadas</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          disabled={!selectedFeeder}
        />
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity
        style={[styles.saveButton, { opacity: selectedFeeder ? 1 : 0.4 }]}
        onPress={handleSave}
        disabled={!selectedFeeder}
      >
        <Text style={styles.saveText}>Salvar Configuração</Text>
      </TouchableOpacity>

      {/* ——— Opcional: Lista de rotinas já cadastradas abaixo ——— */}
      <Text style={[styles.subtitle, { marginTop: 30 }]}>Rotinas Cadastradas</Text>
      {loadingRoutines ? (
        <Text>Carregando rotinas...</Text>
      ) : errorRoutines ? (
        <Text style={{ color: 'red' }}>{errorRoutines}</Text>
      ) : routines.length === 0 ? (
        <Text>Você ainda não criou nenhuma rotina.</Text>
      ) : (
        routines.map((r) => (
          <View key={r.id} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{r.routine_name}</Text>
            <Text>Alimentador: {r.feeder_id}</Text>
            <Text>Horário: {r.schedule_time}</Text>
            <Text>Porção: {r.portion_size}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: '500', marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  timeBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: { fontSize: 16 },
  portions: { flexDirection: 'row', justifyContent: 'space-between' },
  portionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#00B894',
    borderWidth: 1,
    borderRadius: 6,
  },
  portionSelected: {
    backgroundColor: '#00B894',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#00B894',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    padding: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    height: 120,
  },
  pickerColumn: {
    width: 60,
  },
  pickerText: {
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
  },
  selectedItem: {
    backgroundColor: '#00B894',
    borderRadius: 6,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00B894',
    borderRadius: 6,
  },
  itemCard: {
    padding: 15,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
});
