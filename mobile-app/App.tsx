import { StatusBar } from 'expo-status-bar';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import LoginContainer from "./src/screens/auth/login/LoginContainer";
import {NavigationContainer} from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import {useState} from "react";
import {AuthProvider, useAuth} from "./src/store/auth/AuthContext";

function AppStructure() {
  const { token, isLoading } = useAuth()
  const isSignedIn = !!token

  if (isLoading) {
    return <ActivityIndicator/>
  }

  return (
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator isSignedIn={isSignedIn} />
      </NavigationContainer>
  )
}

export default function App() {

  return (
      <AuthProvider >
        <AppStructure />
      </AuthProvider>
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
