package com.gourav.authentick.security

import androidx.compose.runtime.Composable

interface BiometricAuth {
    fun isBiometricAvailable(): Boolean
    fun authenticate(
        title: String,
        subtitle: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    )
}

@Composable
expect fun rememberBiometricAuth(): BiometricAuth
