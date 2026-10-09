package com.gourav.authentick.data

import com.gourav.authentick.domain.models.OtpAccount
import com.gourav.authentick.otp.OtpAlgorithm
import com.gourav.authentick.otp.OtpType
import com.russhwolf.settings.Settings
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class AccountRepository(
    private val settings: Settings = Settings()
) {
    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = true
        encodeDefaults = true
    }

    private val _accountsFlow = MutableStateFlow<List<OtpAccount>>(emptyList())
    val accounts: StateFlow<List<OtpAccount>> = _accountsFlow.asStateFlow()

    init {
        loadAccounts()
    }

    private fun loadAccounts() {
        val storedJson = settings.getStringOrNull(KEY_ACCOUNTS)
        if (!storedJson.isNullOrBlank()) {
            try {
                val loaded = json.decodeFromString<List<OtpAccount>>(storedJson)
                _accountsFlow.value = loaded
                return
            } catch (e: Exception) {
                // Fallback to defaults if corrupted
            }
        }

        // Pre-seed sample accounts for instant testability
        val defaultAccounts = listOf(
            OtpAccount(
                id = "authix-demo-01",
                issuer = "Authix 3FA",
                accountName = "gourav@authix.io",
                secret = "JBSWY3DPEHPK3PXP", // "Hello!" in base32
                type = OtpType.TOTP,
                algorithm = OtpAlgorithm.SHA1,
                digits = 6,
                period = 30,
                isPinned = true
            ),
            OtpAccount(
                id = "github-demo-02",
                issuer = "GitHub",
                accountName = "sinha-gourav",
                secret = "HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ",
                type = OtpType.TOTP,
                algorithm = OtpAlgorithm.SHA1,
                digits = 6,
                period = 30
            ),
            OtpAccount(
                id = "google-demo-03",
                issuer = "Google Workspace",
                accountName = "gourav@gmail.com",
                secret = "KVKFKRCPNZQUYMLX",
                type = OtpType.TOTP,
                algorithm = OtpAlgorithm.SHA1,
                digits = 6,
                period = 30
            ),
            OtpAccount(
                id = "aws-demo-04",
                issuer = "AWS Cloud",
                accountName = "admin-root",
                secret = "MZXW633PN5XW6MZXW633PN5XW6MZX",
                type = OtpType.TOTP,
                algorithm = OtpAlgorithm.SHA256,
                digits = 6,
                period = 30
            )
        )
        saveAccounts(defaultAccounts)
    }

    private fun saveAccounts(list: List<OtpAccount>) {
        _accountsFlow.value = list
        try {
            val encoded = json.encodeToString(list)
            settings.putString(KEY_ACCOUNTS, encoded)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun addAccount(account: OtpAccount): Boolean {
        val current = _accountsFlow.value.toMutableList()
        // Check if identical secret exists
        if (current.any { it.secret.equals(account.secret, ignoreCase = true) && it.accountName == account.accountName }) {
            return false
        }
        current.add(0, account) // Add to top
        saveAccounts(current)
        return true
    }

    fun updateAccount(account: OtpAccount) {
        val current = _accountsFlow.value.toMutableList()
        val index = current.indexOfFirst { it.id == account.id }
        if (index != -1) {
            current[index] = account
            saveAccounts(current)
        }
    }

    fun deleteAccount(accountId: String) {
        val current = _accountsFlow.value.filterNot { it.id == accountId }
        saveAccounts(current)
    }

    fun togglePin(accountId: String) {
        val current = _accountsFlow.value.map {
            if (it.id == accountId) it.copy(isPinned = !it.isPinned) else it
        }
        saveAccounts(current)
    }

    fun incrementCounter(accountId: String) {
        val current = _accountsFlow.value.map {
            if (it.id == accountId && it.type == OtpType.HOTP) {
                it.copy(counter = it.counter + 1)
            } else it
        }
        saveAccounts(current)
    }

    fun exportJson(): String {
        return json.encodeToString(_accountsFlow.value)
    }

    fun importJson(jsonContent: String): Result<Int> {
        return try {
            val imported = json.decodeFromString<List<OtpAccount>>(jsonContent)
            val current = _accountsFlow.value.toMutableList()
            var addedCount = 0
            for (acc in imported) {
                if (current.none { it.id == acc.id || (it.secret == acc.secret && it.accountName == acc.accountName) }) {
                    current.add(acc)
                    addedCount++
                }
            }
            saveAccounts(current)
            Result.success(addedCount)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    companion object {
        private const val KEY_ACCOUNTS = "authix_stored_accounts_v1"
    }
}
