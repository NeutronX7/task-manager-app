import React from 'react'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import LoginContainer from './LoginContainer'
import {AuthStackParamList} from "../../../navigation/types";

export default function LoginScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

    return (
        <LoginContainer
            onGoToRegister={() => navigation.navigate('Register')}
        />
    )
}
