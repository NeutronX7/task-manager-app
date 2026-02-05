import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { AppTabParamList } from './types'
import LoginContainer from "../screens/auth/login/LoginContainer";


const Tab = createBottomTabNavigator<AppTabParamList>()

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerTitleAlign: 'center'
            }}
        >
            <Tab.Screen name="Tasks" component={LoginContainer} options={{ title: 'Tareas' }} />
        </Tab.Navigator>
    )
}
