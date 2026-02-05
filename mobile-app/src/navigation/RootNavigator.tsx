import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { RootStackParamList } from './types'

import AuthStack from './AuthStack'
import AppTabs from './AppTabs'

const Stack = createNativeStackNavigator<RootStackParamList>()

type Props = {
    isSignedIn: boolean
}

export default function RootNavigator({ isSignedIn }: Props) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
                <Stack.Screen name="App" component={AppTabs} />
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    )
}
