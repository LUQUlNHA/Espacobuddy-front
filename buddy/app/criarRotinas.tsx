import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

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

  const time = `${hour}:${minute} ${amPm}`;

  const handleSave = () => {
    const newRoutine = {
      feeder: selectedFeeder,
      name: routineName,
      time,
      portionSize,
      notificationsEnabled,
    };

    router.push({
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
          selectedValue={selectedFeeder}
          onValueChange={(itemValue) => setSelectedFeeder(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Alimentadores Disponíveis" value="" />
          <Picker.Item label="Alimentador 1" value="feeder1" />
          <Picker.Item label="Alimentador 2" value="feeder2" />
        </Picker>
      </View>

      <Text style={styles.subtitle}>Nome da rotina</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da rotina"
        value={routineName}
        onChangeText={setRoutineName}
      />

      <Text style={styles.title}>Horário</Text>
      <TouchableOpacity style={styles.timeBox} onPress={() => setModalVisible(true)}>
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

      <Text style={styles.subtitle}>Tamanho da porção</Text>
      <View style={styles.portions}>
        {['Small', 'Medium', 'Large'].map((size) => (
          <TouchableOpacity
            key={size}
            style={[styles.portionBtn, portionSize === size && styles.portionSelected]}
            onPress={() => setPortionSize(size as 'Small' | 'Medium' | 'Large')}
          >
            <Text style={{ color: portionSize === size ? '#fff' : '#00B894' }}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.subtitle}>Notificações ativadas</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
