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
      unknownError: 'An error occurred, please try again later!',
      alertTitle: 'Alert',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
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
      emailAlreadyInUseError: 'Email already in use',
    },

    // Onboarding setup
    onboardingSetup: {
      openAILabelInputKey: 'OpenAI API Key',
      pleasePasteOpenAIKey: 'Please paste your OpenAI key here',
      openRouterLabelInputKey: 'OpenRouter API Key',
      pleasePasteOpenRouterKey: 'Please paste your OpenRouter key here',
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

    // Reset password
    resetPassword: {
      title: 'Reset password',
      recoveryEmailPlaceholder: 'Enter your email',
      recoveryEmailHelper: 'Please enter your email to receive the reset password code',
      sendBtn: 'Send',
      verifyBtn: 'Verify',
      resetSuccessBtn: 'Reset success',
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      emailNotFound: 'Email not found',
    },

    // Chat listing
    chatList: {
      title: 'Recent chats',
      searchPlaceholder: 'Search...',
      selectedOption: 'Select',
      editNameOption: 'Edit name',
      deleteOption: 'Delete',
      deleteConfirmationMessage: 'Are you sure you want to delete this chat?',
      deleteConfirmationYes: 'Yes',
      deleteConfirmationNo: 'No',
      selected: 'Selected',
      chatBox: 'chat box',
      notFound: 'No chat found',
      untitle: 'Untitled',
      newName: 'New title',
      saveName: 'Save',
      cancelName: 'Cancel',
      deleteBatchMessageWarning: 'You have selected {0} chat boxes. Are you sure you want to delete them?',
    },

    // Chat box
    chatBox: {
      title: 'Chat',
      placeholder: 'Type a message...',
      optionSearch: 'Search in this chatbox',
      optionClear: 'Clear all messages',
      searchPlaceholder: 'Search...',
      cannotRecognizeMessage: 'Cannot recognize the text',
      notFoundKeyModalTitle: 'API key issue',
      notFoundKeyModalDescription: 'Your key is not found or invalid.\nPlease go to Settings to add new key',
      notFoundKeyModalAction: 'Go to Settings',
      messageOptionCopy: 'Copy',
      messageOptionDelete: 'Delete message',
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
      providerLabel: 'Provider',
      defaultModel: 'Default model',
      openAIProvider: 'OpenAI',
      openRouterProvider: 'OpenRouter',
      keyLabel: 'Label',
      keyCreditLimit: 'Credit limit',
      keyCreditUsed: 'Credit used',
      keyCreditRemaining: 'Credit remaining',
      keyRateLimit: 'Rate limit',
      addCreditBtn: 'Add credit',
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

    // Model selection
    modelSelection: {
      title: 'Model selection',
      searchPlaceholder: "openai/gpt-3.5-turbo",
      promptCost: "Prompt cost",
      completionCost: "Completion cost",
      contextLength: "Context length",
    },

    // Paywall
    paywall: {
      perMonth: 'per month',
      textOCRSnap: 'Text OCR Snap',
      equationOCRSnap: 'Equation OCR Snap',
      fullChatExperience: 'Full Chat Experience',
      customLLMProvider: 'Custom LLM Provider',
      customLLMModel: 'Custom LLM Model',
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
      clickHere: 'Xem tại đây',
      unknownError: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
      alertTitle: 'Thông báo',
      terms: 'Điều khoản sử dụng',
      privacy: 'Chính sách bảo mật',
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
      emailAlreadyInUseError: 'Email đã được sử dụng',
    },

    // Onboarding setup
    onboardingSetup: {
      openAILabelInputKey: 'OpenAI API Key',
      pleasePasteOpenAIKey: 'Vui lòng dán OpenAI key của bạn vào đây',
      openRouterLabelInputKey: 'OpenRouter API Key',
      pleasePasteOpenRouterKey: 'Vui lòng dán OpenRouter key của bạn vào đây',
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

    // Reset password
    resetPassword: {
      title: 'Đặt lại mật khẩu',
      recoveryEmailPlaceholder: 'Nhập email của bạn',
      recoveryEmailHelper: 'Vui lòng nhập email của bạn để nhận mã đặt lại mật khẩu',
      sendBtn: 'Gửi',
      verifyBtn: 'Xác nhận',
      resetSuccessBtn: 'Đặt lại thành công',
      emailRequired: 'Email không được để trống',
      emailInvalid: 'Email không hợp lệ',
      emailNotFound: 'Email không tồn tại',
    },

    // Chat listing
    chatList: {
      title: 'Cuộc trò chuyện gần đây',
      searchPlaceholder: 'Tìm kiếm...',
      selectedOption: 'Chọn',
      editNameOption: 'Đổi tên',
      deleteOption: 'Xóa',
      deleteConfirmationMessage: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này?',
      deleteConfirmationYes: 'Có',
      deleteConfirmationNo: 'Không',
      selected: 'Đã chọn',
      chatBox: 'cuộc trò chuyện',
      notFound: 'Không tìm thấy cuộc trò chuyện nào',
      untitle: 'Chưa có tiêu đề',
      newName: 'Tiêu đề mới',
      saveName: 'Luư',
      cancelName: 'Huỷ',
      deleteBatchMessageWarning: 'Bạn đã chọn {0} cuộc trò chuyện. Bạn có chắc chắn muốn xóa chúng?',
    },

    // Chat box
    chatBox: {
      title: 'Trò chuyện',
      placeholder: 'Nhập tin nhắn...',
      optionSearch: 'Tìm kiếm trong tin nhắn',
      optionClear: 'Xóa tất cả tin nhắn',
      searchPlaceholder: 'Tìm kiếm...',
      cannotRecognizeMessage: 'Không thể nhận diện văn bản',
      notFoundKeyModalTitle: 'Lỗi API key',
      notFoundKeyModalDescription: 'Key của bạn không tồn tại hoặc không hợp lệ.\nVui lòng đến cài đặt để thêm key mới',
      notFoundKeyModalAction: 'Đến cài đặt',
      messageOptionCopy: 'Sao chép',
      messageOptionDelete: 'Xóa tin nhắn',
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
      providerLabel: 'Nhà cung cấp',
      defaultModel: 'Mô hình mặc định',
      openAIProvider: 'OpenAI',
      openRouterProvider: 'OpenRouter',
      keyLabel: 'Nhãn',
      keyCreditLimit: 'Giới hạn credit',
      keyCreditUsed: 'Credit đã dùng',
      keyCreditRemaining: 'Credit còn lại',
      keyRateLimit: 'Giới hạn tốc độ',
      addCreditBtn: 'Thêm credit',
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

    // Model selection
    modelSelection: {
      title: 'Chọn mô hình',
      searchPlaceholder: "openai/gpt-3.5-turbo",
      promptCost: "Prompt cost",
      completionCost: "Completion cost",
      contextLength: "Context length",
    },

    // Paywall
    paywall: {
      perMonth: 'mỗi tháng',
      textOCRSnap: 'Text OCR Snap',
      equationOCRSnap: 'Equation OCR Snap',
      fullChatExperience: 'Full Chat Experience',
      customLLMProvider: 'Custom LLM Provider',
      customLLMModel: 'Custom LLM Model',
    }
  },
});