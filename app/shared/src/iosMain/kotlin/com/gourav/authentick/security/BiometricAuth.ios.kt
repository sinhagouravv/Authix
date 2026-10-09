package com.gourav.authentick.security

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import platform.LocalAuthentication.LAContext
import platform.LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics

class IosBiometricAuth : BiometricAuth {
    override fun isBiometricAvailable(): Boolean {
        val context = LAContext()
        return context.canEvaluatePolicy(LAPolicyDeviceOwnerAuthenticationWithBiometrics, null)
    }

    override fun authenticate(
        title: String,
        subtitle: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        val context = LAContext()
        context.evaluatePolicy(
            LAPolicyDeviceOwnerAuthenticationWithBiometrics,
            localizedReason = title
        ) { success, error ->
            if (success) {
                onSuccess()
            } else {
                onError(error?.localizedDescription ?: "Biometric authentication failed")
            }
        }
    }
}

@Composable
actual fun rememberBiometricAuth(): BiometricAuth {
    return remember { IosBiometricAuth() }
}
