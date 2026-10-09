package com.gourav.authentick.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SmallFloatingActionButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gourav.authentick.data.AccountRepository
import com.gourav.authentick.domain.models.OtpAccount
import com.gourav.authentick.otp.OtpType
import com.gourav.authentick.otp.TotpGenerator
import com.gourav.authentick.ui.components.AuthixTopBar
import com.gourav.authentick.ui.components.OtpCard
import com.gourav.authentick.ui.components.SearchBar
import com.gourav.authentick.ui.theme.AuthixCyan
import com.gourav.authentick.ui.theme.AuthixEmerald
import com.gourav.authentick.ui.theme.AuthixPurple
import kotlinx.coroutines.delay
import kotlinx.datetime.Clock

@Composable
fun HomeScreen(
    accountRepository: AccountRepository,
    onNavigateToScan: () -> Unit,
    onNavigateToAddManual: () -> Unit,
    onNavigateToDetail: (String) -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateTo3Fa: (String) -> Unit
) {
    val accounts by accountRepository.accounts.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var isSearchActive by remember { mutableStateOf(false) }
    var isFabExpanded by remember { mutableStateOf(false) }
    var currentTimeMillis by remember { mutableLongStateOf(Clock.System.now().toEpochMilliseconds()) }

    // Live TOTP ticker loop (every 100ms for smooth animated progress circle)
    LaunchedEffect(Unit) {
        while (true) {
            currentTimeMillis = Clock.System.now().toEpochMilliseconds()
            delay(100)
        }
    }

    val filteredAccounts = remember(accounts, searchQuery) {
        val list = if (searchQuery.isBlank()) accounts else {
            accounts.filter {
                it.issuer.contains(searchQuery, ignoreCase = true) ||
                        it.accountName.contains(searchQuery, ignoreCase = true)
            }
        }
        // Pinned accounts appear first
        list.sortedByDescending { it.isPinned }
    }

    val remainingSeconds = TotpGenerator.getRemainingSeconds(currentTimeMillis, 30)
    val progress = TotpGenerator.getProgressFraction(currentTimeMillis, 30)

    Scaffold(
        topBar = {
            Column(modifier = Modifier.statusBarsPadding()) {
                AuthixTopBar(
                    onSearchClick = { isSearchActive = !isSearchActive },
                    onSettingsClick = onNavigateToSettings,
                    onPending3FaClick = { onNavigateTo3Fa("authix-demo-sess") },
                    hasPending3Fa = true
                )

                AnimatedVisibility(
                    visible = isSearchActive,
                    enter = slideInVertically() + fadeIn(),
                    exit = slideOutVertically() + fadeOut()
                ) {
                    SearchBar(
                        query = searchQuery,
                        onQueryChange = { searchQuery = it },
                        onClose = {
                            isSearchActive = false
                            searchQuery = ""
                        }
                    )
                }
            }
        },
        floatingActionButton = {
            Column(
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Expanded Action 1: 3FA Push Simulation
                AnimatedVisibility(
                    visible = isFabExpanded,
                    enter = fadeIn() + slideInVertically { it },
                    exit = fadeOut() + slideOutVertically { it }
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.End
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            shadowElevation = 4.dp
                        ) {
                            Text(
                                text = "Authix 3FA Push",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = AuthixCyan,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        SmallFloatingActionButton(
                            onClick = {
                                isFabExpanded = false
                                onNavigateTo3Fa("authix-interactive-demo")
                            },
                            containerColor = AuthixCyan,
                            contentColor = Color.Black
                        ) {
                            Icon(Icons.Filled.Shield, contentDescription = "3FA Push")
                        }
                    }
                }

                // Expanded Action 2: Add Manually
                AnimatedVisibility(
                    visible = isFabExpanded,
                    enter = fadeIn() + slideInVertically { it },
                    exit = fadeOut() + slideOutVertically { it }
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.End
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            shadowElevation = 4.dp
                        ) {
                            Text(
                                text = "Enter Key Manually",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        SmallFloatingActionButton(
                            onClick = {
                                isFabExpanded = false
                                onNavigateToAddManual()
                            },
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = AuthixCyan
                        ) {
                            Icon(Icons.Filled.Key, contentDescription = "Manual Key")
                        }
                    }
                }

                // Expanded Action 3: Scan QR Code
                AnimatedVisibility(
                    visible = isFabExpanded,
                    enter = fadeIn() + slideInVertically { it },
                    exit = fadeOut() + slideOutVertically { it }
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.End
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            shadowElevation = 4.dp
                        ) {
                            Text(
                                text = "Scan QR Code",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        SmallFloatingActionButton(
                            onClick = {
                                isFabExpanded = false
                                onNavigateToScan()
                            },
                            containerColor = AuthixPurple,
                            contentColor = Color.White
                        ) {
                            Icon(Icons.Filled.QrCodeScanner, contentDescription = "Scan QR")
                        }
                    }
                }

                // Main Trigger Button
                FloatingActionButton(
                    onClick = { isFabExpanded = !isFabExpanded },
                    containerColor = AuthixCyan,
                    contentColor = Color.Black,
                    shape = CircleShape
                ) {
                    Icon(
                        imageVector = if (isFabExpanded) Icons.Default.Close else Icons.Default.Add,
                        contentDescription = "Add 2FA Account",
                        modifier = Modifier.size(26.dp)
                    )
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        if (filteredAccounts.isEmpty()) {
            // Empty State
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Security,
                            contentDescription = null,
                            tint = AuthixCyan,
                            modifier = Modifier.size(36.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    Text(
                        text = if (searchQuery.isNotBlank()) "No accounts found" else "No 2FA Accounts Yet",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = if (searchQuery.isNotBlank())
                            "Try searching with a different name or issuer."
                        else
                            "Tap the '+' button below to scan a QR code or manually enter your 2FA secret key.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 90.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(
                    items = filteredAccounts,
                    key = { it.id }
                ) { account ->
                    val currentOtp = remember(account, currentTimeMillis) {
                        if (account.type == OtpType.TOTP) {
                            TotpGenerator.generateTotp(
                                secretBase32 = account.secret,
                                timeMillis = currentTimeMillis,
                                periodSeconds = account.period,
                                digits = account.digits,
                                algorithm = account.algorithm
                            )
                        } else {
                            TotpGenerator.generateHotp(
                                secretBase32 = account.secret,
                                counter = account.counter,
                                digits = account.digits,
                                algorithm = account.algorithm
                            )
                        }
                    }

                    val accountRemaining = if (account.period == 30) remainingSeconds else TotpGenerator.getRemainingSeconds(currentTimeMillis, account.period)
                    val accountProgress = if (account.period == 30) progress else TotpGenerator.getProgressFraction(currentTimeMillis, account.period)

                    OtpCard(
                        account = account,
                        currentOtp = currentOtp,
                        progress = accountProgress,
                        remainingSeconds = accountRemaining,
                        onCardClick = { onNavigateToDetail(account.id) },
                        onTogglePin = { accountRepository.togglePin(account.id) },
                        onRefreshHotp = { accountRepository.incrementCounter(account.id) }
                    )
                }
            }
        }
    }
}
