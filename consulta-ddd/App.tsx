import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

interface DddApiResponse {
  state: string;
  cities: string[];
}

export default function App() {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchTrigger, setSearchTrigger] = useState<string>('');
  const [data, setData] = useState<DddApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (inputValue.length === 2 && !isNaN(Number(inputValue))) {
      setSearchTrigger(inputValue);
      Keyboard.dismiss();
    } else {
      setError('Por favor, informe um DDD válido de 2 dígitos (Ex: 11).');
      setData(null);
    }
  };

  useEffect(() => {
    if (!searchTrigger) return;

    const fetchDddData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(`https://brasilapi.com.br/api/ddd/v1/${searchTrigger}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('DDD não encontrado.');
          }
          throw new Error('Ocorreu um erro ao consultar a API.');
        }

        const result: DddApiResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido.');
        setData(null);
      } finally {
        setLoading(false);
        setSearchTrigger(''); 
      }
    };

    fetchDddData();
  }, [searchTrigger]);

  const renderCityItem = ({ item }: { item: string }) => (
    <View style={styles.cityCard}>
      <Text style={styles.cityText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />
      <View style={styles.container}>
        <Text style={styles.title}>Consulta de DDD</Text>
        <Text style={styles.subtitle}>Encontre o estado e cidades pelo código de área</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o DDD (ex: 13)"
            placeholderTextColor="#8b949e"
            keyboardType="numeric"
            maxLength={2}
            value={inputValue}
            onChangeText={setInputValue}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSearch}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color="#58a6ff" />
            <Text style={styles.feedbackText}>Buscando localidades...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {data && !loading && (
          <View style={styles.resultsContainer}>
            <View style={styles.stateBadge}>
              <Text style={styles.stateBadgeText}>Estado: {data.state}</Text>
            </View>
            <Text style={styles.listHeader}>Cidades ({data.cities.length}):</Text>
            
            <FlatList
              data={data.cities}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={renderCityItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 24 : 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c9d1d9',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b949e',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: '#0d1117',
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#c9d1d9',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  button: {
    height: 56,
    backgroundColor: '#238636',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(240, 246, 252, 0.1)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  feedbackText: {
    marginTop: 12,
    color: '#8b949e',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: 'rgba(248, 81, 73, 0.1)',
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(248, 81, 73, 0.4)',
  },
  errorText: {
    color: '#ff7b72',
    textAlign: 'center',
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    marginTop: 8,
  },
  stateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 139, 253, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 139, 253, 0.4)',
    marginBottom: 16,
  },
  stateBadgeText: {
    color: '#58a6ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c9d1d9',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  cityCard: {
    backgroundColor: '#161b22',
    padding: 16,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cityText: {
    fontSize: 15,
    color: '#c9d1d9',
  },
});