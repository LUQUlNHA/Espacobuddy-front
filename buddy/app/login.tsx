import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Aqui você pode simular a validação de email e senha
    if (email === 'Pedro@gmail.com' && password === '1234') {
      router.replace('/home');
    } else {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access Account</Text>
      <Text style={styles.subtitle}>Manage your pet’s feeding with ease</Text>

      <TextInput
        placeholder="Your email address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Enter your password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.forgot}>Forget your password?</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Need to create an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/register')}>Sign Up</Text>
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
