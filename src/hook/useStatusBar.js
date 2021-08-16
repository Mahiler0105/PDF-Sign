import React from 'react';
import {Platform, NativeModules} from 'react-native';

export const useStatusBar = () => {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      NativeModules.StatusBarManager.getHeight(response => {
        setHeight(response.height);
      });
    }
  }, []);

  return {height};
};
