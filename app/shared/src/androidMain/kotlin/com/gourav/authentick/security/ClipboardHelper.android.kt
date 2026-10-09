package com.gourav.authentick.security

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext

class AndroidClipboardHelper(private val context: Context) : ClipboardHelper {
    override fun copyText(text: String, label: String) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager
        val clip = ClipData.newPlainText(label, text)
        clipboard?.setPrimaryClip(clip)
    }
}

@Composable
actual fun rememberClipboardHelper(): ClipboardHelper {
    val context = LocalContext.current
    return remember(context) { AndroidClipboardHelper(context) }
}
