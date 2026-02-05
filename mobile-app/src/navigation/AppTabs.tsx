import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { AppTabParamList } from './types'
import TaskScreen from "../screens/tabs/task/TaskScreen";
import ProfileScreen from "../screens/tabs/profile/ProfileScreen";
import {ListTodo, User2Icon} from "lucide-react-native";


const Tab = createBottomTabNavigator<AppTabParamList>()

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerTitleAlign: 'center'
            }}
        >
            <Tab.Screen name="Profile" component={TaskScreen} options={{ title: 'Tareas', tabBarIcon: ({ color, size }) => (
                    <ListTodo color={color} size={size} />
                )
            }} />
            <Tab.Screen name="Tasks" component={ProfileScreen} options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => (
                    <User2Icon color={color} size={size} />
                )
            }} />
        </Tab.Navigator>
    )
}
