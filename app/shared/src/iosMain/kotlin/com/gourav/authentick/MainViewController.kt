package com.gourav.authentick

import androidx.compose.ui.window.ComposeUIViewController
import com.gourav.authentick.ui.App
import platform.UIKit.UIViewController

fun MainViewController(): UIViewController = ComposeUIViewController {
    App()
}
