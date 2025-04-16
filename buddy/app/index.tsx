import { View, Text, TextInput, Image, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const [smallOn, setSmallOn] = useState(false);
  const [mediumOn, setMediumOn] = useState(true);
  const [largeOn, setLargeOn] = useState(false);

  const handleDispense = () => {
    console.log('Comida dispensada!');
  };

  const handleRoutinePress = (nome: string) => {
    console.log(`Rotina selecionada: ${nome}`);
  };

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
        <Text style={styles.dispenseText}>Dispense Food</Text>
      </TouchableOpacity>

      <SliderRow label="Small" active={smallOn} onToggle={setSmallOn} />
      <SliderRow label="Medium" active={mediumOn} onToggle={setMediumOn} />
      <SliderRow label="Large" active={largeOn} onToggle={setLargeOn} />

      <Image
        source={{ uri: 'https://placekitten.com/200/200' }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.imageLabel}>MEDIUM FOOD DISPENSED</Text>
      <Text style={styles.success}>success</Text>

      {/* Criar Rotina */}
      <TouchableOpacity style={styles.createRoutineButton} onPress={() => router.push('/criarRotinas')}>
  <Text style={styles.createRoutineText}>Criar Rotina</Text>
</TouchableOpacity>

      <RoutineItem
        icon="play-circle-outline"
        label="Rotina 1"
        onPress={() => handleRoutinePress('Rotina 1')}
      />
      <RoutineItem
        icon="alarm-outline"
        label="Rotina viagem"
        onPress={() => handleRoutinePress('Rotina viagem')}
      />

      <BottomNav />
    </ScrollView>
  );
}

// COMPONENTE: SliderRow
function SliderRow({ label, active, onToggle }: { label: string, active: boolean, onToggle: (val: boolean) => void }) {
  const largura = active ? '70%' : '30%';
  return (
    <View style={styles.sliderRow}>
      <Text>{label}</Text>
      <View style={[styles.bar, { width: largura }]} />
      <Switch value={active} onValueChange={onToggle} />
    </View>
  );
}

// COMPONENTE: RoutineItem
function RoutineItem({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.routineItem} onPress={onPress}>
      <Ionicons name={icon} size={24} />
      <Text style={styles.routineText}>{label}</Text>
      <MaterialIcons name="edit" size={20} />
    </TouchableOpacity>
  );
}

// COMPONENTE: BottomNav
function BottomNav() {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
        <Ionicons name="home" size={24} color="#008080" />
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/manual')}>
        <Ionicons name="fast-food-outline" size={24} />
        <Text>Manual Feed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}>
        <Ionicons name="time-outline" size={24} />
        <Text>History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
        <Ionicons name="settings-outline" size={24} />
        <Text>Settings</Text>
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
  navItem: { alignItems: 'center' }
});
