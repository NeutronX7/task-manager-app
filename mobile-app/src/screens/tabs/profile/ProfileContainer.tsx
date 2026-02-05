import React, { useCallback } from 'react'
import ProfilePresenter from './ProfilePresenter'
import {useMe} from "../../../hooks/useMe";
import {useAuth} from "../../../store/auth/AuthContext";

export default function ProfileContainer() {
    const { user, loading, error, refresh } = useMe()
    const { signOut } = useAuth()

    const handleLogout = useCallback(async () => {
        await signOut()
    }, [signOut])

    return (
        <ProfilePresenter
            loading={loading}
            error={error}
            name={user?.name}
            email={user?.email}
            onRefresh={refresh}
            onLogout={handleLogout}
        />
    )
}
