import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AdPopup() {
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation<any>(); // Corrigido para evitar erro de tipagem

  const handleClose = () => {
    setVisible(false);
    navigation.navigate('home'); // Ajuste o nome conforme sua rota de destino
  };

  const handleOpenPartners = () => {
    setVisible(false);
    navigation.navigate('anuncio2'); // A rota deve existir no seu Stack.Navigator
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Botão "X" para fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.circle}>
              <MaterialCommunityIcons name="cube-outline" size={36} color="#00B386" />
              <View style={styles.alertDot} />
            </View>
          </View>

          <Text style={styles.title}>Estoque de ração baixo!</Text>

          <Text style={styles.subtitle}>
            Seu alimentador está com pouca ração. Evite que seu pet fique sem comida! Veja opções de rações recomendadas de fornecedores parceiros.
          </Text>

          <TouchableOpacity style={styles.recommendButton} onPress={handleOpenPartners}>
            <MaterialIcons name="shopping-cart" size={20} color="#FFF" />
            <Text style={styles.recommendText}>Ver rações recomendadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.remindButton} onPress={handleClose}>
            <MaterialIcons name="watch-later" size={20} color="#FFF" />
            <Text style={styles.remindText}>Lembrar mais tarde</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  closeButtonText: {
    color: '#AAA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    marginBottom: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#00B386',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#151515',
  },
  title: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 25,
  },
  recommendButton: {
    flexDirection: 'row',
    backgroundColor: '#00B386',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  remindButton: {
    flexDirection: 'row',
    backgroundColor: '#2B2B2B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  remindText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
});
