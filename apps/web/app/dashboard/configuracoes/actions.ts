'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Cliente administrativo para ações que exigem bypass de RLS (como criar usuários)
const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function updateCondominio(formData: FormData) {
    try {
        const supabase = await createClient()
        const id = formData.get('id') as string
        const nome = formData.get('nome') as string
        const endereco = formData.get('endereco') as string

        const payload: any = { nome, endereco }
        if (id && id !== 'undefined') payload.id = id

        const { error } = await supabase
            .from('condominios')
            .upsert(payload)

        if (error) return { error: error.message }

        revalidatePath('/dashboard/configuracoes')
        return { success: true }
    } catch (e: any) {
        return { error: e.message || 'Erro inesperado ao salvar condomínio' }
    }
}

export async function upsertTipoVisitante(formData: FormData) {
    try {
        const supabase = await createClient()
        const id = formData.get('id') as string
        const nome = formData.get('nome') as string

        const { error } = await supabase
            .from('tipos_visitantes')
            .upsert({ id: id || undefined, nome })

        if (error) return { error: error.message }

        revalidatePath('/dashboard/configuracoes')
        return { success: true }
    } catch (e: any) {
        return { error: e.message || 'Erro ao salvar categoria' }
    }
}

export async function deleteTipoVisitante(id: string) {
    try {
        const supabase = await createClient()
        const { error } = await supabase
            .from('tipos_visitantes')
            .delete()
            .eq('id', id)

        if (error) return { error: error.message }

        revalidatePath('/dashboard/configuracoes')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateUserRole(userId: string, role: 'admin' | 'user') {
    try {
        const supabase = await createClient()
        const { error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId)

        if (error) return { error: error.message }

        revalidatePath('/dashboard/configuracoes')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function createUser(formData: FormData) {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return { error: 'SERVICE_ROLE_KEY não configurada no servidor.' }
        }

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const full_name = formData.get('full_name') as string
        const role = formData.get('role') as string || 'user'

        // 1.5 Buscar o condomínio do admin logado
        const supabase = await createClient()
        const { data: { user: adminUser } } = await supabase.auth.getUser()
        const { data: adminProfile } = await supabase
            .from('profiles')
            .select('condominio_id')
            .eq('id', adminUser?.id)
            .single()

        const adminCondoId = adminProfile?.condominio_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

        // 1. Criar usuário no Auth do Supabase
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name }
        })

        if (authError) return { error: authError.message }

        // 2. Garantir que o perfil foi criado (ou atualizar se já existir via trigger)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: authData.user.id,
                full_name,
                role,
                condominio_id: adminCondoId
            })

        if (profileError) return { error: profileError.message }

        revalidatePath('/dashboard/configuracoes')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
