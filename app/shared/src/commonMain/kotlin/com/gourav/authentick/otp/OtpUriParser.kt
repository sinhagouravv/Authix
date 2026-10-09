package com.gourav.authentick.otp

import com.gourav.authentick.domain.models.OtpAccount

object OtpUriParser {

    /**
     * Parses an otpauth:// URI or raw secret string into an [OtpAccount].
     * Returns null if parsing fails or input is invalid.
     */
    fun parse(uriString: String): OtpAccount? {
        val trimmed = uriString.trim()

        // If it's a raw Base32 secret without otpauth scheme
        if (!trimmed.startsWith("otpauth://", ignoreCase = true)) {
            val cleaned = Base32.clean(trimmed)
            if (Base32.isValid(cleaned)) {
                return OtpAccount(
                    issuer = "Manual Key",
                    accountName = "Account",
                    secret = cleaned,
                    type = OtpType.TOTP,
                    algorithm = OtpAlgorithm.SHA1,
                    digits = 6,
                    period = 30
                )
            }
            return null
        }

        try {
            // Format: otpauth://[totp|hotp]/[label]?[parameters]
            val schemeEnd = trimmed.indexOf("://")
            if (schemeEnd == -1) return null

            val pathAndQuery = trimmed.substring(schemeEnd + 3)
            val typeEnd = pathAndQuery.indexOf('/')
            if (typeEnd == -1) return null

            val typeStr = pathAndQuery.substring(0, typeEnd)
            val type = OtpType.fromString(typeStr)

            val queryStart = pathAndQuery.indexOf('?', typeEnd)
            val labelRaw = if (queryStart != -1) {
                pathAndQuery.substring(typeEnd + 1, queryStart)
            } else {
                pathAndQuery.substring(typeEnd + 1)
            }
            val label = decodeUrlComponent(labelRaw)

            val queryParams = mutableMapOf<String, String>()
            if (queryStart != -1 && queryStart < pathAndQuery.length - 1) {
                val queryString = pathAndQuery.substring(queryStart + 1)
                for (pair in queryString.split('&')) {
                    val kv = pair.split('=', limit = 2)
                    if (kv.isNotEmpty()) {
                        val key = decodeUrlComponent(kv[0]).lowercase()
                        val value = if (kv.size > 1) decodeUrlComponent(kv[1]) else ""
                        queryParams[key] = value
                    }
                }
            }

            val secret = queryParams["secret"]?.let { Base32.clean(it) } ?: return null
            if (!Base32.isValid(secret)) return null

            val issuerParam = queryParams["issuer"]
            var finalIssuer = issuerParam ?: ""
            var finalAccountName = label

            if (label.contains(':')) {
                val parts = label.split(':', limit = 2)
                if (finalIssuer.isEmpty()) {
                    finalIssuer = parts[0].trim()
                }
                finalAccountName = parts[1].trim()
            }

            if (finalIssuer.isEmpty()) {
                finalIssuer = "Unknown"
            }

            val algorithm = OtpAlgorithm.fromString(queryParams["algorithm"])
            val digits = queryParams["digits"]?.toIntOrNull() ?: 6
            val period = queryParams["period"]?.toIntOrNull() ?: 30
            val counter = queryParams["counter"]?.toLongOrNull() ?: 0L

            return OtpAccount(
                issuer = finalIssuer,
                accountName = finalAccountName.ifEmpty { "Default" },
                secret = secret,
                type = type,
                algorithm = algorithm,
                digits = if (digits in 6..8) digits else 6,
                period = if (period in 10..300) period else 30,
                counter = counter
            )
        } catch (e: Exception) {
            return null
        }
    }

    private fun decodeUrlComponent(input: String): String {
        val result = StringBuilder()
        var i = 0
        while (i < input.length) {
            val c = input[i]
            when {
                c == '+' -> {
                    result.append(' ')
                    i++
                }
                c == '%' && i + 2 < input.length -> {
                    val hex = input.substring(i + 1, i + 3)
                    val code = hex.toIntOrNull(16)
                    if (code != null) {
                        result.append(code.toChar())
                        i += 3
                    } else {
                        result.append(c)
                        i++
                    }
                }
                else -> {
                    result.append(c)
                    i++
                }
            }
        }
        return result.toString()
    }
}
