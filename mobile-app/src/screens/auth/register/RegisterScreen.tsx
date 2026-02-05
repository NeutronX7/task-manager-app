import React from 'react'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import RegisterContainer from './RegisterContainer'
import {AuthStackParamList} from "../../../navigation/types";

export default function RegisterScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

    return (
        <RegisterContainer
            onGoToLogin={() => navigation.navigate('Login')}
        />
    )
}
