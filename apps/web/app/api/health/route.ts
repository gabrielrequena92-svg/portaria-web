import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Ping Supabase to keep it awake
        const { error } = await supabase.from('condominios').select('id').limit(1)

        if (error) throw error

        return NextResponse.json({ status: 'ok', time: new Date().toISOString() })
    } catch (error) {
        return NextResponse.json({ status: 'error' }, { status: 500 })
    }
}
