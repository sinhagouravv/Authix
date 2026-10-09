package com.gourav.authentick.data

import com.gourav.authentick.domain.models.Authix3FaSession
import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.delay
import kotlinx.datetime.Clock
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

class AuthixApiClient {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
            })
        }
    }

    // Simulates or fetches pending 3FA approval sessions
    suspend fun getPending3FaSession(): Authix3FaSession? {
        // Return a mock demo session for instant interactive testing
        return Authix3FaSession(
            sessionId = "authix-sess-${Clock.System.now().toEpochMilliseconds()}",
            appName = "Authix Developer Dashboard",
            userEmail = "gourav@authix.io",
            ipAddress = "157.240.241.35 (Tokyo, JP)",
            location = "Tokyo, Japan",
            browserDevice = "Chrome 128 / macOS Sequoia",
            status = Authix3FaSession.SessionStatus.PENDING
        )
    }

    suspend fun respondTo3FaSession(sessionId: String, approved: Boolean): Boolean {
        delay(600) // network latency simulation
        return true
    }
}
