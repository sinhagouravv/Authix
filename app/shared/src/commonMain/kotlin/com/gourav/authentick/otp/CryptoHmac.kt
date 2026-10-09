package com.gourav.authentick.otp

/**
 * Pure Kotlin multiplatform implementation of HMAC-SHA1, HMAC-SHA256, and HMAC-SHA512.
 */
object CryptoHmac {

    fun hmac(key: ByteArray, message: ByteArray, algorithm: OtpAlgorithm): ByteArray {
        return when (algorithm) {
            OtpAlgorithm.SHA1 -> hmacSha1(key, message)
            OtpAlgorithm.SHA256 -> hmacSha256(key, message)
            OtpAlgorithm.SHA512 -> hmacSha512(key, message)
        }
    }

    private fun hmacSha1(key: ByteArray, data: ByteArray): ByteArray {
        val blockSize = 64
        var preparedKey = key
        if (preparedKey.size > blockSize) {
            preparedKey = Sha1.digest(preparedKey)
        }
        if (preparedKey.size < blockSize) {
            preparedKey = preparedKey.copyOf(blockSize)
        }

        val oKeyPad = ByteArray(blockSize) { (preparedKey[it].toInt() xor 0x5C).toByte() }
        val iKeyPad = ByteArray(blockSize) { (preparedKey[it].toInt() xor 0x36).toByte() }

        val inner = Sha1.digest(iKeyPad + data)
        return Sha1.digest(oKeyPad + inner)
    }

    private fun hmacSha256(key: ByteArray, data: ByteArray): ByteArray {
        val blockSize = 64
        var preparedKey = key
        if (preparedKey.size > blockSize) {
            preparedKey = Sha256.digest(preparedKey)
        }
        if (preparedKey.size < blockSize) {
            preparedKey = preparedKey.copyOf(blockSize)
        }

        val oKeyPad = ByteArray(blockSize) { (preparedKey[it].toInt() xor 0x5C).toByte() }
        val iKeyPad = ByteArray(blockSize) { (preparedKey[it].toInt() xor 0x36).toByte() }

        val inner = Sha256.digest(iKeyPad + data)
        return Sha256.digest(oKeyPad + inner)
    }

    private fun hmacSha512(key: ByteArray, data: ByteArray): ByteArray {
        val blockSize = 128
        var preparedKey = key
        if (preparedKey.size > blockSize) {
            preparedKey = Sha512.digest(preparedKey)
        }
        if (preparedKey.size < blockSize) {
            preparedKey = preparedKey.copyOf(blockSize)
        }

        val oKeyPad = ByteArray(blockSize) { (preparedKey[it].toInt() xor 0x5C).toByte() }
        val iKeyPad = ByteArray(blockSize) { (preparedKey[it].toInt() xor 0x36).toByte() }

        val inner = Sha512.digest(iKeyPad + data)
        return Sha512.digest(oKeyPad + inner)
    }

