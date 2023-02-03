import './src/lib/dayjs';
import * as Notifications from 'expo-notifications';
import {  StatusBar, Button } from 'react-native';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from "@expo-google-fonts/inter";

import { Loading } from "./src/components/Loading";
import { Routes } from "./src/routes";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_800ExtraBold   
  });

  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Boa noite !',
      body: 'Não se esqueça de marcar os hábitos cumpridos hoje 😉'
    },
    trigger: {
      hour:18,
      minute:30,
      repeats: true,
    },
  });


  if (!fontsLoaded) {
    return (
      <Loading />
    );
  }

 return (
  <>

    <Routes />
    <StatusBar barStyle="light-content" backgroundColor="transparent" />
  </>
 );
}


