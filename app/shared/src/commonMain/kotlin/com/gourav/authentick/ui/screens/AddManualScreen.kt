package com.gourav.authentick.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Key
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gourav.authentick.data.AccountRepository
import com.gourav.authentick.domain.models.OtpAccount
import com.gourav.authentick.otp.Base32
import com.gourav.authentick.otp.OtpAlgorithm
import com.gourav.authentick.otp.OtpType
import com.gourav.authentick.ui.theme.AuthixCyan
import com.gourav.authentick.ui.theme.AuthixEmerald
import com.gourav.authentick.ui.theme.AuthixRose

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddManualScreen(
    accountRepository: AccountRepository,
    onNavigateBack: () -> Unit,
    onSuccess: () -> Unit
) {
    var issuer by remember { mutableStateOf("") }
    var accountName by remember { mutableStateOf("") }
    var secretKey by remember { mutableStateOf("") }
    var selectedType by remember { mutableStateOf(OtpType.TOTP) }
    var selectedAlgorithm by remember { mutableStateOf(OtpAlgorithm.SHA1) }
    var selectedDigits by remember { mutableIntStateOf(6) }
    var selectedPeriod by remember { mutableIntStateOf(30) }
    var showAdvanced by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val isSecretValid = remember(secretKey) {
        val cleaned = Base32.clean(secretKey)
        cleaned.isNotEmpty() && Base32.isValid(cleaned)
    }

    fun handleSave() {
        if (issuer.isBlank()) {
            errorMessage = "Please enter an service or issuer name (e.g. Authix, Google)"
            return
        }
        if (accountName.isBlank()) {
            errorMessage = "Please enter an account name or email (e.g. user@example.com)"
            return
        }
        val cleanedSecret = Base32.clean(secretKey)
        if (!Base32.isValid(cleanedSecret)) {
            errorMessage = "Invalid Base32 secret key. Secret should only contain letters A-Z and digits 2-7."
            return
        }

        val newAccount = OtpAccount(
            issuer = issuer.trim(),
            accountName = accountName.trim(),
            secret = cleanedSecret,
            type = selectedType,
            algorithm = selectedAlgorithm,
            digits = selectedDigits,
            period = selectedPeriod
        )

        val added = accountRepository.addAccount(newAccount)
        if (added) {
            onSuccess()
        } else {
            errorMessage = "An account with this secret key already exists in your vault."
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Add Account Manually", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                    titleContentColor = MaterialTheme.colorScheme.onBackground,
                    navigationIconContentColor = MaterialTheme.colorScheme.onBackground
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Service / Issuer
            OutlinedTextField(
                value = issuer,
                onValueChange = {
                    issuer = it
                    errorMessage = null
                },
                label = { Text("Issuer / Service") },
                placeholder = { Text("e.g., Authix, GitHub, Google") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AuthixCyan,
                    focusedLabelColor = AuthixCyan
                )
            )

            // Account Name
            OutlinedTextField(
                value = accountName,
                onValueChange = {
                    accountName = it
                    errorMessage = null
                },
                label = { Text("Account Name / Email") },
                placeholder = { Text("e.g., alex@company.com") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AuthixCyan,
                    focusedLabelColor = AuthixCyan
                )
            )

            // Secret Key
            Column {
                OutlinedTextField(
                    value = secretKey,
                    onValueChange = {
                        secretKey = it
                        errorMessage = null
                    },
                    label = { Text("Secret Key (Base32)") },
                    placeholder = { Text("e.g., JBSWY3DPEHPK3PXP") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    trailingIcon = {
                        if (secretKey.isNotBlank()) {
                            if (isSecretValid) {
                                Icon(Icons.Default.Check, contentDescription = "Valid", tint = AuthixEmerald)
                            } else {
                                Icon(Icons.Default.ErrorOutline, contentDescription = "Invalid", tint = AuthixRose)
                            }
                        }
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = if (secretKey.isNotBlank() && !isSecretValid) AuthixRose else AuthixCyan,
                        focusedLabelColor = if (secretKey.isNotBlank() && !isSecretValid) AuthixRose else AuthixCyan
                    )
                )

                if (secretKey.isNotBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isSecretValid) "✓ Valid Base32 Secret Key" else "✗ Secret contains invalid characters (A-Z, 2-7 only)",
                        fontSize = 12.sp,
                        color = if (isSecretValid) AuthixEmerald else AuthixRose,
                        modifier = Modifier.padding(start = 4.dp)
                    )
                }
            }

            // Expandable Advanced Options
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .clickable { showAdvanced = !showAdvanced },
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Advanced Parameters",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Icon(
                        imageVector = if (showAdvanced) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                        contentDescription = "Expand Advanced",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            AnimatedVisibility(visible = showAdvanced) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(14.dp))
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    // Type: TOTP / HOTP
                    Text("Type", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = selectedType == OtpType.TOTP,
                            onClick = { selectedType = OtpType.TOTP },
                            label = { Text("Time-based (TOTP)") }
                        )
                        FilterChip(
                            selected = selectedType == OtpType.HOTP,
                            onClick = { selectedType = OtpType.HOTP },
                            label = { Text("Counter-based (HOTP)") }
                        )
                    }

                    // Algorithm
                    Text("Algorithm", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        listOf(OtpAlgorithm.SHA1, OtpAlgorithm.SHA256, OtpAlgorithm.SHA512).forEach { algo ->
                            FilterChip(
                                selected = selectedAlgorithm == algo,
                                onClick = { selectedAlgorithm = algo },
                                label = { Text(algo.name) }
                            )
                        }
                    }

                    // Digits
                    Text("Digits", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        listOf(6, 8).forEach { d ->
                            FilterChip(
                                selected = selectedDigits == d,
                                onClick = { selectedDigits = d },
                                label = { Text("$d digits") }
                            )
                        }
                    }

                    // Period (for TOTP)
                    if (selectedType == OtpType.TOTP) {
                        Text("Interval Period", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf(30, 60).forEach { p ->
                                FilterChip(
                                    selected = selectedPeriod == p,
                                    onClick = { selectedPeriod = p },
                                    label = { Text("${p}s") }
                                )
                            }
                        }
                    }
                }
            }

            if (errorMessage != null) {
                Text(
                    text = errorMessage ?: "",
                    color = AuthixRose,
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Save Account Button
            Button(
                onClick = { handleSave() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AuthixCyan,
                    contentColor = Color.Black
                )
            ) {
                Icon(Icons.Default.Key, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save to Vault", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}
