package com.gourav.authentick.otp

import kotlinx.datetime.Clock
import kotlin.math.pow

object TotpGenerator {

    /**
     * Generates a TOTP code based on the current system time or provided epoch millis.
     */
    fun generateTotp(
        secretBase32: String,
        timeMillis: Long = Clock.System.now().toEpochMilliseconds(),
        periodSeconds: Int = 30,
        digits: Int = 6,
        algorithm: OtpAlgorithm = OtpAlgorithm.SHA1
    ): String {
        val timeSeconds = timeMillis / 1000
        val counter = timeSeconds / periodSeconds
        return generateHotp(secretBase32, counter, digits, algorithm)
    }

    /**
     * Generates an HOTP code (RFC 4226) for a given counter.
     */
    fun generateHotp(
        secretBase32: String,
        counter: Long,
        digits: Int = 6,
        algorithm: OtpAlgorithm = OtpAlgorithm.SHA1
    ): String {
        val keyBytes = try {
            Base32.decode(secretBase32)
        } catch (e: Exception) {
            return "000000".padStart(digits, '0')
        }

        if (keyBytes.isEmpty()) {
            return "000000".padStart(digits, '0')
        }

        val counterBytes = ByteArray(8)
        var tempCounter = counter
        for (i in 7 downTo 0) {
            counterBytes[i] = (tempCounter and 0xFF).toByte()
            tempCounter = tempCounter ushr 8
        }

        val hash = CryptoHmac.hmac(keyBytes, counterBytes, algorithm)
        val offset = (hash[hash.size - 1].toInt() and 0x0F)

        val binary = ((hash[offset].toInt() and 0x7F) shl 24) or
                ((hash[offset + 1].toInt() and 0xFF) shl 16) or
                ((hash[offset + 2].toInt() and 0xFF) shl 8) or
                (hash[offset + 3].toInt() and 0xFF)

        val modulo = 10.0.pow(digits.toDouble()).toInt()
        val otp = binary % modulo

        return otp.toString().padStart(digits, '0')
    }

    /**
     * Returns remaining seconds in the current TOTP window.
     */
    fun getRemainingSeconds(
        timeMillis: Long = Clock.System.now().toEpochMilliseconds(),
        periodSeconds: Int = 30
    ): Int {
        val timeSeconds = (timeMillis / 1000).toInt()
        val elapsed = timeSeconds % periodSeconds
        val remaining = periodSeconds - elapsed
        return if (remaining <= 0) periodSeconds else remaining
    }

    /**
     * Returns progress fraction from 1.0f (just started) down to 0.0f (expired).
     */
    fun getProgressFraction(
        timeMillis: Long = Clock.System.now().toEpochMilliseconds(),
        periodSeconds: Int = 30
    ): Float {
        val elapsedMillis = timeMillis % (periodSeconds * 1000L)
        val remainingMillis = (periodSeconds * 1000L) - elapsedMillis
        return (remainingMillis.toFloat() / (periodSeconds * 1000L)).coerceIn(0f, 1f)
    }

    /**
     * Formats OTP code nicely with a middle space (e.g., "123 456" or "1234 5678").
     */
    fun formatCode(code: String): String {
        return when (code.length) {
            6 -> "${code.substring(0, 3)} ${code.substring(3)}"
            8 -> "${code.substring(0, 4)} ${code.substring(4)}"
            else -> code
        }
    }
}
