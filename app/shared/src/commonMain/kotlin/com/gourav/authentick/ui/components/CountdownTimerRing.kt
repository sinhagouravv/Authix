package com.gourav.authentick.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gourav.authentick.ui.theme.AuthixAmber
import com.gourav.authentick.ui.theme.AuthixCyan
import com.gourav.authentick.ui.theme.AuthixPurple
import com.gourav.authentick.ui.theme.AuthixRose

@Composable
fun CountdownTimerRing(
    progress: Float,
    remainingSeconds: Int,
    modifier: Modifier = Modifier,
    size: Dp = 44.dp,
    strokeWidth: Dp = 3.5.dp,
    showText: Boolean = true
) {
    val animatedProgress by animateFloatAsState(
        targetValue = progress.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 200, easing = FastOutSlowInEasing),
        label = "timer_ring_progress"
    )

    val targetColor = when {
        remainingSeconds <= 5 -> AuthixRose
        remainingSeconds <= 10 -> AuthixAmber
        else -> AuthixCyan
    }

    val animatedColor by animateColorAsState(
        targetValue = targetColor,
        animationSpec = tween(durationMillis = 300),
        label = "timer_ring_color"
    )

    Box(
        modifier = modifier.size(size),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val strokePx = strokeWidth.toPx()
            val radius = (this.size.minDimension - strokePx) / 2
            val topLeft = Offset(
                (this.size.width - radius * 2) / 2,
                (this.size.height - radius * 2) / 2
            )
            val arcSize = Size(radius * 2, radius * 2)

            // Background Track
            drawArc(
                color = Color.White.copy(alpha = 0.1f),
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokePx, cap = StrokeCap.Round)
            )

            // Active Progress Ring
            drawArc(
                brush = Brush.sweepGradient(
                    colors = listOf(
                        animatedColor.copy(alpha = 0.6f),
                        animatedColor
                    )
                ),
                startAngle = -90f,
                sweepAngle = -360f * animatedProgress,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokePx, cap = StrokeCap.Round)
            )
        }

        if (showText) {
            Text(
                text = remainingSeconds.toString(),
                fontSize = if (size > 40.dp) 12.sp else 10.sp,
                fontWeight = FontWeight.Bold,
                color = animatedColor
            )
        }
    }
}
