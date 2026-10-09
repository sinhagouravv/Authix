package com.gourav.authentick.navigation

sealed class Screen {
    data object Home : Screen()
    data object ScanQr : Screen()
    data object AddManual : Screen()
    data class AccountDetail(val accountId: String) : Screen()
    data object Settings : Screen()
    data class Authix3FaApproval(val sessionId: String) : Screen()
    data object BiometricLock : Screen()
}
