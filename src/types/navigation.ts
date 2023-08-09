export type ScreenProps = {
  navigation: any;
  route: any;
};

export type Routes = {
  Login: undefined;
  Register: undefined;
  Lens: undefined;
  Media: {
    type: 'photo' | 'video';
    path: string;
  }
}