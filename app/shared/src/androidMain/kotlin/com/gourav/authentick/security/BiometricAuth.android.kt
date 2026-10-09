package com.gourav.authentick.security

import android.content.Context
import androidx.biometric.BiometricManager as AndroidBiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class AndroidBiometricAuth(private val context: Context) : BiometricAuth {
    override fun isBiometricAvailable(): Boolean {
        val bm = AndroidBiometricManager.from(context)
        return bm.canAuthenticate(AndroidBiometricManager.Authenticators.BIOMETRIC_STRONG or AndroidBiometricManager.Authenticators.DEVICE_CREDENTIAL) == AndroidBiometricManager.BIOMETRIC_SUCCESS
    }

    override fun authenticate(
        title: String,
        subtitle: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        val activity = context as? FragmentActivity
        if (activity == null) {
            // If not a fragment activity, succeed for preview/mock
            onSuccess()
            return
        }

        val executor = ContextCompat.getMainExecutor(context)
        val prompt = BiometricPrompt(
            activity,
            executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    onSuccess()
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    onError(errString.toString())
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                }
            }
        )

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle(title)
            .setSubtitle(subtitle)
            .setAllowedAuthenticators(AndroidBiometricManager.Authenticators.BIOMETRIC_STRONG or AndroidBiometricManager.Authenticators.DEVICE_CREDENTIAL)
            .build()

        prompt.authenticate(promptInfo)
    }
}

@Composable
actual fun rememberBiometricAuth(): BiometricAuth {
    val context = LocalContext.current
    return remember(context) { AndroidBiometricAuth(context) }
}
