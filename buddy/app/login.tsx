// Importa componentes básicos do React Native
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// Importa o hook de navegação da Expo Router
import { useRouter } from 'expo-router';
// Importa o hook para controle de estado
import { useState } from 'react';
// Função para login com Keycloak via ROPC (usuário e senha)
import { loginWithCredentials } from '../utils/keycloak.js'; // ajuste o caminho conforme necessário
// Importa componente para abrir páginas web dentro do app
import { WebView } from 'react-native-webview';
// Endereços de API e Keycloak definidos em arquivo de ambiente
import { URLS } from '../utils/enviroment.js';

export default function Login() {
  const router = useRouter(); // Instância do roteador para navegação de tela

  // Estados para armazenar email e senha digitados pelo usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para mensagens de erro de login
  const [error, setError] = useState('');

  // Estado para decidir se mostra a WebView (caso de recuperação de senha)
  const [showWebview, setShowWebview] = useState(false);

  // Função executada ao clicar no botão de login
  const handleLogin = async () => {
    try {
      // Login temporário sem autenticação real (bypass de teste)
      if (email === "pedro@gmail.com" && password === "1234") {
        router.replace('/home');
      }

      // Tenta autenticar com Keycloak via função utilitária
      const result = await loginWithCredentials(email, password);

      if (result.success) {
        // Navega para tela principal se o login for bem-sucedido
        router.replace('/home');
      } else {
        // Mostra erro retornado pela função de login
        setError(result.message || 'Erro ao fazer login');
      }
    } catch (err) {
      // Captura erros inesperados, como falha de conexão
      setError('Erro na conexão com o servidor');
    }
  };

  // Se o estado showWebview estiver ativado, mostra a tela de recuperação de senha dentro do app
  if (showWebview) {
    return (
      <WebView
        source={{ uri: `${URLS.keycloak}/realms/espaco-buddy/account` }}
        style={{ flex: 1 }}
      />
    );
  }

  // Layout principal da tela de login
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conta de acesso</Text>
      <Text style={styles.subtitle}>
        Gerencie a alimentação do seu animal de estimação com facilidade
      </Text>

      {/* Campo de entrada de email */}
      <TextInput
        placeholder="Digite aqui seu email"
        style={styles.input}
        placeholderTextColor={"#555"}
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo de entrada de senha */}
      <TextInput
        placeholder="Digite aqui sua senha"
        placeholderTextColor={"#555"}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Mostra mensagem de erro, se houver */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Link para abrir WebView de recuperação de senha */}
      <Text style={styles.forgot} onPress={() => setShowWebview(true)}>
        Esqueceu sua senha?
      </Text>

      {/* Botão de login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Link para criar uma nova conta */}
      <Text style={styles.signupText}>
        Precisa criar uma conta?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/register')}>
          Inscrever-se
        </Text>
      </Text>
    </View>
  );
}

// Estilos da tela de login
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
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#00B894',
  },
  loginButton: {
    backgroundColor: '#00B894',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777',
  },
  signupLink: {
    color: '#00B894',
    fontWeight: '600',
  },
});
