import { Image } from 'react-native';

export default ({ code = 'vn', size = 24 }) => {
  if (!code) {
    code = 'vn';
  }
  const url = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  return (
    <Image
      source={{ uri: url }}
      style={[{ height: size, width: Math.round((size / 3) * 4) }]}
    />
  );
};