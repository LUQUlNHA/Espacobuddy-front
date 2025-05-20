import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { listTable } from '../utils/database';
import { getInfo, decodeToken } from '../utils/keycloak';

export default function CreateRoutine() {
  const router = useRouter();
  const { routineName } = useLocalSearchParams();

  const [routineNameState, setRoutineNameState] = useState('');
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM');
  const [portionSize, setPortionSize] = useState<'Small' | 'Medium' | 'Large'>('Small');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    if (typeof routineName === 'string') {
      setRoutineNameState(routineName);
    }
  }, [routineName]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getInfo("access_token");
        const decodedToken = await decodeToken(token);
        const userId = decodedToken.sub;

        const result = await listTable("user_feeders", { user_id: userId });

        const devices = result.data.map((entry, index) => ({
          id: entry.feeder_id,
          nickname: entry.nickname || `Alimentador ${index + 1}`,
          linkedAt: entry.created_at,
        }));

        console.log("Dispositivos carregados:", devices);

        setDevices(devices);
        if (devices.length > 0) {
          setSelectedDevice(devices[0].id.toString());
        }
      } catch (err) {
        console.error("Erro ao buscar dispositivos:", err);
      }
    };

    fetchDevices();
  }, []);

  const time = `${hour}:${minute} ${amPm}`;

  const handleSave = () => {
    const newRoutine = {
      deviceId: selectedDevice,
      name: routineNameState,
      time,
      portionSize,
      notificationsEnabled,
    };

    router.replace({
      pathname: '/home',
      params: { routine: JSON.stringify(newRoutine) },
    });
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Selecione o alimentador</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedDevice || (devices[0]?.id.toString() ?? '')}
          onValueChange={(itemValue) => {
            console.log('Selecionado:', itemValue);
            setSelectedDevice(itemValue);
          }}
          enabled={devices.length > 0}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          mode="dropdown"
        >
          {devices.map((device) => (
            <Picker.Item
              key={device.id}
              label={device.nickname || `Alimentador`}
              value={device.id.toString()}
              color='#000'
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.subtitle}>Nome da rotina</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da rotina"
        value={routineNameState}
        onChangeText={setRoutineNameState}
        editable={!!selectedDevice}
      />

      <Text style={styles.title}>Horário</Text>
      <TouchableOpacity style={styles.timeBox} onPress={() => setModalVisible(true)} disabled={!selectedDevice}>
        <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.subtitle}>Selecione o horário</Text>
            <View style={styles.pickerRow}>
              <ScrollView style={styles.pickerColumn}>
                {hours.map((h) => (
                  <TouchableOpacity key={h} onPress={() => setHour(h)} style={hour === h && styles.selectedItem}>
                    <Text style={hour === h ? styles.selectedText : styles.pickerText}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn}>
                {minutes.map((m) => (
                  <TouchableOpacity key={m} onPress={() => setMinute(m)} style={minute === m && styles.selectedItem}>
                    <Text style={minute === m ? styles.selectedText : styles.pickerText}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn}>
                {['AM', 'PM'].map((p) => (
                  <TouchableOpacity key={p} onPress={() => setAmPm(p as 'AM' | 'PM')} style={amPm === p && styles.selectedItem}>
                    <Text style={amPm === p ? styles.selectedText : styles.pickerText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalBtn, { backgroundColor: '#ccc' }]}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                <Text style={{ color: '#fff' }}>Definir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.subtitle}>Tamanho da porção</Text>
      <View style={styles.portions}>
        {['Small', 'Medium', 'Large'].map((size) => (
          <TouchableOpacity
            key={size}
            style={[styles.portionBtn, portionSize === size && styles.portionSelected]}
            onPress={() => setPortionSize(size as any)}
            disabled={!selectedDevice}
          >
            <Text style={{ color: portionSize === size ? '#fff' : '#00B894' }}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.subtitle}>Notificações Ativadas</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} disabled={!selectedDevice} />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { opacity: selectedDevice ? 1 : 0.4 }]}
        onPress={handleSave}
        disabled={!selectedDevice}
      >
        <Text style={styles.saveText}>Salvar Configuração</Text>
      </TouchableOpacity>
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
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    height: Platform.OS === 'ios' ? 100 : undefined,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  picker: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: 'transparent', // pode ser removido, mas ajuda no Android
    ...Platform.select({
      ios: {
        marginTop: -80, // visualmente alinha melhor no iOS
      },
      android: {
        fontSize: 16,
      },
    }),
  },

  pickerItem: {
    fontSize: 16,
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
    color: "#000",
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
});
