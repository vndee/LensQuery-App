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
    },

    // Register
    register: {
      title: 'Register',
      name: 'Name',
      namePlaceholder: 'Enter your name',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Enter your confirm password',
      registerBtn: 'Register',
      disclaimer: 'By registering, you agree to our',
      terms: 'Terms of Service',
      and: 'and',
      privacy: 'Privacy Policy',
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
    },

    // Register
    register: {
      title: 'Đăng ký',
      name: 'Tên',
      namePlaceholder: 'Nhập tên của bạn',
      email: 'Email',
      emailPlaceholder: 'Nhập email của bạn',
      password: 'Mật khẩu',
      passwordPlaceholder: 'Nhập mật khẩu của bạn',
      confirmPassword: 'Xác nhận mật khẩu',
      confirmPasswordPlaceholder: 'Nhập lại mật khẩu của bạn',
      registerBtn: 'Đăng ký',
      disclaimer: 'Bằng cách đăng ký, bạn đồng ý với',
      terms: 'Điều khoản dịch vụ',
      and: 'và',
      privacy: 'Chính sách bảo mật',
    }
  },
});