package com.gourav.authentick.otp

/**
 * Pure Kotlin RFC 4648 Base32 Decoder and Encoder.
 * Supports padding, spaces, hyphens, and uppercase/lowercase letters.
 */
object Base32 {
    private const val ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    private val DECODE_TABLE = IntArray(128) { -1 }.apply {
        for (i in ALPHABET.indices) {
            val c = ALPHABET[i]
            this[c.code] = i
            this[c.lowercaseChar().code] = i
        }
    }

    fun isValid(input: String): Boolean {
        val cleaned = clean(input)
        if (cleaned.isEmpty()) return false
        return cleaned.all { it.code < DECODE_TABLE.size && DECODE_TABLE[it.code] != -1 }
    }

    fun clean(input: String): String {
        return input.replace(" ", "")
            .replace("-", "")
            .replace("=", "")
            .uppercase()
            .trim()
    }

    fun decode(input: String): ByteArray {
        val cleaned = clean(input)
        if (cleaned.isEmpty()) return ByteArray(0)

        var buffer = 0
        var bitsLeft = 0
        val output = mutableListOf<Byte>()

        for (ch in cleaned) {
            val code = ch.code
            if (code >= DECODE_TABLE.size || DECODE_TABLE[code] == -1) {
                throw IllegalArgumentException("Illegal character in Base32 string: $ch")
            }
            val value = DECODE_TABLE[code]
            buffer = (buffer shl 5) or (value and 0x1F)
            bitsLeft += 5

            if (bitsLeft >= 8) {
                bitsLeft -= 8
                output.add(((buffer shr bitsLeft) and 0xFF).toByte())
            }
        }

        return output.toByteArray()
    }

    fun encode(data: ByteArray, pad: Boolean = true): String {
        if (data.isEmpty()) return ""
        val result = StringBuilder()
        var buffer = 0
        var bitsLeft = 0

        for (b in data) {
            buffer = (buffer shl 8) or (b.toInt() and 0xFF)
            bitsLeft += 8
            while (bitsLeft >= 5) {
                bitsLeft -= 5
                val index = (buffer shr bitsLeft) and 0x1F
                result.append(ALPHABET[index])
            }
        }

        if (bitsLeft > 0) {
            val index = (buffer shl (5 - bitsLeft)) and 0x1F
            result.append(ALPHABET[index])
        }

        if (pad) {
            while (result.length % 8 != 0) {
                result.append('=')
            }
        }

        return result.toString()
    }
}
