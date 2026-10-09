package com.gourav.authentick.domain.models

object BrandHelper {
    data class BrandStyle(
        val name: String,
        val primaryColorHex: Long,
        val secondaryColorHex: Long,
        val initials: String
    )

    fun getBrandStyle(issuer: String): BrandStyle {
        val normalized = issuer.lowercase().trim()
        return when {
            normalized.contains("authix") -> BrandStyle("Authix", 0xFF00F0FF, 0xFF0EA5E9, "AX")
            normalized.contains("google") || normalized.contains("gmail") -> BrandStyle("Google", 0xFF4285F4, 0xFFEA4335, "G")
            normalized.contains("github") -> BrandStyle("GitHub", 0xFF24292E, 0xFF6E40C9, "GH")
            normalized.contains("amazon") || normalized.contains("aws") -> BrandStyle("AWS", 0xFFFF9900, 0xFF232F3E, "AWS")
            normalized.contains("microsoft") || normalized.contains("azure") || normalized.contains("live") -> BrandStyle("Microsoft", 0xFF00A4EF, 0xFF7FBA00, "MS")
            normalized.contains("discord") -> BrandStyle("Discord", 0xFF5865F2, 0xFF7983F5, "DC")
            normalized.contains("twitter") || normalized.contains(" x ") || normalized == "x" -> BrandStyle("X", 0xFF1DA1F2, 0xFF000000, "X")
            normalized.contains("facebook") || normalized.contains("meta") -> BrandStyle("Meta", 0xFF1877F2, 0xFF0668E1, "M")
            normalized.contains("slack") -> BrandStyle("Slack", 0xFF4A154B, 0xFFE01E5A, "SL")
            normalized.contains("stripe") -> BrandStyle("Stripe", 0xFF635BFF, 0xFF0A2540, "ST")
            normalized.contains("binance") || normalized.contains("crypto") -> BrandStyle("Crypto", 0xFFF3BA2F, 0xFF181A20, "CR")
            normalized.contains("proton") -> BrandStyle("Proton", 0xFF6D4AFF, 0xFF8F70FF, "PR")
            else -> {
                val initials = if (issuer.isNotBlank()) {
                    issuer.split(" ").take(2).mapNotNull { it.firstOrNull()?.uppercaseChar() }.joinToString("")
                } else "2F"
                val hash = issuer.hashCode()
                val colors = listOf(
                    0xFF6366F1 to 0xFF8B5CF6,
                    0xFFEC4899 to 0xFFF43F5E,
                    0xFF10B981 to 0xFF059669,
                    0xFFF59E0B to 0xFFD97706,
                    0xFF3B82F6 to 0xFF2563EB,
                    0xFF8B5CF6 to 0xFF7C3AED,
                    0xFF14B8A6 to 0xFF0D9488
                )
                val pair = colors[kotlin.math.abs(hash) % colors.size]
                BrandStyle(issuer.ifBlank { "OTP" }, pair.first, pair.second, initials.ifBlank { "2F" })
            }
        }
    }
}
