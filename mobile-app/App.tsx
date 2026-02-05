import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginContainer from "./src/screens/auth/login/LoginContainer";
import {NavigationContainer} from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import {useState} from "react";

export default function App() {
  const [isSignedIn] = useState(false)

  return (
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator isSignedIn={isSignedIn} />
      </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
