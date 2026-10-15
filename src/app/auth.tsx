import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

type AuthMode = 'login' | 'register';
type AuthStep = 'email' | 'password';

function AppleMark() {
  return (
    <View style={styles.appleMark} accessible={false}>
      <View style={styles.appleBody} />
      <View style={styles.appleBite} />
      <View style={styles.appleLeaf} />
    </View>
  );
}

export default function AuthScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const registering = mode === 'register';
  const compact = useWindowDimensions().width < 600;
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const continueWithEmail = () => {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setEmail(normalizedEmail);
    setMessage('');
    setStep('password');
  };

  const submitAccount = () => {
    if (registering && !name.trim()) {
      setMessage('Vui lòng nhập họ và tên.');
      return;
    }
    if (password.length < 8) {
      setMessage('Mật khẩu cần có ít nhất 8 ký tự.');
      return;
    }
    if (registering && password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setMessage('Giao diện đã sẵn sàng; cần kết nối API tài khoản để hoàn tất.');
  };

  const switchMode = (nextMode: AuthMode) => {
    setStep('email');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
    router.replace({ pathname: '/auth', params: { mode: nextMode } });
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Pressable onPress={() => router.replace('/')} accessibilityRole="link" accessibilityLabel="Về trang chủ">
            <Text style={styles.logo}>Booking.com</Text>
          </Pressable>
          <View style={styles.headerActions}>
            <Image
              source={{ uri: 'https://t-cf.bstatic.com/design-assets/assets/v3.202.0/images-flags/Vn@3x.png' }}
              style={styles.flag}
              accessibilityLabel="Cờ Việt Nam"
            />
            <Pressable style={styles.helpButton} accessibilityRole="button" accessibilityLabel="Trợ giúp">
              <Text style={styles.helpText}>?</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, compact && styles.scrollContentCompact]}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.form, compact && styles.formCompact]}>
          <Text style={styles.title}>
            {step === 'email' ? 'Đăng nhập hoặc tạo tài khoản' : registering ? 'Tạo tài khoản' : 'Nhập mật khẩu'}
          </Text>
          <Text style={styles.description}>
            {step === 'email'
              ? 'Bạn có thể đăng nhập tài khoản Booking.com của mình để truy cập các dịch vụ của chúng tôi.'
              : registering
                ? `Tạo tài khoản bằng địa chỉ ${email}.`
                : `Tiếp tục đăng nhập bằng địa chỉ ${email}.`}
          </Text>

          {step === 'email' ? (
            <>
              <Text style={styles.label}>Địa chỉ email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập địa chỉ email của bạn"
                placeholderTextColor="#65727f"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                accessibilityLabel="Địa chỉ email"
                returnKeyType="go"
                onSubmitEditing={continueWithEmail}
              />
              <Pressable style={styles.primaryButton} onPress={continueWithEmail} accessibilityRole="button">
                <Text style={styles.primaryButtonText}>Tiếp tục với email</Text>
              </Pressable>

              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>hoặc sử dụng một trong các lựa chọn này</Text>
                <View style={styles.separatorLine} />
              </View>

              <View style={styles.socialButtons}>
                <Pressable style={styles.socialButton} onPress={() => setMessage('Đăng nhập Google chưa được kết nối.') } accessibilityRole="button" accessibilityLabel="Tiếp tục với Google">
                  <Text style={[styles.socialGlyph, styles.googleGlyph]}>G</Text>
                </Pressable>
                <Pressable style={styles.socialButton} onPress={() => setMessage('Đăng nhập Apple chưa được kết nối.') } accessibilityRole="button" accessibilityLabel="Tiếp tục với Apple">
                  <AppleMark />
                </Pressable>
                <Pressable style={styles.socialButton} onPress={() => setMessage('Đăng nhập Facebook chưa được kết nối.') } accessibilityRole="button" accessibilityLabel="Tiếp tục với Facebook">
                  <Text style={[styles.socialGlyph, styles.facebookGlyph]}>f</Text>
                </Pressable>
              </View>

              <Text style={styles.recoveryText}>
                Bạn mất quyền truy cập vào email?{' '}
                <Text style={styles.linkText} onPress={() => setMessage('Vui lòng liên hệ bộ phận hỗ trợ để khôi phục tài khoản.')}>Khôi phục tài khoản của bạn</Text>
              </Text>
              <Text style={styles.modeSwitch}>
                {registering ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
                <Text style={styles.linkText} onPress={() => switchMode(registering ? 'login' : 'register')}>
                  {registering ? 'Đăng nhập' : 'Đăng ký'}
                </Text>
              </Text>
            </>
          ) : (
            <>
              {registering && (
                <>
                  <Text style={styles.label}>Họ và tên</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập họ và tên của bạn"
                    placeholderTextColor="#65727f"
                    style={styles.input}
                    autoComplete="name"
                    textContentType="name"
                    accessibilityLabel="Họ và tên"
                  />
                </>
              )}
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#65727f"
                style={styles.input}
                secureTextEntry
                autoComplete={registering ? 'new-password' : 'current-password'}
                textContentType={registering ? 'newPassword' : 'password'}
                accessibilityLabel="Mật khẩu"
              />
              {registering && (
                <>
                  <Text style={[styles.label, styles.confirmLabel]}>Xác nhận mật khẩu</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#65727f"
                    style={styles.input}
                    secureTextEntry
                    textContentType="newPassword"
                    accessibilityLabel="Xác nhận mật khẩu"
                  />
                </>
              )}
              <Pressable style={styles.primaryButton} onPress={submitAccount} accessibilityRole="button">
                <Text style={styles.primaryButtonText}>{registering ? 'Tạo tài khoản' : 'Đăng nhập'}</Text>
              </Pressable>
              <Pressable style={styles.changeEmail} onPress={() => { setStep('email'); setMessage(''); }}>
                <Text style={styles.linkText}>Thay đổi địa chỉ email</Text>
              </Pressable>
            </>
          )}

          {!!message && <Text style={styles.message} accessibilityRole="alert">{message}</Text>}

          <View style={styles.legal}>
            <Text style={styles.legalText}>
              Bằng cách đăng nhập hoặc tạo tài khoản, bạn đồng ý với{' '}
              <Text style={styles.linkText}>Điều khoản và điều kiện</Text> cũng như{' '}
              <Text style={styles.linkText}>Chính sách bảo mật</Text> của chúng tôi.
            </Text>
          </View>
          <Text style={styles.copyright}>Bảo lưu mọi quyền.{ '\n' }Bản quyền (2006 - 2026) - Booking.com™</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  header: { height: 81, backgroundColor: '#003b95', paddingHorizontal: 24 },
  headerInner: { width: '100%', maxWidth: 1360, alignSelf: 'center', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#fff', fontSize: 23, fontWeight: '800' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 34 },
  flag: { width: 30, height: 30, borderRadius: 15 },
  helpButton: { width: 26, height: 26, borderWidth: 1.5, borderColor: '#fff', borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  helpText: { color: '#fff', fontSize: 17, lineHeight: 21, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20 },
  scrollContentCompact: { paddingHorizontal: 18 },
  form: { width: '100%', maxWidth: 502, alignSelf: 'center', paddingTop: 78, paddingBottom: 28 },
  formCompact: { paddingTop: 38 },
  title: { color: '#1a1a1a', fontSize: 25, lineHeight: 32, fontWeight: '700', marginBottom: 20 },
  description: { color: '#1a1a1a', fontSize: 16, lineHeight: 24, marginBottom: 22 },
  label: { color: '#1a1a1a', fontSize: 16, fontWeight: '700', marginBottom: 5 },
  input: { width: '100%', height: 51, borderWidth: 2, borderColor: '#006ce4', borderRadius: 8, paddingHorizontal: 11, fontSize: 16, color: '#1a1a1a', backgroundColor: '#fff', marginBottom: 17 },
  primaryButton: { width: '100%', minHeight: 60, borderRadius: 5, backgroundColor: '#006ce4', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  separator: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22, marginBottom: 32 },
  separatorLine: { height: 1, flex: 1, backgroundColor: '#dedede' },
  separatorText: { color: '#333', fontSize: 15, textAlign: 'center' },
  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  socialButton: { width: 90, height: 90, borderWidth: 1, borderColor: '#dedede', borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  socialGlyph: { fontSize: 35, fontWeight: '700' },
  googleGlyph: { color: '#4285f4' },
  appleMark: { width: 30, height: 31, position: 'relative' },
  appleBody: { position: 'absolute', left: 3, bottom: 1, width: 23, height: 22, backgroundColor: '#111', borderRadius: 11 },
  appleBite: { position: 'absolute', right: 0, top: 8, width: 9, height: 9, backgroundColor: '#fff', borderRadius: 5 },
  appleLeaf: { position: 'absolute', top: 1, left: 16, width: 9, height: 5, backgroundColor: '#111', borderTopLeftRadius: 8, borderBottomRightRadius: 8, transform: [{ rotate: '-35deg' }] },
  facebookGlyph: { color: '#fff', backgroundColor: '#4267b2', width: 30, height: 30, lineHeight: 34, textAlign: 'center', fontSize: 30 },
  recoveryText: { color: '#172b4d', textAlign: 'center', fontSize: 16, lineHeight: 24, marginTop: 36 },
  modeSwitch: { color: '#172b4d', textAlign: 'center', fontSize: 15, marginTop: 20 },
  linkText: { color: '#006ce4' },
  confirmLabel: { marginTop: 2 },
  changeEmail: { alignSelf: 'flex-start', marginTop: 16 },
  message: { color: '#9b1c1c', fontSize: 14, lineHeight: 20, marginTop: 14 },
  legal: { borderTopWidth: 1, borderTopColor: '#dedede', marginTop: 58, paddingTop: 21 },
  legalText: { color: '#172b4d', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  copyright: { color: '#172b4d', fontSize: 14, lineHeight: 23, textAlign: 'center', marginTop: 16 },
});
