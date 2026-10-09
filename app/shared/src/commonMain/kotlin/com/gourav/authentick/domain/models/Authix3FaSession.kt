package com.gourav.authentick.domain.models

import kotlinx.datetime.Clock
import kotlinx.serialization.Serializable

@Serializable
data class Authix3FaSession(
    val sessionId: String,
    val appName: String,
    val userEmail: String,
    val ipAddress: String = "192.168.1.100",
    val location: String = "San Francisco, US",
    val browserDevice: String = "Chrome on macOS",
    val timestamp: Long = Clock.System.now().toEpochMilliseconds(),
    val status: SessionStatus = SessionStatus.PENDING
) {
    @Serializable
    enum class SessionStatus {
        PENDING,
        APPROVED,
        DENIED,
        EXPIRED
    }
}
