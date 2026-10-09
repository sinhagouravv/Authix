package com.gourav.authentick.otp

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class TotpGeneratorTest {

    @Test
    fun testBase32EncodingAndDecoding() {
        val original = "Hello World!"
        val encoded = Base32.encode(original.encodeToByteArray(), pad = false)
        val decodedBytes = Base32.decode(encoded)
        assertEquals(original, decodedBytes.decodeToString())
    }

    @Test
    fun testTotpGenerationRFC6238() {
        // Standard test secret: "12345678901234567890" in Base32 -> "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
        val secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
        
        // Time = 59 seconds -> counter = 1
        val code1 = TotpGenerator.generateTotp(
            secretBase32 = secret,
            timeMillis = 59_000L,
            periodSeconds = 30,
            digits = 8,
            algorithm = OtpAlgorithm.SHA1
        )
        assertEquals(8, code1.length)
        assertTrue(code1.all { it.isDigit() })
    }

    @Test
    fun testOtpUriParsing() {
        val uri = "otpauth://totp/Authix:gourav@authix.io?secret=JBSWY3DPEHPK3PXP&issuer=Authix&algorithm=SHA1&digits=6&period=30"
        val account = OtpUriParser.parse(uri)

        assertNotNull(account)
        assertEquals("Authix", account.issuer)
        assertEquals("gourav@authix.io", account.accountName)
        assertEquals("JBSWY3DPEHPK3PXP", account.secret)
        assertEquals(6, account.digits)
        assertEquals(30, account.period)
        assertEquals(OtpAlgorithm.SHA1, account.algorithm)
    }

    @Test
    fun testFormatCode() {
        assertEquals("123 456", TotpGenerator.formatCode("123456"))
        assertEquals("1234 5678", TotpGenerator.formatCode("12345678"))
    }
}
