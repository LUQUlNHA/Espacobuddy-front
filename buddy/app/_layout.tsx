import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Entrar' }}/>
      <Stack.Screen name="welcome" options={{ title: 'Bem-Vindo' }}/>
      <Stack.Screen name="register" options={{ title: 'Registrar-se' }}/>
      <Stack.Screen name="criarRotinas" options={{ title: 'Criar Rotinas' }}/>
      <Stack.Screen name="cadastroAlimentador" options={{ title: 'Cadastro de Alimentador' }} />
      <Stack.Screen name="manual" options={{ title: 'Emparelhar Dispositivo' }}/>
      <Stack.Screen name="home" options={{ headerShown: false }}/>
      <Stack.Screen name="settings" options={{ title: 'Configurações' }}/>
      <Stack.Screen name="anuncio" options={{ title: 'Promoções' }}/>
      <Stack.Screen name="anuncio2" options={{ title: 'Rações' }}/>
    </Stack>
  );
}
