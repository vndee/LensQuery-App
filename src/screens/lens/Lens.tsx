import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const Lens = (): JSX.Element => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const styles = StyleSheet.create({});
