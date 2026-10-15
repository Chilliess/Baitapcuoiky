import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { searchDestinations } from '@/services/destinations';

type Destination = {
  name: string;
  image: string;
  size?: 'large' | 'small';
};

const destinations: Destination[] = [
  {
    name: 'Vũng Tàu',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80',
    size: 'large',
  },
  {
    name: 'Thành phố Hồ Chí Minh',
    image:
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80',
    size: 'large',
  },
  {
    name: 'Đà Nẵng',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Hà Nội',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Đà Lạt',
    image:
      'https://images.unsplash.com/photo-1599708153386-62e5c3f9d9d5?auto=format&fit=crop&w=700&q=80',
  },
];

const propertyTypes = [
  {
    name: 'Khách sạn',
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Căn hộ',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Khu nghỉ dưỡng',
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Biệt thự',
    image:
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=700&q=80',
  },
];

const popularDestinations = ['Hà Nội', 'Ninh Bình', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Sa Pa'];

export default function HomeScreen() {
  const compact = useWindowDimensions().width < 760;
  const [destination, setDestination] = useState('');
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showOccupancy, setShowOccupancy] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');
  const matchingDestinations = destination.trim()
    ? popularDestinations.filter((place) => place.toLocaleLowerCase('vi').includes(destination.trim().toLocaleLowerCase('vi')))
    : popularDestinations;

  const searchDestination = async () => {
    setShowDestinationSuggestions(false);
    const query = destination.trim();
    if (!query) {
      setMessage('Vui lòng nhập điểm đến trước khi tìm kiếm.');
      return;
    }

    setIsSearching(true);
    setMessage('');
    try {
      const places = await searchDestinations(query);
      const place = places[0];
      setMessage(place ? `Đã tìm thấy: ${place.name}, ${place.country}` : 'Không tìm thấy điểm đến này.');
    } catch {
      setMessage('Không thể tìm kiếm lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, compact && styles.heroCompact]}>
        <View style={[styles.navbar, compact && styles.navbarCompact]}>
          <Text style={styles.logo}>Booking.com</Text>
          <View style={[styles.navActions, compact && styles.navActionsCompact]}>
            <Text style={styles.currency}>VND</Text>
            <Image
              source={{ uri: 'https://t-cf.bstatic.com/design-assets/assets/v3.202.0/images-flags/Vn@3x.png' }}
              style={styles.language}
              accessibilityLabel="Cờ Việt Nam"
            />
            <Text style={styles.help}>?</Text>
            {!compact && <Pressable style={styles.propertyLink}><Text style={styles.navText}>Đăng chỗ nghỉ của Quý vị</Text></Pressable>}
            <Pressable style={styles.navButton}>
              <Text style={styles.navButtonText}>Đăng ký</Text>
            </Pressable>
            <Pressable style={styles.navButton}>
              <Text style={styles.navButtonText}>Đăng nhập</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {[
            ['🛏', 'Lưu trú'],
            ['✈', 'Chuyến bay'],
            ['🧳', 'Chuyến bay + Khách sạn'],
            ['🚗', 'Thuê xe'],
            ['✥', 'Hoạt động'],
            ['🚐', 'Xe đưa đón sân bay'],
          ].map(([icon, label], index) => (
            <Pressable key={label} style={[styles.tab, index === 0 && styles.activeTab]}>
              {label === 'Lưu trú' ? (
                <SymbolView
                  name={{ ios: 'bed.double', android: 'bed', web: 'bed' }}
                  tintColor="#ffffff"
                  size={22}
                  fallback={<Text style={styles.tabIcon}>🛏</Text>}
                />
              ) : label === 'Chuyến bay' ? (
                <SymbolView
                  name={{ ios: 'airplane', android: 'flight', web: 'flight' }}
                  tintColor="#ffffff"
                  size={22}
                  fallback={<Text style={styles.tabIcon}>✈</Text>}
                />
              ) : label === 'Chuyến bay + Khách sạn' ? (
                <View style={styles.flightHotelIcon}>
                  <SymbolView
                    name={{ ios: 'airplane', android: 'flight', web: 'flight' }}
                    tintColor="#ffffff"
                    size={17}
                    style={styles.flightHotelPlane}
                  />
                  <SymbolView
                    name={{ ios: 'bed.double', android: 'bed', web: 'bed' }}
                    tintColor="#ffffff"
                    size={17}
                    style={styles.flightHotelBed}
                  />
                </View>
              ) : label === 'Thuê xe' ? (
                <SymbolView
                  name={{ ios: 'car', android: 'directions_car', web: 'directions_car' }}
                  tintColor="#ffffff"
                  size={22}
                  fallback={<Text style={styles.tabIcon}>🚗</Text>}
                />
              ) : label === 'Hoạt động' ? (
                <SymbolView
                  name={{ ios: 'sparkles', android: 'attractions', web: 'attractions' }}
                  tintColor="#ffffff"
                  size={22}
                  fallback={<Text style={styles.tabIcon}>✥</Text>}
                />
              ) : label === 'Xe đưa đón sân bay' ? (
                <SymbolView
                  name={{ ios: 'car', android: 'airport_shuttle', web: 'airport_shuttle' }}
                  tintColor="#ffffff"
                  size={22}
                  fallback={<Text style={styles.tabIcon}>🚐</Text>}
                />
              ) : (
                <Text style={styles.tabIcon}>{icon}</Text>
              )}
              <Text style={styles.tabLabel}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.heroCopy, compact && styles.heroCopyCompact]}>
          <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Tìm chỗ nghỉ tiếp theo của bạn</Text>
          <Text style={[styles.heroSubtitle, compact && styles.heroSubtitleCompact]}>Khám phá ưu đãi khách sạn, nhà nghỉ và nhiều hơn nữa</Text>
        </View>

        <View style={[styles.searchPosition, compact && styles.searchPositionCompact]}>
          <View style={[styles.searchCard, compact && styles.searchCardCompact]}>
          <View style={styles.searchField}>
            <Text style={styles.fieldIcon}>⌖</Text>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldCaption}>Điểm đến</Text>
              <TextInput
                value={destination}
                onChangeText={(value) => {
                  setDestination(value);
                  setShowDestinationSuggestions(true);
                }}
                onFocus={() => setShowDestinationSuggestions(true)}
                onSubmitEditing={() => setShowDestinationSuggestions(false)}
                placeholder="Bạn muốn đi đâu?"
                placeholderTextColor="#172b4d"
                style={styles.destinationInput}
                accessibilityLabel="Điểm đến"
              />
            </View>
          </View>
          <Pressable style={styles.searchField} onPress={() => {
            setShowDestinationSuggestions(false);
            setMessage('Chọn ngày nhận phòng và ngày trả phòng.');
          }}>
            <Text style={styles.fieldIcon}>▣</Text>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldCaption}>Chọn ngày</Text>
              <Text style={styles.fieldValue}>Ngày nhận phòng　—　Ngày trả phòng</Text>
            </View>
          </Pressable>
          <Pressable style={styles.searchField} onPress={() => {
            setShowDestinationSuggestions(false);
            setShowOccupancy(!showOccupancy);
          }}>
            <Text style={styles.fieldIcon}>♙</Text>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldCaption}>Số khách</Text>
              <Text style={styles.fieldValue}>2 người lớn · 0 trẻ em · 1 phòng</Text>
            </View>
            <Text style={styles.chevron}>⌄</Text>
          </Pressable>
          <Pressable style={[styles.searchButton, compact && styles.searchButtonCompact]} onPress={searchDestination} disabled={isSearching}>
            {isSearching ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchButtonText}>Tìm kiếm</Text>}
          </Pressable>
          </View>
          {showDestinationSuggestions && (
            <View style={[styles.destinationSuggestionsLayer, compact && styles.destinationSuggestionsLayerCompact]}>
              <View style={[styles.destinationSuggestionsPanel, compact && styles.destinationSuggestionsPanelCompact]}>
                {!destination.trim() && (
                  <>
                    <Text style={styles.destinationSuggestionsHeading}>Tìm kiếm gần đây của bạn</Text>
                    <Pressable
                      style={styles.destinationRecentRow}
                      onPress={() => {
                        setDestination('Đà Lạt');
                        setShowDestinationSuggestions(false);
                      }}>
                      <Text style={styles.destinationRecentIcon}>◷</Text>
                      <View style={styles.destinationSuggestionCopy}>
                        <Text style={styles.destinationSuggestionName}>Đà Lạt</Text>
                        <Text style={styles.destinationSuggestionMeta}>2 người lớn</Text>
                      </View>
                    </Pressable>
                  </>
                )}
                <Text style={styles.destinationSuggestionsHeading}>Các điểm đến thịnh hành</Text>
                {matchingDestinations.length > 0 ? matchingDestinations.map((place) => (
                  <Pressable
                    key={place}
                    style={styles.destinationSuggestionRow}
                    onPress={() => {
                      setDestination(place);
                      setShowDestinationSuggestions(false);
                    }}>
                    <Text style={styles.destinationPinIcon}>⌖</Text>
                    <View style={styles.destinationSuggestionCopy}>
                      <Text style={styles.destinationSuggestionName}>{place}</Text>
                      <Text style={styles.destinationSuggestionMeta}>Việt Nam</Text>
                    </View>
                  </Pressable>
                )) : (
                  <Text style={styles.destinationNoResults}>Không có gợi ý phù hợp. Nhấn Tìm kiếm để tra cứu.</Text>
                )}
              </View>
            </View>
          )}
        </View>
        {showOccupancy && (
          <View style={styles.occupancyMenu}>
            <Text style={styles.fieldValue}>Người lớn　　　　　　　 −　2　＋</Text>
            <Text style={styles.fieldValue}>Trẻ em　　　　　　　　 −　0　＋</Text>
            <Text style={styles.fieldValue}>Phòng　　　　　　　　　 −　1　＋</Text>
          </View>
        )}
        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>

      <View style={[styles.checks, compact && styles.checksCompact]}>
        <Text style={styles.checkbox}>□</Text>
        <Text style={styles.checkLabel}>Tôi đi công tác</Text>
        <Text style={styles.checkbox}>□</Text>
        <Text style={styles.checkLabel}>Thêm chuyến bay vào tìm kiếm</Text>
      </View>

      <View style={[styles.section, compact && styles.sectionCompact]}>
        <Text style={styles.sectionTitle}>Vì sao chọn Booking.com?</Text>
        <View style={styles.benefits}>
          {[
            ['📝', 'Đặt ngay, thanh toán tại chỗ nghỉ', 'Miễn phí hủy phòng ở hầu hết chỗ nghỉ'],
            ['👍', 'Hơn 300 triệu đánh giá từ du khách', 'Thông tin đáng tin cậy từ những khách lưu trú như bạn'],
            ['🌍', 'Hơn 2 triệu chỗ nghỉ trên toàn thế giới', 'Khách sạn, nhà nghỉ, căn hộ và nhiều hơn nữa'],
            ['🎧', 'Dịch vụ hỗ trợ khách hàng 24/7', 'Chúng tôi luôn sẵn sàng giúp bạn'],
          ].map(([icon, title, text]) => (
            <View style={styles.benefit} key={title}>
              <Text style={styles.benefitIcon}>{icon}</Text>
              <Text style={styles.benefitTitle}>{title}</Text>
              <Text style={styles.benefitText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.offerSection, compact && styles.sectionCompact]}>
        <Text style={[styles.sectionTitle, styles.offerSectionTitle]}>Ưu đãi</Text>
        <Text style={[styles.sectionSubtitle, styles.offerSectionSubtitle]}>Khuyến mãi và ưu đãi đặc biệt dành cho bạn</Text>
        <View style={[styles.offer, compact && styles.offerCompact]}>
          <View style={[styles.offerCopy, compact && styles.offerCopyCompact]}>
            <Text style={styles.offerEyebrow}>Ưu đãi phút chót</Text>
            <Text style={[styles.offerTitle, compact && styles.offerTitleCompact]}>Giảm từ 15% cho kỳ nghỉ cuối năm</Text>
            <Text style={styles.offerText}>Tiết kiệm hơn với ưu đãi phút chót. Đặt trước ngày 7/1/2027 cho kỳ nghỉ từ ngày 1/10/2026 đến 7/1/2027.</Text>
            <Pressable style={styles.blueButton}><Text style={styles.blueButtonText}>Tìm ưu đãi</Text></Pressable>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1507522858036-97b47d1b7f66?auto=format&fit=crop&w=400&q=80' }} style={[styles.offerImage, compact && styles.offerImageCompact]} />
        </View>
      </View>

      <View style={[styles.section, compact && styles.sectionCompact]}>
        <Text style={styles.sectionTitle}>Khám phá theo loại chỗ nghỉ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.propertyList}>
          {propertyTypes.map((property) => (
            <Pressable key={property.name} style={styles.propertyCard}>
              <Image source={{ uri: property.image }} style={styles.propertyImage} />
              <Text style={styles.propertyName}>{property.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.section, compact && styles.sectionCompact]}>
        <Text style={styles.sectionTitle}>Điểm đến nổi bật</Text>
        <Text style={styles.sectionSubtitle}>Những điểm đến được du khách Việt Nam yêu thích</Text>
        <View style={styles.destinationGrid}>
          {destinations.map((place) => (
            <Pressable key={place.name} style={[styles.destinationCard, place.size === 'large' ? compact ? styles.destinationLargeCompact : styles.destinationLarge : compact && styles.destinationCompact]}>
              <Image source={{ uri: place.image }} style={styles.destinationImage} />
              <View style={styles.destinationOverlay} />
              <Text style={styles.destinationName}>{place.name} 🇻🇳</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 48 },
  hero: { backgroundColor: '#003b95', paddingHorizontal: 30, paddingBottom: 76 },
  heroCompact: { paddingHorizontal: 16, paddingBottom: 74 },
  navbar: { maxWidth: 1600, width: '100%', alignSelf: 'center', minHeight: 92, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navbarCompact: { flexDirection: 'column', alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  logo: { color: '#fff', fontSize: 34, fontWeight: '800' },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  navActionsCompact: { width: '100%', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  currency: { color: '#fff', fontSize: 16, fontWeight: '700' },
  language: { width: 32, height: 32, borderRadius: 16 },
  help: { borderWidth: 1, borderColor: '#fff', color: '#fff', borderRadius: 20, width: 24, height: 24, textAlign: 'center', fontWeight: '700' },
  propertyLink: { paddingHorizontal: 4 },
  navText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  navButton: { backgroundColor: '#fff', borderRadius: 3, paddingHorizontal: 18, paddingVertical: 13 },
  navButtonText: { color: '#006ce4', fontWeight: '700', fontSize: 17 },
  tabs: { maxWidth: 1600, width: '100%', alignSelf: 'center', justifyContent: 'center', gap: 10 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 28 },
  activeTab: { borderWidth: 1, borderColor: '#fff', backgroundColor: '#1b55a5' },
  tabIcon: { color: '#fff', fontSize: 22 },
  flightHotelIcon: { width: 31, height: 26, position: 'relative' },
  flightHotelPlane: { position: 'absolute', top: 0, left: 0, width: 18, height: 18 },
  flightHotelBed: { position: 'absolute', right: 0, bottom: 0, width: 18, height: 18 },
  tabLabel: { color: '#fff', fontSize: 18, fontWeight: '600' },
  heroCopy: { maxWidth: 1600, width: '100%', alignSelf: 'center', alignItems: 'center', paddingTop: 100, paddingBottom: 128 },
  heroCopyCompact: { paddingTop: 42, paddingBottom: 90 },
  heroTitle: { color: '#fff', fontSize: 60, fontWeight: '800', textAlign: 'center' },
  heroTitleCompact: { fontSize: 38, lineHeight: 45 },
  heroSubtitle: { color: '#fff', fontSize: 30, marginTop: 15, textAlign: 'center' },
  heroSubtitleCompact: { fontSize: 18 },
  searchPosition: { position: 'absolute', left: 0, right: 0, bottom: -23, alignItems: 'center', zIndex: 3 },
  searchPositionCompact: { left: 16, right: 16, bottom: -25 },
  searchCard: { width: '100%', maxWidth: 1600, alignSelf: 'center', flexDirection: 'row', borderWidth: 5, borderColor: '#febb02', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden' },
  searchCardCompact: { flexDirection: 'column' },
  destinationSuggestionsLayer: { position: 'absolute', top: 84, width: '100%', maxWidth: 1600, alignSelf: 'center', zIndex: 10, elevation: 10 },
  destinationSuggestionsLayerCompact: { top: 80, maxWidth: undefined },
  destinationSuggestionsPanel: { width: '34%', minWidth: 320, maxWidth: 560, maxHeight: 520, overflow: 'hidden', backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  destinationSuggestionsPanelCompact: { width: '100%', minWidth: 0 },
  destinationSuggestionsHeading: { color: '#1a1a1a', fontSize: 17, fontWeight: '700', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 9 },
  destinationRecentRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 14 },
  destinationRecentIcon: { width: 30, color: '#262626', fontSize: 29, textAlign: 'center' },
  destinationSuggestionRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 14, borderTopWidth: 1, borderTopColor: '#e5e5e5' },
  destinationPinIcon: { width: 30, color: '#262626', fontSize: 29, textAlign: 'center' },
  destinationSuggestionCopy: { flex: 1 },
  destinationSuggestionName: { color: '#1a1a1a', fontSize: 17, fontWeight: '700' },
  destinationSuggestionMeta: { color: '#172b4d', fontSize: 15, marginTop: 1 },
  destinationNoResults: { color: '#5d6673', fontSize: 15, paddingHorizontal: 16, paddingVertical: 18 },
  searchField: { flex: 1, minHeight: 76, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, borderRightWidth: 4, borderRightColor: '#febb02', backgroundColor: '#fff' },
  fieldIcon: { color: '#5d6673', fontSize: 32, marginRight: 15 },
  fieldContent: { flex: 1 },
  fieldCaption: { color: '#5d6673', fontSize: 16, marginBottom: 4 },
  fieldValue: { color: '#172b4d', fontSize: 18, fontWeight: '600' },
  destinationInput: { padding: 0, color: '#172b4d', fontSize: 18, fontWeight: '600', height: 26 },
  chevron: { color: '#172b4d', fontSize: 25 },
  searchButton: { width: 170, minHeight: 76, backgroundColor: '#006ce4', justifyContent: 'center', alignItems: 'center' },
  searchButtonCompact: { width: '100%', minHeight: 54 },
  searchButtonText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  occupancyMenu: { position: 'absolute', zIndex: 2, right: 170, bottom: -168, width: 270, padding: 18, borderRadius: 6, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5, gap: 15 },
  message: { position: 'absolute', bottom: -57, left: 30, color: '#fff', fontSize: 14 },
  checks: { maxWidth: 1600, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 30, paddingTop: 40, paddingBottom: 20 },
  checksCompact: { paddingHorizontal: 16, paddingTop: 44, flexWrap: 'wrap' },
  checkbox: { color: '#172b4d', fontSize: 28 },
  checkLabel: { color: '#172b4d', fontSize: 17, marginRight: 18 },
  section: { maxWidth: 1600, width: '100%', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 30, paddingTop: 46 },
  sectionCompact: { paddingHorizontal: 16, paddingTop: 30 },
  sectionTitle: { color: '#172b4d', fontSize: 32, fontWeight: '800', textAlign: 'center' },
  sectionSubtitle: { color: '#5d6673', fontSize: 20, marginTop: 9, marginBottom: 24, textAlign: 'center' },
  benefits: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  benefit: { flex: 1, minWidth: 250, minHeight: 270, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderColor: '#e6e6e6', borderWidth: 1, borderRadius: 12, padding: 24 },
  benefitIcon: { fontSize: 52, marginBottom: 24, textAlign: 'center' },
  benefitTitle: { color: '#172b4d', fontSize: 21, fontWeight: '800', lineHeight: 30, textAlign: 'center' },
  benefitText: { color: '#172b4d', fontSize: 18, lineHeight: 26, marginTop: 14, textAlign: 'center' },
  offerSection: { alignItems: 'stretch' },
  offerSectionTitle: { textAlign: 'left' },
  offerSectionSubtitle: { textAlign: 'left' },
  offer: { width: '100%', minHeight: 190, borderWidth: 1, borderColor: '#e2e2e2', borderRadius: 10, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  offerCompact: { flexDirection: 'column-reverse', alignItems: 'stretch', gap: 14 },
  offerCopy: { flex: 1, alignItems: 'flex-start', paddingRight: 24 },
  offerCopyCompact: { paddingRight: 0 },
  offerEyebrow: { color: '#172b4d', fontSize: 14 },
  offerTitle: { color: '#172b4d', fontSize: 28, fontWeight: '800', marginVertical: 12, textAlign: 'left' },
  offerTitleCompact: { fontSize: 23, lineHeight: 29 },
  offerText: { color: '#172b4d', fontSize: 18, lineHeight: 27, textAlign: 'left' },
  offerImage: { width: 160, height: 160, borderRadius: 5 },
  offerImageCompact: { width: '100%', height: 165 },
  blueButton: { alignSelf: 'flex-start', backgroundColor: '#006ce4', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 5, marginTop: 15 },
  blueButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  propertyList: { justifyContent: 'center', gap: 18, paddingTop: 18 },
  propertyCard: { width: 280, alignItems: 'center' },
  propertyImage: { width: 280, height: 195, borderRadius: 10 },
  propertyName: { color: '#172b4d', fontSize: 21, fontWeight: '800', marginTop: 14 },
  destinationGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 18 },
  destinationCard: { width: '31.5%', height: 245, borderRadius: 12, overflow: 'hidden' },
  destinationLarge: { width: '48.5%', height: 320 },
  destinationLargeCompact: { width: '48.5%', height: 220 },
  destinationCompact: { width: '48.5%', height: 195 },
  destinationImage: { width: '100%', height: '100%' },
  destinationOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  destinationName: { position: 'absolute', top: 22, left: 0, right: 0, color: '#fff', fontSize: 27, fontWeight: '800', textAlign: 'center' },
});
