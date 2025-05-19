import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { loginWithCredentials } from '../utils/keycloak.js'; // ajuste o caminho
import { WebView } from 'react-native-webview';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWebview, setShowWebview] = useState(false); // ✅ AGORA está no lugar certo

  const handleLogin = async () => {
    try {
      // Entrar no sistema sem o keycloak
      if (email === "pedro@gmail.com" && password === "1234") {
        router.replace('/home');
      }

      const result = await loginWithCredentials(email, password);
      if (result.success) {
        router.replace('/home');
      } else {
        setError(result.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro na conexão com o servidor');
    }
  };

  if (showWebview) {
    return (
      <WebView
        source={{ uri: 'http://192.168.0.29:8080/realms/espaco-buddy/account' }}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conta de acesso</Text>
      <Text style={styles.subtitle}>
        Gerencie a alimentação do seu animal de estimação com facilidade
      </Text>

      <TextInput
        placeholder="Digite aqui seu email"
        style={styles.input}
        placeholderTextColor={"#555"}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Digite aqui sua senha"
        placeholderTextColor={"#555"}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.forgot} onPress={() => setShowWebview(true)}>
        Esqueceu sua senha?
      </Text>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Precisa criar uma conta?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/register')}>
          Inscrever-se
        </Text>
      </Text>
    </View>
  );
}

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