import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

const KATEGORILER = [
  { id: '1', ad: 'Yazılım', ikon: '💻' },
  { id: '2', ad: 'Donanım', ikon: '⚡' },
  { id: '3', ad: 'Ağ/Sistem', ikon: '🌐' },
];

const DURUMLAR = [
  { ad: 'Bekliyor', renk: '#F59E0B', bg: '#FEF3C7', ikon: '⏳' },
  { ad: 'İşlemde', renk: '#EC4899', bg: '#FCE7F3', ikon: '🎀' },
  { ad: 'Tamamlandı', renk: '#10B981', bg: '#D1FAE5', ikon: '✨' },
];

export default function App() {
  // G1, G2: Form State'leri
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [secilenKategori, setSecilenKategori] = useState(KATEGORILER[0].ad);

  // Talep Listesi State'i
  const [talepler, setTalepler] = useState([
    {
      id: 'demo-1',
      baslik: 'Yazıcı Çıktı Vermiyor',
      aciklama: 'Kablo bağlantısı tam ama kağıt sıkışma uyarısı veriyor.',
      kategori: 'Donanım',
      ikon: '⚡',
      durum: 'İşlemde',
    },
    {
      id: 'demo-2',
      baslik: 'Portal Giriş Hatası',
      aciklama: 'Şifreyi doğru girmeme rağmen 403 erişim reddedildi diyor.',
      kategori: 'Yazılım',
      ikon: '💻',
      durum: 'Bekliyor',
    },
  ]);

  // G5: Detay Modalı State'leri
  const [detayModalGorunur, setDetayModalGorunur] = useState(false);
  const [secilenTalep, setSecilenTalep] = useState(null);

  // Bölüm D (Özgün Özellik): Başlık Arama State'i
  const [aramaMetni, setAramaMetni] = useState('');

  // G3, G4, G8: Talep Ekleme ve Doğrulama
  const talepEkle = () => {
    if (!baslik.trim() || !aciklama.trim()) {
      Alert.alert('Eksik Bilgi! 🩰', 'Lütfen başlık ve açıklama alanlarını doldur.');
      return;
    }

    const aktifIkon = KATEGORILER.find((k) => k.ad === secilenKategori)?.ikon || '🌸';

    const yeniTalep = {
      id: Date.now().toString(),
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      kategori: secilenKategori,
      ikon: aktifIkon,
      durum: 'Bekliyor',
    };

    setTalepler((oncekiler) => [yeniTalep, ...oncekiler]);
    setBaslik('');
    setAciklama('');
    setSecilenKategori(KATEGORILER[0].ad);

    Alert.alert('Eklendi! 🎀', 'Arıza talebin tatlı tatlı listeye yerleşti.');
  };
  // Butona uzun basıldığında: Acil / Öncelikli Talep Olarak Kaydet
const acilTalepEkle = () => {
  if (!baslik.trim() || !aciklama.trim()) {
    Alert.alert('Eksik Bilgi! 🩰', 'Lütfen önce başlık ve açıklamayı yaz.');
    return;
  }

  const aktifIkon = KATEGORILER.find((k) => k.ad === secilenKategori)?.ikon || '🌸';

  const yeniAcilTalep = {
    id: Date.now().toString(),
    baslik: `⭐ [ACİL] ${baslik.trim()}`,
    aciklama: aciklama.trim(),
    kategori: secilenKategori,
    ikon: aktifIkon,
    durum: 'İşlemde', // Acil olduğu için doğrudan işlemde durumuna geçsin
  };

  setTalepler((oncekiler) => [yeniAcilTalep, ...oncekiler]);
  setBaslik('');
  setAciklama('');
  setSecilenKategori(KATEGORILER[0].ad);

  Alert.alert('Öncelikli Kayıt! 🚨✨', 'Talebin [ACİL] olarak işaretlendi ve doğrudan işlem sırasına alındı.');
};

  // G6: Uzun Basma ile Silme Onayı
  const talepSilOnay = (id) => {
    Alert.alert(
      'Silinsin mi? 💭',
      'Bu arıza kaydını listeden kaldırmak istediğine emin misin?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: () => {
            setTalepler((oncekiler) => oncekiler.filter((t) => t.id !== id));
            Alert.alert('Silindi 🪽', 'Kayıt başarıyla kaldırıldı.');
          },
        },
      ]
    );
  };

  // G7: Durum Değiştirme
  const durumDegistir = (id, yeniDurum) => {
    setTalepler((oncekiler) =>
      oncekiler.map((item) => (item.id === id ? { ...item, durum: yeniDurum } : item))
    );

    if (secilenTalep && secilenTalep.id === id) {
      setSecilenTalep((prev) => ({ ...prev, durum: yeniDurum }));
    }
  };

  // G5: Detay Açma
  const talepDetayAc = (talep) => {
    setSecilenTalep(talep);
    setDetayModalGorunur(true);
  };

  // Bölüm D: Başlığa göre canlı arama filtrelemesi
  const filtrelenmisTalepler = talepler.filter((t) =>
    t.baslik.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  const getDurumStili = (durum) => {
    const d = DURUMLAR.find((item) => item.ad === durum);
    return d || DURUMLAR[0];
  };

  return (
    <SafeAreaView style={styles.anaKonteyner}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.icerikKonteyner}>
        
        {/* Üst Başlık */}
        <View style={styles.header}>
          <Text style={styles.headerAltBaslik}>DESTEK MASASI 🎀</Text>
          <Text style={styles.headerAnaBaslik}>Arıza Takip Notları ✨</Text>
        </View>

        {/* FORM KARTI */}
        <View style={styles.pembeKart}>
          <View style={styles.kartBaslikSatir}>
            <Text style={styles.kartBaslik}>Yeni Kayıt Oluştur</Text>
            <Text style={styles.tatliIkon}>🌷</Text>
          </View>

          <TextInput
            style={styles.pastelInput}
            placeholder="Sorun nedir? (Örn. Ekran titriyor)"
            placeholderTextColor="#C48B9F"
            value={baslik}
            onChangeText={setBaslik}
          />

          <TextInput
            style={[styles.pastelInput, styles.cokSatirli]}
            placeholder="Detayları buraya yazabilirsin..."
            placeholderTextColor="#C48B9F"
            value={aciklama}
            onChangeText={setAciklama}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.etiket}>Kategori Seç 🩰</Text>
          <View style={styles.kategoriKapsayici}>
            {KATEGORILER.map((kat) => {
              const seciliMi = secilenKategori === kat.ad;
              return (
                <TouchableOpacity
                  key={kat.id}
                  style={[styles.kategoriHap, seciliMi && styles.kategoriHapSecili]}
                  onPress={() => setSecilenKategori(kat.ad)}
                >
                  <Text style={styles.kategoriIkon}>{kat.ikon}</Text>
                  <Text style={[styles.kategoriYazi, seciliMi && styles.kategoriYaziSecili]}>
                    {kat.ad}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity 
            style={styles.kaydetButonu} 
            onPress={talepEkle} 
            onLongPress={acilTalepEkle}
            delayLongPress={600}
            activeOpacity={0.85}
          >
  <Text style={styles.kaydetButonuYazi}>Talebi Kaydet 🎀</Text>
  <Text style={styles.kaydetButonuAltYazi}>(Acil kayıt için basılı tut ⭐)</Text>
</TouchableOpacity>
        </View>

        {/* CANLI ARAMA ALANI (Bölüm D) */}
        <View style={styles.aramaKapsayici}>
          <TextInput
            style={styles.aramaInput}
            placeholder="🔍 Başlıklarda ara..."
            placeholderTextColor="#C48B9F"
            value={aramaMetni}
            onChangeText={setAramaMetni}
          />
        </View>

        {/* LİSTE BAŞLIĞI */}
        <View style={styles.listeUstSatir}>
          <Text style={styles.listeBaslik}>Kayıtlı Arızalar 🧁</Text>
          <View style={styles.sayacPill}>
            <Text style={styles.sayacYazi}>{filtrelenmisTalepler.length} kayıt</Text>
          </View>
        </View>

        {/* TALEP KARTLARI */}
        {filtrelenmisTalepler.length === 0 ? (
          <View style={styles.bosDurum}>
            <Text style={styles.bosDurumIkon}>🎀</Text>
            <Text style={styles.bosDurumYazisi}>
              {talepler.length === 0
                ? 'Henüz girilen bir arıza yok, her şey yolunda!'
                : 'Aradığın kelimeyle eşleşen talep bulunamadı.'}
            </Text>
          </View>
        ) : (
          filtrelenmisTalepler.map((item) => {
            const durumStili = getDurumStili(item.durum);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.talepKarti}
                onPress={() => talepDetayAc(item)}
                onLongPress={() => talepSilOnay(item.id)}
                delayLongPress={500}
                activeOpacity={0.7}
              >
                <View style={styles.talepKartiUst}>
                  <View style={styles.talepSolBaslik}>
                    <Text style={styles.kategoriIkonKucuk}>{item.ikon}</Text>
                    <Text style={styles.talepBaslikMetni} numberOfLines={1}>
                      {item.baslik}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.durumHapi,
                      { backgroundColor: durumStili.bg, borderColor: durumStili.renk },
                    ]}
                  >
                    <Text style={[styles.durumHapiYazi, { color: durumStili.renk }]}>
                      {durumStili.ikon} {item.durum}
                    </Text>
                  </View>
                </View>

                <Text style={styles.talepAciklamaMetni} numberOfLines={2}>
                  {item.aciklama}
                </Text>

                <View style={styles.talepKartiAlt}>
                  <Text style={styles.kategoriEtiket}>#{item.kategori}</Text>
                  <Text style={styles.silmeIpucu}>Silmek için basılı tut ☁️</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* DETAY VE DURUM DEĞİŞTİRME MODALI */}
      <Modal
        visible={detayModalGorunur}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDetayModalGorunur(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalKutu}>
            {secilenTalep && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderSol}>
                    <Text style={styles.modalIkon}>{secilenTalep.ikon}</Text>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.modalKategoriKucuk}>
                        {secilenTalep.kategori} Bildirimi
                      </Text>
                      <Text style={styles.modalBaslik}>{secilenTalep.baslik}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 20 }}>🎀</Text>
                </View>

                <View style={styles.modalGovde}>
                  <Text style={styles.modalEtiketYazi}>Açıklama</Text>
                  <Text style={styles.modalAciklama}>{secilenTalep.aciklama}</Text>

                  <Text style={[styles.modalEtiketYazi, { marginTop: 14 }]}>
                    Durumu Güncelle 🧁
                  </Text>
                  <View style={styles.durumSecimGrubu}>
                    {DURUMLAR.map((d) => {
                      const aktifMi = secilenTalep.durum === d.ad;
                      return (
                        <TouchableOpacity
                          key={d.ad}
                          style={[
                            styles.modalDurumButonu,
                            aktifMi && { backgroundColor: d.renk, borderColor: d.renk },
                          ]}
                          onPress={() => durumDegistir(secilenTalep.id, d.ad)}
                        >
                          <Text
                            style={[
                              styles.modalDurumYazi,
                              aktifMi && styles.modalDurumYaziAktif,
                            ]}
                          >
                            {d.ikon} {d.ad}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalKapatButonu}
                  onPress={() => setDetayModalGorunur(false)}
                >
                  <Text style={styles.modalKapatYazi}>Kapat ✨</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  anaKonteyner: {
    flex: 1,
    backgroundColor: '#FDF7F9', // Yumuşak pudra/krem arka plan
  },
  icerikKonteyner: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerAltBaslik: {
    fontSize: 11,
    color: '#D87093',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerAnaBaslik: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4A2E35',
    marginTop: 2,
  },
  pembeKart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    marginBottom: 18,
    shadowColor: '#F472B6',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  kartBaslikSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kartBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6B3A48',
  },
  tatliIkon: {
    fontSize: 16,
  },
  pastelInput: {
    backgroundColor: '#FFF5F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    color: '#4A2E35',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  cokSatirli: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  etiket: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9C6275',
    marginBottom: 8,
  },
  kategoriKapsayici: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  kategoriHap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F8',
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  kategoriHapSecili: {
    backgroundColor: '#F472B6',
    borderColor: '#EC4899',
  },
  kategoriIkon: {
    fontSize: 12,
    marginRight: 4,
  },
  kategoriYazi: {
    color: '#9C6275',
    fontSize: 12,
    fontWeight: '600',
    kaydetButonuAltYazi: {
  color: '#FFE4E6',
  fontSize: 10,
  marginTop: 2,
  fontWeight: '500',
},
  },
  kategoriYaziSecili: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  kaydetButonu: {
    backgroundColor: '#EC4899',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#EC4899',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  kaydetButonuYazi: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  aramaKapsayici: {
    marginBottom: 16,
  },
  aramaInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    color: '#4A2E35',
    fontSize: 13,
  },
  listeUstSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listeBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A2E35',
  },
  sayacPill: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  sayacYazi: {
    color: '#BE185D',
    fontSize: 11,
    fontWeight: '700',
  },
  bosDurum: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  bosDurumIkon: {
    fontSize: 34,
    marginBottom: 8,
  },
  bosDurumYazisi: {
    color: '#A07080',
    fontSize: 13,
    textAlign: 'center',
  },
  talepKarti: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    borderLeftWidth: 4,
    borderLeftColor: '#F472B6',
    shadowColor: '#F472B6',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  talepKartiUst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  talepSolBaslik: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  kategoriIkonKucuk: {
    fontSize: 14,
    marginRight: 6,
  },
  talepBaslikMetni: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A2E35',
    flex: 1,
  },
  durumHapi: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  durumHapiYazi: {
    fontSize: 10,
    fontWeight: '700',
  },
  talepAciklamaMetni: {
    color: '#7C5562',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  talepKartiAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFF0F5',
    paddingTop: 6,
  },
  kategoriEtiket: {
    color: '#C07D92',
    fontSize: 11,
    fontWeight: '600',
  },
  silmeIpucu: {
    color: '#B8909D',
    fontSize: 10,
    fontStyle: 'italic',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(74, 46, 53, 0.4)', // Yumuşak pembe-kahve tonlu karartma
    justifyContent: 'center',
    padding: 20,
  },
  modalKutu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE8EF',
    paddingBottom: 10,
    marginBottom: 10,
  },
  modalHeaderSol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIkon: {
    fontSize: 22,
  },
  modalKategoriKucuk: {
    fontSize: 10,
    color: '#EC4899',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  modalBaslik: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A2E35',
  },
  modalGovde: {
    marginBottom: 14,
  },
  modalEtiketYazi: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9C6275',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalAciklama: {
    backgroundColor: '#FFF5F8',
    padding: 10,
    borderRadius: 10,
    color: '#5C3843',
    fontSize: 13,
    lineHeight: 18,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  durumSecimGrubu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  modalDurumButonu: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    alignItems: 'center',
  },
  modalDurumYazi: {
    color: '#9C6275',
    fontSize: 11,
    fontWeight: '700',
  },
  modalDurumYaziAktif: {
    color: '#FFFFFF',
  },
  modalKapatButonu: {
    backgroundColor: '#FCE7F3',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalKapatYazi: {
    color: '#BE185D',
    fontWeight: '800',
    fontSize: 13,
  },
});