    // SHA-1 Implementation
    private object Sha1 {
        fun digest(message: ByteArray): ByteArray {
            var h0 = 0x67452301
            var h1 = 0xEFCDAB89.toInt()
            var h2 = 0x98BADCFE.toInt()
            var h3 = 0x10325476
            var h4 = 0xC3D2E1F0.toInt()

            val msgLenBits = message.size.toLong() * 8
            val padLen = ((56 - ((message.size + 1) % 64)) + 64) % 64
            val padded = ByteArray(message.size + 1 + padLen + 8)
            message.copyInto(padded)
            padded[message.size] = 0x80.toByte()

            for (i in 0..7) {
                padded[padded.size - 1 - i] = ((msgLenBits ushr (i * 8)) and 0xFF).toByte()
            }

            val w = IntArray(80)
            for (chunk in padded.indices step 64) {
                for (i in 0..15) {
                    val idx = chunk + i * 4
                    w[i] = ((padded[idx].toInt() and 0xFF) shl 24) or
                            ((padded[idx + 1].toInt() and 0xFF) shl 16) or
                            ((padded[idx + 2].toInt() and 0xFF) shl 8) or
                            (padded[idx + 3].toInt() and 0xFF)
                }
                for (i in 16..79) {
                    val temp = w[i - 3] xor w[i - 8] xor w[i - 14] xor w[i - 16]
                    w[i] = (temp shl 1) or (temp ushr 31)
                }

                var a = h0
                var b = h1
                var c = h2
                var d = h3
                var e = h4

                for (i in 0..79) {
                    val f: Int
                    val k: Int
                    when (i) {
                        in 0..19 -> {
                            f = (b and c) or (b.inv() and d)
                            k = 0x5A827999
                        }
                        in 20..39 -> {
                            f = b xor c xor d
                            k = 0x6ED9EBA1
                        }
                        in 40..59 -> {
                            f = (b and c) or (b and d) or (c and d)
                            k = 0x8F1BBCDC.toInt()
                        }
                        else -> {
                            f = b xor c xor d
                            k = 0xCA62C1D6.toInt()
                        }
                    }

                    val temp = ((a shl 5) or (a ushr 27)) + f + e + k + w[i]
                    e = d
                    d = c
                    c = (b shl 30) or (b ushr 2)
                    b = a
                    a = temp
                }

                h0 += a
                h1 += b
                h2 += c
                h3 += d
                h4 += e
            }

            val out = ByteArray(20)
            fun writeInt(value: Int, offset: Int) {
                out[offset] = (value ushr 24).toByte()
                out[offset + 1] = (value ushr 16).toByte()
                out[offset + 2] = (value ushr 8).toByte()
                out[offset + 3] = value.toByte()
            }
            writeInt(h0, 0)
            writeInt(h1, 4)
            writeInt(h2, 8)
            writeInt(h3, 12)
            writeInt(h4, 16)
            return out
        }
    }

    // SHA-256 Implementation
    private object Sha256 {
        private val K = intArrayOf(
            0x428a2f98, 0x71374491, 0xb5c0fbcf.toInt(), 0xe9b5dba5.toInt(),
            0x3956c25b, 0x59f111f1, 0x923f82a4.toInt(), 0xab1c5ed5.toInt(),
            0xd807aa98.toInt(), 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe.toInt(), 0x9bdc06a7.toInt(), 0xc19bf174.toInt(),
            0xe49b69c1.toInt(), 0xefbe4786.toInt(), 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152.toInt(), 0xa831c66d.toInt(), 0xb00327c8.toInt(), 0xbf597fc7.toInt(),
            0xc6e00bf3.toInt(), 0xd5a79147.toInt(), 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e.toInt(), 0x92722c85.toInt(),
            0xa2bfe8a1.toInt(), 0xa81a664b.toInt(), 0xc24b8b70.toInt(), 0xc76c51a3.toInt(),
            0xd192e819.toInt(), 0xd6990624.toInt(), 0xf40e3585.toInt(), 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814.toInt(), 0x8cc70208.toInt(),
            0x90befffa.toInt(), 0xa4506ceb.toInt(), 0xbef9a3f7.toInt(), 0xc67178f2.toInt()
        )

