import React from 'react';
import {RNNotificationBanner} from 'react-native-notification-banner';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import Application from './src/index';
import Icon from 'react-native-vector-icons/FontAwesome';

Icon.loadFont('AntDesign.ttf');
Icon.loadFont('Entypo.ttf');
Icon.loadFont('EvilIcons.ttf');
Icon.loadFont('Feather.ttf');
Icon.loadFont('FontAwesome.ttf');
Icon.loadFont('FontAwesome5_Brands.ttf');
Icon.loadFont('FontAwesome5_Regular.ttf');
Icon.loadFont('FontAwesome5_Solid.ttf');
Icon.loadFont('Foundation.ttf');
Icon.loadFont('Ionicons.ttf');
Icon.loadFont('MaterialIcons.ttf');
Icon.loadFont('MaterialCommunityIcons.ttf');
Icon.loadFont('SimpleLineIcons.ttf');
Icon.loadFont('Octicons.ttf');
Icon.loadFont('Zocial.ttf');

let icon = (
  <Icon family={'FontAwesome'} name={'edit'} color="#f2f2f2" size={30} />
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
        tintColor: '#85a249',
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

  RNNotificationBanner.Warn({
    title: 'Message',
    subTitle: 'Sub Message',
    titleColor: '#FFFFFF',
    subTitleColor: '#FFFFFF',
    isSwipeToDismissEnabled: true,
  });

  return (
    <SafeAreaProvider>
      <Application />
    </SafeAreaProvider>
  );
};

export default App;
