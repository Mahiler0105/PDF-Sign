import React from 'react';
import Application from './src/index';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <Application />
    </SafeAreaProvider>
  );
};

export default App;