        fun digest(message: ByteArray): ByteArray {
            var h0 = 0x6a09e667
            var h1 = 0xbb67ae85.toInt()
            var h2 = 0x3c6ef372
            var h3 = 0xa54ff53a.toInt()
            var h4 = 0x510e527f
            var h5 = 0x9b05688c.toInt()
            var h6 = 0x1f83d9ab
            var h7 = 0x5be0cd19

            val msgLenBits = message.size.toLong() * 8
            val padLen = ((56 - ((message.size + 1) % 64)) + 64) % 64
            val padded = ByteArray(message.size + 1 + padLen + 8)
            message.copyInto(padded)
            padded[message.size] = 0x80.toByte()

            for (i in 0..7) {
                padded[padded.size - 1 - i] = ((msgLenBits ushr (i * 8)) and 0xFF).toByte()
            }

            val w = IntArray(64)
            for (chunk in padded.indices step 64) {
                for (i in 0..15) {
                    val idx = chunk + i * 4
                    w[i] = ((padded[idx].toInt() and 0xFF) shl 24) or
                            ((padded[idx + 1].toInt() and 0xFF) shl 16) or
                            ((padded[idx + 2].toInt() and 0xFF) shl 8) or
                            (padded[idx + 3].toInt() and 0xFF)
                }
                for (i in 16..63) {
                    val s0 = (w[i - 15] ushr 7 or (w[i - 15] shl 25)) xor
                            (w[i - 15] ushr 18 or (w[i - 15] shl 14)) xor
                            (w[i - 15] ushr 3)
                    val s1 = (w[i - 2] ushr 17 or (w[i - 2] shl 15)) xor
                            (w[i - 2] ushr 19 or (w[i - 2] shl 13)) xor
                            (w[i - 2] ushr 10)
                    w[i] = w[i - 16] + s0 + w[i - 7] + s1
                }

                var a = h0
                var b = h1
                var c = h2
                var d = h3
                var e = h4
                var f = h5
                var g = h6
                var h = h7

                for (i in 0..63) {
                    val s1 = (e ushr 6 or (e shl 26)) xor (e ushr 11 or (e shl 21)) xor (e ushr 25 or (e shl 7))
                    val ch = (e and f) xor (e.inv() and g)
                    val temp1 = h + s1 + ch + K[i] + w[i]
                    val s0 = (a ushr 2 or (a shl 30)) xor (a ushr 13 or (a shl 19)) xor (a ushr 22 or (a shl 10))
                    val maj = (a and b) xor (a and c) xor (b and c)
                    val temp2 = s0 + maj

                    h = g
                    g = f
                    f = e
                    e = d + temp1
                    d = c
                    c = b
                    b = a
                    a = temp1 + temp2
                }

                h0 += a
                h1 += b
                h2 += c
                h3 += d
                h4 += e
                h5 += f
                h6 += g
                h7 += h
            }

            val out = ByteArray(32)
            fun writeInt(value: Int, offset: Int) {
                out[offset] = (value ushr 24).toByte()
                out[offset + 1] = (value ushr 16).toByte()
                out[offset + 2] = (value ushr 8).toByte()
                out[offset + 3] = value.toByte()
            }
            writeInt(h0, 0)
            writeInt(h1, 4)
            writeInt(h2, 8)
            writeInt(h3, 12)
            writeInt(h4, 16)
            writeInt(h5, 20)
            writeInt(h6, 24)
            writeInt(h7, 28)
            return out
        }
    }

    // SHA-512 Implementation
    private object Sha512 {
        private val K = longArrayOf(
            0x428a2f98d728ae22L, 0x7137449123ef65cdL, -0x4a3f043015480741L, -0x164a245a49c9577bL,
            0x3956c25bf348b538L, 0x59f111f1b605d019L, -0x6dc07d5b4c1064acL, -0x54e3a12a2aa7014bL,
            -0x27f855670a41d918L, 0x12835b0145706fbeL, 0x243185be4ee4b28cL, 0x550c7dc3d5ffb4e2L,
            0x72be5d74f27b896fL, -0x7f214e010d29759eL, -0x6423f95837517c29L, -0x3e640e8b8bb13b9cL,
            -0x1b64963e6398f5b3L, -0x1041b87932822a1aL, 0x0fc19dc68b8cd5b5L, 0x240ca1cc77ac9c65L,
            0x2de92c6f592b0275L, 0x4a7484aa6ea6e483L, 0x5cb0a9dcbd41fbd4L, 0x76f988da831153b5L,
            -0x67c1aeada706bf2eL, -0x57ce3992b1239c58L, -0x4ffcd83756c9a2d8L, -0x40a68038166c3489L,
            -0x391ff40c6a505b0dL, -0x2a586eb8c7f99ee9L, 0x06ca6351e003826fL, 0x142929670a0e6e70L,
            0x27b70a8546d22ffcL, 0x2e1b21385c26c926L, 0x4d2c6dfc5ac42aedL, 0x53380d139d95b3dfL,
            0x650a73548baf63deL, 0x766a0abb3c77b2a8L, -0x7e3d36d10c22949eL, -0x6d8dd37a4d3bb16bL,
            -0x5d40175e11400a4fL, -0x57e599b4566c3dc5L, -0x3db4748f32c3f7cbL, -0x3893ae5c328905abL,
            -0x2e6d17e63ee9a3d7L, -0x2966f9db0c47672cL, -0xbf1cfaaff6cb9L, 0x106aa07032bbd1b8L,
            0x19a4c116b8d2d0c8L, 0x1e376c085141ab53L, 0x2748774cdf8eeb99L, 0x34b0bcb5e19b48a8L,
            0x391c0cb3c5c95a63L, 0x4ed8aa4ae3418acbL, 0x5b9cca4f7763e373L, 0x682e6ff3d6b2b8a3L,
            0x748f82ee5defb2fcL, 0x78a5636f43172f60L, -0x7b3787eb9daef93cL, -0x7338fdf7d130a008L,
            -0x6f410005db3c07e6L, -0x5baf93144a7ec4e5L, -0x41065c0836561f09L, -0x398e870d47ee6d4eL
        )

