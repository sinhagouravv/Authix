package com.gourav.authentick.domain.models

import com.gourav.authentick.otp.OtpAlgorithm
import com.gourav.authentick.otp.OtpType
import kotlinx.datetime.Clock
import kotlinx.serialization.Serializable

@Serializable
data class OtpAccount(
    val id: String = generateId(),
    val issuer: String,
    val accountName: String,
    val secret: String,
    val type: OtpType = OtpType.TOTP,
    val algorithm: OtpAlgorithm = OtpAlgorithm.SHA1,
    val digits: Int = 6,
    val period: Int = 30,
    val counter: Long = 0L,
    val createdAt: Long = Clock.System.now().toEpochMilliseconds(),
    val isPinned: Boolean = false,
    val note: String? = null
) {
    companion object {
        fun generateId(): String {
            val chars = "abcdefghijklmnopqrstuvwxyz0123456789"
            val time = Clock.System.now().toEpochMilliseconds().toString(36)
            val random = (1..8).map { chars.random() }.joinToString("")
            return "$time-$random"
        }
    }
}
