/**
 * Converts a UTC date string from Supabase to local Brazil time
 * Supabase stores dates in UTC, but we need to display in local time
 */
export function formatDateTime(dateString: string | Date, options?: {
    dateStyle?: 'short' | 'medium' | 'long' | 'full'
    timeStyle?: 'short' | 'medium' | 'long' | 'full'
    dateOnly?: boolean
    timeOnly?: boolean
}): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString

    const locale = 'pt-BR'
    const timezone = 'America/Sao_Paulo' // Brazil timezone (UTC-3)

    if (options?.dateOnly) {
        return date.toLocaleDateString(locale, {
            timeZone: timezone,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    if (options?.timeOnly) {
        return date.toLocaleTimeString(locale, {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return date.toLocaleString(locale, {
        timeZone: timezone,
        dateStyle: options?.dateStyle || 'short',
        timeStyle: options?.timeStyle || 'short',
    })
}

/**
 * Formats time only (HH:mm)
 */
export function formatTime(dateString: string | Date): string {
    return formatDateTime(dateString, { timeOnly: true })
}

/**
 * Formats date only (DD/MM/YYYY)
 */
export function formatDate(dateString: string | Date): string {
    return formatDateTime(dateString, { dateOnly: true })
}
