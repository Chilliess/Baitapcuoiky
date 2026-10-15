import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Khám phá</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Ứng dụng mẫu này có một số ví dụ{'\n'}giúp bạn bắt đầu làm quen.
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Tài liệu Expo</ThemedText>
                <SymbolView
                  tintColor={theme.text}
                  name={{ ios: 'arrow.up.right.square', android: 'link', web: 'link' }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="Điều hướng theo cấu trúc tệp">
            <ThemedText type="small">
              Ứng dụng có hai màn hình: <ThemedText type="code">src/app/index.tsx</ThemedText> và{' '}
              <ThemedText type="code">src/app/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText type="small">
              Tệp bố cục <ThemedText type="code">src/app/_layout.tsx</ThemedText> thiết lập
              thanh điều hướng.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="linkPrimary">Tìm hiểu thêm</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Hỗ trợ Android, iOS và web">
            <ThemedView type="backgroundElement" style={styles.collapsibleContent}>
              <ThemedText type="small">
                Bạn có thể chạy dự án này trên Android, iOS hoặc web. Để mở phiên bản web,
                nhấn <ThemedText type="smallBold">w</ThemedText> trong cửa sổ dòng lệnh đang chạy
                dự án.
              </ThemedText>
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                style={styles.imageTutorial}
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title="Hình ảnh">
            <ThemedText type="small">
              Với hình ảnh tĩnh, bạn có thể dùng hậu tố <ThemedText type="code">@2x</ThemedText> và{' '}
              <ThemedText type="code">@3x</ThemedText> để cung cấp tệp phù hợp với mật độ điểm ảnh
              của từng màn hình.
            </ThemedText>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.imageReact} />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="linkPrimary">Tìm hiểu thêm</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Thành phần giao diện sáng và tối">
            <ThemedText type="small">
              Mẫu này hỗ trợ giao diện sáng và tối. Hook{' '}
              <ThemedText type="code">useColorScheme()</ThemedText> giúp xác định giao diện hiện tại
              của người dùng để điều chỉnh màu sắc phù hợp.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="linkPrimary">Tìm hiểu thêm</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Hiệu ứng chuyển động">
            <ThemedText type="small">
              Mẫu này có ví dụ về một thành phần chuyển động. Thành phần{' '}
              <ThemedText type="code">src/components/ui/collapsible.tsx</ThemedText> sử dụng thư viện{' '}
              <ThemedText type="code">react-native-reanimated</ThemedText> để tạo hiệu ứng mở rộng
              phần hướng dẫn này.
            </ThemedText>
          </Collapsible>
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: 'center',
    gap: Spacing.one,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: 'center',
  },
  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});
