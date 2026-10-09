package com.gourav.authentick.ui

import androidx.compose.animation.Crossfade
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.gourav.authentick.data.AccountRepository
import com.gourav.authentick.data.SettingsRepository
import com.gourav.authentick.navigation.Screen
import com.gourav.authentick.otp.OtpUriParser
import com.gourav.authentick.ui.screens.AccountDetailScreen
import com.gourav.authentick.ui.screens.AddManualScreen
import com.gourav.authentick.ui.screens.Authix3FaApprovalScreen
import com.gourav.authentick.ui.screens.BiometricLockScreen
import com.gourav.authentick.ui.screens.HomeScreen
import com.gourav.authentick.ui.screens.ScanQrScreen
import com.gourav.authentick.ui.screens.SettingsScreen
import com.gourav.authentick.ui.theme.AuthixTheme

@Composable
fun App(
    initialDeepLink: String? = null
) {
    val accountRepository = remember { AccountRepository() }
    val settingsRepository = remember { SettingsRepository() }

    val isDarkTheme by settingsRepository.isDarkTheme.collectAsState()
    val isBiometricEnabled by settingsRepository.isBiometricEnabled.collectAsState()

    var isUnlocked by remember { mutableStateOf(!isBiometricEnabled) }
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }

    // Handle deep link (e.g. otpauth://)
    LaunchedEffect(initialDeepLink) {
        if (!initialDeepLink.isNullOrBlank()) {
            val parsedAccount = OtpUriParser.parse(initialDeepLink)
            if (parsedAccount != null) {
                accountRepository.addAccount(parsedAccount)
                currentScreen = Screen.Home
            }
        }
    }

    AuthixTheme(darkTheme = isDarkTheme) {
        if (isBiometricEnabled && !isUnlocked) {
            BiometricLockScreen(
                onUnlocked = { isUnlocked = true }
            )
        } else {
            Crossfade(targetState = currentScreen, label = "screen_transition") { screen ->
                when (screen) {
                    is Screen.Home -> {
                        HomeScreen(
                            accountRepository = accountRepository,
                            onNavigateToScan = { currentScreen = Screen.ScanQr },
                            onNavigateToAddManual = { currentScreen = Screen.AddManual },
                            onNavigateToDetail = { accountId -> currentScreen = Screen.AccountDetail(accountId) },
                            onNavigateToSettings = { currentScreen = Screen.Settings },
                            onNavigateTo3Fa = { sessionId -> currentScreen = Screen.Authix3FaApproval(sessionId) }
                        )
                    }
                    is Screen.ScanQr -> {
                        ScanQrScreen(
                            accountRepository = accountRepository,
                            onNavigateBack = { currentScreen = Screen.Home },
                            onNavigateToManual = { currentScreen = Screen.AddManual },
                            onScanSuccess = { currentScreen = Screen.Home }
                        )
                    }
                    is Screen.AddManual -> {
                        AddManualScreen(
                            accountRepository = accountRepository,
                            onNavigateBack = { currentScreen = Screen.Home },
                            onSuccess = { currentScreen = Screen.Home }
                        )
                    }
                    is Screen.AccountDetail -> {
                        AccountDetailScreen(
                            accountId = screen.accountId,
                            accountRepository = accountRepository,
                            onNavigateBack = { currentScreen = Screen.Home }
                        )
                    }
                    is Screen.Settings -> {
                        SettingsScreen(
                            settingsRepository = settingsRepository,
                            accountRepository = accountRepository,
                            onNavigateBack = { currentScreen = Screen.Home }
                        )
                    }
                    is Screen.Authix3FaApproval -> {
                        Authix3FaApprovalScreen(
                            sessionId = screen.sessionId,
                            onNavigateBack = { currentScreen = Screen.Home }
                        )
                    }
                    is Screen.BiometricLock -> {
                        BiometricLockScreen(
                            onUnlocked = { currentScreen = Screen.Home }
                        )
                    }
                }
            }
        }
    }
}
