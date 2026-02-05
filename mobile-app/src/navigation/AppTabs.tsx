import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { AppTabParamList } from './types'
import TaskContainer from "../screens/tabs/task/TaskContainer";
import TaskScreen from "../screens/tabs/task/TaskScreen";


const Tab = createBottomTabNavigator<AppTabParamList>()

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerTitleAlign: 'center'
            }}
        >
            <Tab.Screen name="Tasks" component={TaskScreen} options={{ title: 'Tareas' }} />
        </Tab.Navigator>
    )
}
