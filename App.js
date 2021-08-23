import React from 'react';
import {RNNotificationBanner} from 'react-native-notification-banner';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import Application from './src/index';
import Icon from 'react-native-vector-icons/FontAwesome';

let icon = (
  <Icon family={'FontAwesome'} name={'edit'} color={'#000000'} size={30} />
);

const App = () => {
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      const {
        notification: {body: subTitle, title},
      } = remoteMessage;
      RNNotificationBanner.Show({
        title,
        subTitle,
        withIcon: true,
        icon,
        titleColor: '#FFFFFF',
        subTitleColor: '#FFFFFF',
        isSwipeToDismissEnabled: true,
        tintColor: '#eaa2a2',
      });
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log(token);
      });

    return messaging().onTokenRefresh(token => {
      console.log('saved token', token);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <Application />
    </SafeAreaProvider>
  );
};

export default App;
