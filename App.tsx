import {  StatusBar} from 'react-native';
import { NativeBaseProvider} from 'native-base';
import { Karla_400Regular, Karla_700Bold} from '@expo-google-fonts/karla';
import { useFonts } from '@expo-google-fonts/karla/useFonts';



import { AuthContextProvider } from '@contexts/AuthContext';

import { Routes } from './src/routes';
import { Loading } from '@components/Loading';
import { THEME } from './src/theme';



export default function App() {
  const [fontsLoaded] = useFonts ({ Karla_400Regular, Karla_700Bold})

  return (
    <NativeBaseProvider theme={THEME}>      
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent 
      />      
    <AuthContextProvider>
        {fontsLoaded ? <Routes/> : <Loading/>}
    </AuthContextProvider>             
    </NativeBaseProvider>
  );
}
