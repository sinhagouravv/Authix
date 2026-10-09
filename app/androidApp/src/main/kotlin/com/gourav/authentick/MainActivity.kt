package com.gourav.authentick

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.gourav.authentick.ui.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        // Handle incoming otpauth:// deep link if launched via link
        val initialUri = intent?.data?.toString()

        setContent {
            App(initialDeepLink = initialUri)
        }
    }
}
