package com.gourav.authentick.security

import androidx.compose.runtime.Composable

interface ClipboardHelper {
    fun copyText(text: String, label: String = "OTP")
}

@Composable
expect fun rememberClipboardHelper(): ClipboardHelper
