package com.gourav.authentick.security

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import platform.UIKit.UIPasteboard

class IosClipboardHelper : ClipboardHelper {
    override fun copyText(text: String, label: String) {
        UIPasteboard.generalPasteboard.string = text
    }
}

@Composable
actual fun rememberClipboardHelper(): ClipboardHelper {
    return remember { IosClipboardHelper() }
}
