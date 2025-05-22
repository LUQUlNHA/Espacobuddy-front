// Importações principais do React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

// Hook para controle de estado
import { useState } from 'react';

// Hook de navegação da Expo Router
import { useRouter } from 'expo-router';

// Função de registro de novo usuário no Keycloak
import { registerNewUser } from '../utils/keycloak'; // ajuste o caminho se necessário

export default function Register() {
  // Estados para armazenar os dados inseridos pelo usuário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false); // controle do checkbox de termos
  const [error, setError] = useState(''); // mensagem de erro a ser exibida
  const router = useRouter(); // controle de navegação

  // Alterna o estado do checkbox de aceite de termos
  const toggleAgreement = () => setAgreed(!agreed);

  // Ação ao clicar em "Termos e Condições"
  const handleTermsPress = () => {
    console.log('Ver termos e condições');
    // Aqui você poderia abrir um modal ou link para os termos
  };

  // Função executada ao clicar em "Criar minha conta"
  const handleCreateAccount = async () => {
    // Validação dos campos
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!agreed) {
      setError('Você precisa aceitar os termos');
      return;
    }

    try {
      // Chamada para API de cadastro com Keycloak
      const result = await registerNewUser(name, email, password);
      if (result.success) {
        setError('');
        router.replace('/login'); // redireciona para tela de login após cadastro bem-sucedido
      } else {
        setError(result.message || 'Erro ao criar usuário');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Crie sua conta</Text>

      {/* Campo de entrada: Nome */}
      <TextInput
        placeholder="Nome"
        placeholderTextColor={"#555"}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* Campo de entrada: Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor={"#555"}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Campo de entrada: Senha */}
      <TextInput
        placeholder="Senha"
        placeholderTextColor={"#555"}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Exibe erro se existir */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Checkbox de aceite dos termos */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleAgreement}>
          <Text style={styles.checkbox}>{agreed ? '☑' : '☐'}</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          eu concordo com{' '}
          <Text style={styles.termsLink} onPress={handleTermsPress}>
            Termos & Condições
          </Text>
        </Text>
      </View>

      {/* Botão de criação de conta */}
      <TouchableOpacity
        style={[styles.createButton, !agreed && { opacity: 0.6 }]} // botão mais apagado se os termos não forem aceitos
        disabled={!agreed}
        onPress={handleCreateAccount}
      >
        <Text style={styles.createButtonText}>Criar minha conta</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos aplicados aos componentes
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  checkbox: {
    fontSize: 18,
    marginRight: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
  },
  termsLink: {
    color: '#00B894',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  createButton: {
    backgroundColor: '#00B894',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
