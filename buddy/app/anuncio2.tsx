import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PartnersPage() {
  const navigation = useNavigation<any>(); // Corrige o erro de tipagem

  const products = [
    {
      id: 1,
      name: 'Pet Food',
      description: 'High-quality, organic pet food for all breeds.',
      delivery: 'Entrega: 2-3 dias úteis',
      minOrder: 'Pedido mín: R$ 50',
      rating: 4.8,
      url: 'https://www.cobasi.com.br/pesquisa?terms=ra%C3%A7%C3%A3o',
    },
    {
      id: 2,
      name: 'Rações',
      description: 'Specialized nutrition for active dogs and cats.',
      delivery: 'Entrega: 3-5 dias úteis',
      minOrder: 'Pedido mín: R$ 75',
      rating: 4.5,
      url: 'https://www.cobasi.com.br/pesquisa?terms=ra%C3%A7%C3%A3o',
    },
    {
      id: 3,
      name: 'Vida Saudável',
      description: 'Natural and holistic pet diets, focusing on gut health.',
      delivery: 'Entrega: 3-5 dias úteis',
      minOrder: 'Pedido mín: R$ 85',
      rating: 4.7,
      url: 'https://www.cobasi.com.br/pesquisa?terms=ra%C3%A7%C3%A3o',
    },
    {
      id: 4,
      name: 'Pet Gourmet',
      description: 'Gourmet meals and treats for discerning pets.',
      delivery: 'Entrega: 1-4 dias úteis',
      minOrder: 'Pedido mín: R$ 65',
      rating: 4.9,
      url: 'https://www.cobasi.com.br/pesquisa?terms=ra%C3%A7%C3%A3o',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Botão "X" para voltar */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('home')}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Parceiros Recomendados</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.card}
            onPress={() => Linking.openURL(product.url)}
          >
            <View style={styles.headerRow}>
              <View style={styles.iconPlaceholder} />
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={16} color="#FFA500" />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            </View>

            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productDetails}>{product.minOrder}</Text>
            <Text style={styles.productDetails}>{product.delivery}</Text>

            <View style={styles.button}>
              <Text style={styles.buttonText}>Explorar Ofertas</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 50,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#999',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDD',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  productDetails: {
    fontSize: 13,
    color: '#777',
  },
  button: {
    backgroundColor: '#00B386',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
