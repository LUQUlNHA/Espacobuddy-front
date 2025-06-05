import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import { register } from '../utils/database';
import { getInfo, decodeToken } from '../utils/keycloak';

export default function CadastroAlimentador() {
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à câmera para escanear QR Code.');
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    setScannedData(data);
    Alert.alert('QR Code lido!', `Conteúdo: ${data}`);
  };

  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
      Alert.alert('Imagem capturada!', 'Você pode salvar essa imagem depois.');
    }
  };

  const salvarAlimentador = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Digite um nome para o alimentador.');
      return;
    }

    if (!scannedData) {
      Alert.alert('Erro', 'Escaneie o QR Code do alimentador primeiro.');
      return;
    }

    try {
      const token = await getInfo('access_token');
      const decoded = await decodeToken(token);
      const userId = decoded.sub;

      const response = await register('user_feeders', {
        user_id: userId,
        nickname: nome,
        feeder_id: scannedData,
      });

      console.log('Alimentador cadastrado:', response);
      Alert.alert('Sucesso', 'Alimentador cadastrado com sucesso!');
      router.replace('/manual');
    } catch (error) {
      console.log('Erro ao salvar alimentador:', error);
      Alert.alert('Erro', 'Erro ao cadastrar alimentador.');
    }
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{ flex: 1 }}
        />
      ) : (
        <>
          <Text style={styles.title}>Cadastro de Alimentador</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do alimentador"
            value={nome}
            onChangeText={setNome}
          />

          <TouchableOpacity style={styles.cameraButton} onPress={abrirCamera}>
            <Ionicons name="camera-outline" size={24} color="#fff" />
            <Text style={styles.cameraText}>Abrir Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.qrButton} onPress={() => setScanning(true)}>
            <Ionicons name="qr-code-outline" size={24} color="#fff" />
            <Text style={styles.cameraText}>Escanear QR Code</Text>
          </TouchableOpacity>

          {scannedData ? (
            <Text style={{ marginTop: 10, color: 'green' }}>
              QR escaneado: {scannedData}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.saveButton} onPress={salvarAlimentador}>
            <Text style={styles.saveText}>Salvar Alimentador</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  cameraText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
