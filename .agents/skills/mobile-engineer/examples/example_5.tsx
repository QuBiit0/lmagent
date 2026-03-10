import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useOfflineData<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    loadData();
    return unsubscribe;
  }, []);

  const loadData = async () => {
    try {
      // Try network first
      const freshData = await fetcher();
      setData(freshData);
      await AsyncStorage.setItem(key, JSON.stringify(freshData));
    } catch {
      // Fallback to cache
      const cached = await AsyncStorage.getItem(key);
      if (cached) setData(JSON.parse(cached));
    }
  };

  return { data, isOffline, refresh: loadData };
}