package com.gourav.authentick.data

import com.russhwolf.settings.Settings
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SettingsRepository(
    private val settings: Settings = Settings()
) {
    private val _isBiometricEnabled = MutableStateFlow(settings.getBoolean(KEY_BIOMETRIC, false))
    val isBiometricEnabled: StateFlow<Boolean> = _isBiometricEnabled.asStateFlow()

    private val _isDarkTheme = MutableStateFlow(settings.getBoolean(KEY_DARK_THEME, true))
    val isDarkTheme: StateFlow<Boolean> = _isDarkTheme.asStateFlow()

    private val _isScreenProtection = MutableStateFlow(settings.getBoolean(KEY_SCREEN_PROTECTION, true))
    val isScreenProtection: StateFlow<Boolean> = _isScreenProtection.asStateFlow()

    private val _appPin = MutableStateFlow(settings.getString(KEY_APP_PIN, ""))
    val appPin: StateFlow<String> = _appPin.asStateFlow()

    fun setBiometricEnabled(enabled: Boolean) {
        settings.putBoolean(KEY_BIOMETRIC, enabled)
        _isBiometricEnabled.value = enabled
    }

    fun setDarkTheme(isDark: Boolean) {
        settings.putBoolean(KEY_DARK_THEME, isDark)
        _isDarkTheme.value = isDark
    }

    fun setScreenProtection(enabled: Boolean) {
        settings.putBoolean(KEY_SCREEN_PROTECTION, enabled)
        _isScreenProtection.value = enabled
    }

    fun setAppPin(pin: String) {
        settings.putString(KEY_APP_PIN, pin)
        _appPin.value = pin
    }

    companion object {
        private const val KEY_BIOMETRIC = "pref_biometric_enabled"
        private const val KEY_DARK_THEME = "pref_dark_theme"
        private const val KEY_SCREEN_PROTECTION = "pref_screen_protection"
        private const val KEY_APP_PIN = "pref_app_pin"
    }
}
