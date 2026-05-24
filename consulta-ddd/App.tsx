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
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f8fa" />
      <View style={styles.container}>
        <Text style={styles.title}>Consulta de DDD</Text>
        <Text style={styles.subtitle}>Encontre o estado e cidades pelo código de área</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o DDD (ex: 13)"
            placeholderTextColor="#8c959f"
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
            <ActivityIndicator size="small" color="#0969da" />
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
            <View style={styles.resultsHeader}>
              <Text style={styles.listHeader}>Cidades ({data.cities.length})</Text>
              <View style={styles.stateBadge}>
                <Text style={styles.stateBadgeText}>{data.state}</Text>
              </View>
            </View>
            
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
    backgroundColor: '#f6f8fa',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#24292f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#57606a',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#24292f',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  button: {
    height: 36,
    backgroundColor: '#2da44e',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 36, 0.15)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  feedbackText: {
    color: '#57606a',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#ffebe9',
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 129, 130, 0.4)',
  },
  errorText: {
    color: '#cf222e',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 6,
    overflow: 'hidden',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f6f8fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7de',
  },
  stateBadge: {
    backgroundColor: '#ddf4ff',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(84, 174, 255, 0.4)',
  },
  stateBadgeText: {
    color: '#0969da',
    fontWeight: '600',
    fontSize: 12,
  },
  listHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24292f',
  },
  listContent: {
    paddingBottom: 8,
  },
  cityCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eff3f6',
  },
  cityText: {
    fontSize: 14,
    color: '#24292f',
  },
});