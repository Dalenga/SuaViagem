import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image, FlatList, Platform, useColorScheme, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { listEntries, addEntry, removeEntry } from './db';

const light = { bg: '#f6f7f9', card: '#ffffff', text: '#111827', sub: '#6b7280', accent: '#0f766e', danger: '#b91c1c', border: '#e5e7eb' };
const dark = { bg: '#0f1115', card: '#1a1d23', text: '#f3f4f6', sub: '#9ca3af', accent: '#2dd4bf', danger: '#f87171', border: '#2b2f38' };

export default function App() {
  const c = useColorScheme() === 'dark' ? dark : light;
  const s = makeStyles(c);
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [msg, setMsg] = useState('');

  const reload = useCallback(async () => setEntries(await listEntries()), []);
  useEffect(() => { reload(); }, [reload]);

  async function pickPhoto(camera) {
    const web = Platform.OS === 'web';
    const perm = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return setMsg('Permissão negada. Você ainda pode salvar só com texto ou usar a galeria.');
    const launch = camera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const r = await launch({ quality: 0.3, base64: web });
    if (r.canceled) return;
    const a = r.assets[0];
    setPhoto(web ? `data:${a.mimeType || 'image/jpeg'};base64,${a.base64}` : a.uri);
    setMsg('');
  }

  async function getLocation() {
    const p = await Location.requestForegroundPermissionsAsync();
    if (p.status !== 'granted') return setMsg('Localização negada. O registro será salvo sem coordenadas.');
    try {
      const l = await Location.getCurrentPositionAsync({});
      setCoords({ lat: l.coords.latitude, lon: l.coords.longitude });
      setMsg('');
    } catch { setMsg('Não foi possível obter a localização.'); }
  }

  async function save() {
    if (!text.trim() && !photo) return setMsg('Escreva algo ou adicione uma foto.');
    try {
      await addEntry({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        text: text.trim(), photo, lat: coords?.lat ?? null, lon: coords?.lon ?? null,
        createdAt: new Date().toISOString(),
      });
      setText(''); setPhoto(null); setCoords(null); setMsg('Salvo no aparelho ✓');
      reload();
    } catch (e) { setMsg(e.message); }
  }

  const Btn = ({ label, onPress, color = c.accent }) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[s.btn, { borderColor: color }]}>
      <Text style={{ color, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={s.screen}>
      <StatusBar style="auto" />
      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <View>
            <Text style={s.title}>Rota</Text>
            <Text style={s.sub}>Diário de viagem offline. Tudo é salvo primeiro no aparelho.</Text>
            <View style={s.card}>
              <TextInput style={s.input} multiline placeholder="O que aconteceu hoje?" placeholderTextColor={c.sub}
                value={text} onChangeText={setText} accessibilityLabel="Texto do registro" />
              {photo && <Image source={{ uri: photo }} style={s.photo} accessibilityLabel="Foto do registro" />}
              {coords && <Text style={s.sub}>📍 {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}</Text>}
              <View style={s.row}>
                <Btn label="Tirar foto" onPress={() => pickPhoto(true)} />
                <Btn label="Galeria" onPress={() => pickPhoto(false)} />
                <Btn label="Minha localização" onPress={getLocation} />
              </View>
              <Pressable accessibilityRole="button" onPress={save} style={s.save}><Text style={s.saveText}>Salvar registro</Text></Pressable>
              {!!msg && <Text style={s.msg}>{msg}</Text>}
            </View>
            <Text style={s.section}>Linha do tempo ({entries.length})</Text>
          </View>
        }
        ListEmptyComponent={<Text style={s.sub}>Nenhum registro ainda.</Text>}
        renderItem={({ item }) => (
          <View style={s.card}>
            {item.photo && <Image source={{ uri: item.photo }} style={s.photo} />}
            {!!item.text && <Text style={s.body}>{item.text}</Text>}
            <Text style={s.sub}>{new Date(item.createdAt).toLocaleString()}</Text>
            {item.lat != null && <Text style={s.sub}>📍 {item.lat.toFixed(5)}, {item.lon.toFixed(5)}</Text>}
            <Text style={s.sub}>Sincronização: {item.syncStatus || 'pendente'}</Text>
            <Btn label="Excluir" color={c.danger} onPress={async () => { await removeEntry(item.id); reload(); }} />
          </View>
        )}
      />
    </View>
  );
}

const makeStyles = (c) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.bg },
  list: { padding: 16, paddingTop: 48, maxWidth: 640, width: '100%', alignSelf: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: c.text },
  sub: { color: c.sub, fontSize: 13, marginVertical: 2 },
  section: { color: c.text, fontSize: 18, fontWeight: '700', marginVertical: 12 },
  card: { backgroundColor: c.card, borderRadius: 14, padding: 14, marginTop: 12, borderWidth: 1, borderColor: c.border, gap: 8 },
  input: { minHeight: 80, color: c.text, fontSize: 16, textAlignVertical: 'top' },
  photo: { width: '100%', height: 200, borderRadius: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { borderWidth: 1.5, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  save: { backgroundColor: c.accent, borderRadius: 10, padding: 14, alignItems: 'center', minHeight: 44 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  msg: { color: c.sub, fontSize: 13 },
  body: { color: c.text, fontSize: 16 },
});
