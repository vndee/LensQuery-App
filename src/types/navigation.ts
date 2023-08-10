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
  }
}