import LocalizedStrings from 'react-native-localization';

export default new LocalizedStrings({
  // English
  en: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      yes: 'Yes',
      no: 'No',
      save: 'Save',
      delete: 'Delete',
      logout: 'Logout',
      login: 'Login',
      signup: 'Signup',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      close: 'Close',
      clear: 'Clear',
      clearAll: 'Clear all',
    },

    // Login
    login: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginBtn: 'Login',
      dontHaveAccount: 'Don\'t have an account?',
      register: 'Register',
      emailEmptyError: 'Email is required',
      emailInvalidError: 'Email is invalid',
      passwordEmptyError: 'Password is required',
      emailNotFound: 'Email not found',
      wrongPassword: 'Wrong password',
      userDisabled: 'User disabled',
      tooManyRequests: 'Too many failed attempts, please try again later!',
      unknownError: 'An error occurred, please try again later!',
    }
  },
  // Vietnamese
  vi: {
    // Common
    common: {
      ok: 'Đồng ý',
      cancel: 'Hủy',
      yes: 'Có',
      no: 'Không',
      save: 'Lưu',
      delete: 'Xóa',
      logout: 'Đăng xuất',
      login: 'Đăng nhập',
      signup: 'Đăng ký',
      back: 'Trở lại',
      next: 'Tiếp theo',
      done: 'Hoàn tất',
      close: 'Đóng',
      clear: 'Xóa',
      clearAll: 'Xóa tất cả',
    },

    // Login
    login: {
      title: 'Đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      rememberMe: 'Ghi nhớ tôi',
      forgotPassword: 'Quên mật khẩu?',
      loginBtn: 'Đăng nhập',
      dontHaveAccount: 'Chưa có tài khoản?',
      register: 'Đăng ký',
      emailEmptyError: 'Email không được để trống',
      emailInvalidError: 'Email không hợp lệ',
      passwordEmptyError: 'Mật khẩu không được để trống',
      emailNotFound: 'Email không tồn tại',
      wrongPassword: 'Mật khẩu không đúng',
      userDisabled: 'Tài khoản đã bị khóa',
      tooManyRequests: 'Quá nhiều lần thử, vui lòng thử lại sau!',
      unknownError: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
    }
  },
});