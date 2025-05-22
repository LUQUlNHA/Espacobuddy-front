// Importa o componente Stack do Expo Router, que permite navegação com pilha de telas (estilo React Navigation)
import { Stack } from 'expo-router';

/**
 * Define a estrutura de navegação do aplicativo usando Stack Navigation.
 * Cada tela é registrada com um nome e opções específicas de navegação (ex: título, visibilidade do cabeçalho).
 */
export default function Layout() {
  return (
    <Stack>
      {/* Tela inicial (index.js) - sem cabeçalho visível */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Tela de login - exibe "Entrar" como título no cabeçalho */}
      <Stack.Screen name="login" options={{ title: 'Entrar' }} />

      {/* Tela de boas-vindas após login */}
      <Stack.Screen name="welcome" options={{ title: 'Bem-Vindo' }} />

      {/* Tela de registro de novo usuário */}
      <Stack.Screen name="register" options={{ title: 'Registrar-se' }} />

      {/* Tela para criar rotinas personalizadas */}
      <Stack.Screen name="criarRotinas" options={{ title: 'Criar Rotinas' }} />

      {/* Tela principal/home - sem cabeçalho visível */}
      <Stack.Screen name="home" options={{ headerShown: false }} />

      {/* Tela de configurações - exibe título no topo */}
      <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
    </Stack>
  );
}
