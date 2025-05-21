import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem('access_token', token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
}

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem('access_token');
    return token;
  } catch (error) {
    console.error('Erro ao buscar token:', error);
    return null;
  }
}
