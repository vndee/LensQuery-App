export type Routes = {
  Login: undefined;
  Register: undefined;
  Lens: undefined;
  Media: {
    type: 'photo' | 'video';
    path: string;
  };
  OnboardingSetup: {
    email: string;
    password: string;
  },
  ChatBox: {
    chatBoxId: string | undefined;
    imageUri: string | undefined;
  };
  ChatList: undefined;
  ChatSearch: undefined;
  Settings: undefined;
  ChangePassword: undefined;
}