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
      clickHere: 'Click here',
    },

    timeDiff: {
      now: 'Just now',
      minutesAgo: 'minutes ago',
      hoursAgo: 'hours ago',
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
      nameEmptyError: 'Name is required',
      emailEmptyError: 'Email is required',
      emailInvalidError: 'Email is invalid',
      passwordEmptyError: 'Password is required',
      confirmPasswordEmptyError: 'Confirm password is required',
      passwordNotMatchError: 'Password does not match',
      emailAlreadyInUse: 'Email already in use',
      weakPassword: 'Password should be at least 6 characters',
      unknownError: 'An error occurred, please try again later!',
    },

    // Onboarding setup
    onboardingSetup: {
      labelInputKey: 'OpenAI API Key',
      pleasePasteOpenAIKey: 'Please paste your OpenAI key here',
      dontKnowHowToGetKey: 'Don\'t know how to get your key?',
      getYourKeyInstruction: 'Please follow the instruction here',
      disclaimer: 'Your key will be stored locally on your device, we will never send it to our server',
      saveBtn: 'Save',
      keyEmptyError: 'Key is required',
      keyInvalidError: 'Key is invalid',
      alertErrorTitle: 'Error',
      alertErrorMessage: 'An error occurred, please try again later!',
      alertErrorClose: 'Close',
      alertErrorRetry: 'Retry',
    },

    // Chat listing
    chatList: {
      title: 'Recent chats',
    },

    // Chat box
    chatBox: {
      placeholder: 'Type a message...',
      optionSearch: 'Search in this chatbox',
      optionClear: 'Clear all messages',
      searchPlaceholder: 'Search...',
    },

    // Setting
    setting: {
      title: 'Settings',
      language: 'Language',
      darkMode: 'Dark mode',
      email: 'Email',
      saveBtn: 'Save',
      actionChangeInformation: 'Change information',
      actionChangePassword: 'Change password',
      actionDeleteAccuont: 'Delete account',
      actionLogOut: 'Log out',
    },

    // Change password
    changePassword: {
      title: 'Change password',
      currentPassword: 'Current password',
      currentPasswordPlaceholder: 'Enter your current password',
      newPassword: 'New password',
      newPasswordPlaceholder: 'Enter your new password',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Enter your confirm password',
      saveBtn: 'Save',
      currentPasswordEmptyError: 'Current password is required',
      newPasswordEmptyError: 'New password is required',
      confirmPasswordEmptyError: 'Confirm password is required',
      passwordNotMatchError: 'Password does not match',
      weakPassword: 'Password should be at least 6 characters',
      wrongPassword: 'Wrong password',
      unknownError: 'An error occurred, please try again later!',
    },
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
      clickHere: 'Xem tại đây',
    },

    timeDiff: {
      now: 'Vừa xong',
      minutesAgo: 'phút trước',
      hoursAgo: 'giờ trước',
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
      nameEmptyError: 'Tên không được để trống',
      emailEmptyError: 'Email không được để trống',
      emailInvalidError: 'Email không hợp lệ',
      passwordEmptyError: 'Mật khẩu không được để trống',
      confirmPasswordEmptyError: 'Mật khẩu xác nhận nhận không được để trống',
      passwordNotMatchError: 'Mật khẩu không khớp',
      emailAlreadyInUse: 'Email đã được sử dụng',
      weakPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
      unknownError: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
    },

    // Onboarding setup
    onboardingSetup: {
      labelInputKey: 'OpenAI API Key',
      pleasePasteOpenAIKey: 'Vui lòng dán OpenAI key của bạn vào đây',
      dontKnowHowToGetKey: 'Chưa biết cách lấy key?',
      getYourKeyInstruction: 'Bạn có thể làm theo hướng dẫn ở đây',
      disclaimer: 'Key sẽ được lưu trữ trên thiết bị của bạn, chúng tôi sẽ không bao giờ gửi nó lên máy chủ của chúng tôi',
      saveBtn: 'Lưu',
      keyEmptyError: 'Key không được để trống',
      keyInvalidError: 'Key không hợp lệ',
      alertErrorTitle: 'Lỗi',
      alertErrorMessage: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
      alertErrorClose: 'Đóng',
      alertErrorRetry: 'Thử lại',
    },

    // Chat listing
    chatList: {
      title: 'Cuộc trò chuyện gần đây',
    },

    // Chat box
    chatBox: {
      placeholder: 'Nhập tin nhắn...',
      optionSearch: 'Tìm kiếm trong tin nhắn',
      optionClear: 'Xóa tất cả tin nhắn',
      searchPlaceholder: 'Tìm kiếm...',
    },

    // Setting
    setting: {
      title: 'Cài đặt',
      language: 'Ngôn ngữ',
      darkMode: 'Chế độ tối',
      email: 'Email',
      saveBtn: 'Lưu',
      actionChangeInformation: 'Thay đổi thông tin',
      actionChangePassword: 'Đổi mật khẩu',
      actionDeleteAccuont: 'Xóa tài khoản',
      actionLogOut: 'Đăng xuất',
    },

    // Change password
    changePassword: {
      title: 'Đổi mật khẩu',
      currentPassword: 'Mật khẩu hiện tại',
      currentPasswordPlaceholder: 'Nhập mật khẩu hiện tại của bạn',
      newPassword: 'Mật khẩu mới',
      newPasswordPlaceholder: 'Nhập mật khẩu mới của bạn',
      confirmPassword: 'Xác nhận mật khẩu',
      confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới của bạn',
      saveBtn: 'Lưu',
      currentPasswordEmptyError: 'Mật khẩu hiện tại không được để trống',
      newPasswordEmptyError: 'Mật khẩu mới không được để trống',
      confirmPasswordEmptyError: 'Xác nhận mật khẩu không được để trống',
      passwordNotMatchError: 'Mật khẩu không khớp',
      weakPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
      wrongPassword: 'Mật khẩu không đúng',
      unknownError: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
    },
  },
});