import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { register } from '../utils/database';  // Função para salvar no banco
import { getInfo, decodeToken } from '../utils/keycloak'; // Para pegar token e userId

export default function CadastroAlimentador() {
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);  // Se quiser usar imagem futuramente
  const router = useRouter();

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

    try {
      const token = await getInfo('access_token');
      if (!token) throw new Error('Token não encontrado');

      const decoded = await decodeToken(token);
      const userId = decoded.sub;

      // Salva no banco
      const response = await register('user_feeders', {
        user_id: userId,
        nickname: nome,
        // Se quiser salvar a imagem futuramente, adicionar aqui: image: imagem
      });

      console.log('Alimentador cadastrado:', response);

      Alert.alert('Sucesso', 'Alimentador cadastrado com sucesso!');
      router.replace('/manual');  // Volta para a lista atualizando a tela
    } catch (error) {
      console.error('Erro ao salvar alimentador:', error);
      Alert.alert('Erro', 'Erro ao cadastrar alimentador.');
    }
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={styles.saveButton} onPress={salvarAlimentador}>
        <Text style={styles.saveText}>Salvar Alimentador</Text>
      </TouchableOpacity>
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
