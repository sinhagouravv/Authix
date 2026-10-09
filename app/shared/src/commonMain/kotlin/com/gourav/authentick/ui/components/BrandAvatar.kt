package com.gourav.authentick.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gourav.authentick.domain.models.BrandHelper

@Composable
fun BrandAvatar(
    issuer: String,
    modifier: Modifier = Modifier,
    size: Dp = 46.dp
) {
    val style = BrandHelper.getBrandStyle(issuer)
    val brush = Brush.linearGradient(
        colors = listOf(
            Color(style.primaryColorHex),
            Color(style.secondaryColorHex)
        )
    )

    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(brush),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = style.initials,
            color = Color.White,
            fontWeight = FontWeight.ExtraBold,
            fontSize = if (style.initials.length > 2) 13.sp else 16.sp
        )
    }
}
