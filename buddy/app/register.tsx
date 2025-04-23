import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const toggleAgreement = () => setAgreed(!agreed);

  const handleTermsPress = () => {
    console.log('Ver termos e condições');
  };

  const handleCreateAccount = () => {
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    // Aqui você pode implementar a lógica para salvar o usuário
    setError('');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Crie sua conta</Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor={"#555"}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor={"#555"}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor={"#555"}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

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

      <TouchableOpacity
        style={[styles.createButton, !agreed && { opacity: 0.6 }]}
        disabled={!agreed}
        onPress={handleCreateAccount}
      >
        <Text style={styles.createButtonText}>Criar minha conta</Text>
      </TouchableOpacity>
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
