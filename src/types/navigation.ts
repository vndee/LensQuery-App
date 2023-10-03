import {TGetModelPropertiesResponse} from './openrouter';

export type OCRType = 'FREE_TEXT' | 'DOCUMENT_TEXT' | 'EQUATION_TEXT';

export type Routes = {
  Login: undefined;
  Register: undefined;
  Agreement: {
    type: 'terms' | 'privacy';
  };
  ResetPassword: undefined;
  Lens: undefined;
  Media: {
    type: 'photo' | 'video';
    path: string;
  };
  OnboardingSetup: {
    email: string;
    password: string;
  };
  ChatBox: {
    chatBoxId: string | undefined;
    imageUri: string | undefined;
    type: OCRType;
  };
  ChatList: undefined;
  ChatSearch: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  ModelSelection: {
    provider: string | undefined;
    callback: (item: TGetModelPropertiesResponse) => void;
    key: string | null;
  };
  Paywall: undefined;
  Packages: {
    from: 'chatbox' | 'settings';
  };
};

export type Label = {
  id: OCRType;
  label: string;
};

export const OCRLabels: Array<Label> = [
  {label: 'Free Text', id: 'FREE_TEXT'},
  {label: 'Document', id: 'DOCUMENT_TEXT'},
  {label: 'Equation', id: 'EQUATION_TEXT'},
];
