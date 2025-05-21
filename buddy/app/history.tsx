import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const colors = {
  background: '#f0f4f8',
  primary: '#3b82f6',   // azul
  text: '#1f2937',      // cinza escuro
  card: '#ffffff',      // branco para cards
};

const data = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [
    {
      data: [3, 2, 4, 1, 3, 5, 2],
    },
  ],
};

const chartConfig = {
  backgroundColor: colors.background,
  backgroundGradientFrom: colors.background,
  backgroundGradientTo: colors.background,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,  // azul com opacidade
  labelColor: () => colors.text,
  barPercentage: 0.5,
  propsForBackgroundLines: {
    stroke: '#ccc',
  },
};

const feedingLogs = [
  { day: 'Segunda', time: '08:00', portion: 'Pequena (30g)' },
  { day: 'Segunda', time: '12:00', portion: 'Média (45g)' },
  { day: 'Segunda', time: '18:00', portion: 'Grande (60g)' },
  { day: 'Terça', time: '09:00', portion: 'Média (45g)' },
  { day: 'Quarta', time: '08:00', portion: 'Pequena (30g)' },
  { day: 'Sábado', time: '10:00', portion: 'Grande (60g)' },
];

export default function Historico() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
          Alimentações por dia
        </Text>
        <BarChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          style={{ borderRadius: 12 }}
          yAxisLabel=""
          yAxisSuffix=""
        />

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 32,
            marginBottom: 8,
          }}
        >
          Registros de Alimentação
        </Text>

        {feedingLogs.map((log, index) => (
          <View
            key={index}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>{log.day}</Text>
            <Text style={{ color: colors.text }}>Horário: {log.time}</Text>
            <Text style={{ color: colors.text }}>Porção: {log.portion}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
