import Realm from "realm";

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
  };
  ChatList: undefined;
}