        fun digest(message: ByteArray): ByteArray {
            var h0 = 0x6a09e667f3bcc908L
            var h1 = -0x4498517a7b3558c5L
            var h2 = 0x3c6ef372fe94f82bL
            var h3 = -0x5ab00ac565011746L
            var h4 = 0x510e527fade682d1L
            var h5 = -0x64fa9773b0cd6144L
            var h6 = 0x1f83d9abfb41bd6bL
            var h7 = 0x5be0cd19137e2179L

            val msgLenBits = message.size.toLong() * 8
            val padLen = ((112 - ((message.size + 1) % 128)) + 128) % 128
            val padded = ByteArray(message.size + 1 + padLen + 16)
            message.copyInto(padded)
            padded[message.size] = 0x80.toByte()

            for (i in 0..7) {
                padded[padded.size - 1 - i] = ((msgLenBits ushr (i * 8)) and 0xFF).toByte()
            }

            val w = LongArray(80)
            for (chunk in padded.indices step 128) {
                for (i in 0..15) {
                    val idx = chunk + i * 8
                    var v = 0L
                    for (b in 0..7) {
                        v = (v shl 8) or (padded[idx + b].toLong() and 0xFF)
                    }
                    w[i] = v
                }
                for (i in 16..79) {
                    val s0 = (w[i - 15].rotateRight(1)) xor (w[i - 15].rotateRight(8)) xor (w[i - 15] ushr 7)
                    val s1 = (w[i - 2].rotateRight(19)) xor (w[i - 2].rotateRight(61)) xor (w[i - 2] ushr 6)
                    w[i] = w[i - 16] + s0 + w[i - 7] + s1
                }

                var a = h0
                var b = h1
                var c = h2
                var d = h3
                var e = h4
                var f = h5
                var g = h6
                var h = h7

                for (i in 0..79) {
                    val s1 = (e.rotateRight(14)) xor (e.rotateRight(18)) xor (e.rotateRight(41))
                    val ch = (e and f) xor (e.inv() and g)
                    val temp1 = h + s1 + ch + K[i] + w[i]
                    val s0 = (a.rotateRight(28)) xor (a.rotateRight(34)) xor (a.rotateRight(39))
                    val maj = (a and b) xor (a and c) xor (b and c)
                    val temp2 = s0 + maj

                    h = g
                    g = f
                    f = e
                    e = d + temp1
                    d = c
                    c = b
                    b = a
                    a = temp1 + temp2
                }

                h0 += a
                h1 += b
                h2 += c
                h3 += d
                h4 += e
                h5 += f
                h6 += g
                h7 += h
            }

            val out = ByteArray(64)
            fun writeLong(value: Long, offset: Int) {
                for (i in 0..7) {
                    out[offset + i] = ((value ushr ((7 - i) * 8)) and 0xFF).toByte()
                }
            }
            writeLong(h0, 0)
            writeLong(h1, 8)
            writeLong(h2, 16)
            writeLong(h3, 24)
            writeLong(h4, 32)
            writeLong(h5, 40)
            writeLong(h6, 48)
            writeLong(h7, 56)
            return out
        }

        private fun Long.rotateRight(bits: Int): Long {
            return (this ushr bits) or (this shl (64 - bits))
        }
    }
}
