package com.gourav.authentick.otp

import kotlinx.serialization.Serializable

@Serializable
enum class OtpAlgorithm(val standardName: String) {
    SHA1("SHA1"),
    SHA256("SHA256"),
    SHA512("SHA512");

    companion object {
        fun fromString(value: String?): OtpAlgorithm {
            return when (value?.uppercase()?.trim()) {
                "SHA256", "SHA-256", "HMACSHA256" -> SHA256
                "SHA512", "SHA-512", "HMACSHA512" -> SHA512
                else -> SHA1
            }
        }
    }
}

@Serializable
enum class OtpType {
    TOTP,
    HOTP;

    companion object {
        fun fromString(value: String?): OtpType {
            return when (value?.uppercase()?.trim()) {
                "HOTP" -> HOTP
                else -> TOTP
            }
        }
    }
}
