'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCondominio(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const nome = formData.get('nome') as string
    const endereco = formData.get('endereco') as string

    // Como só deve existir um condomínio, usamos upsert
    // Se não houver ID (primeira vez), o Supabase cria um novo
    const payload: any = { nome, endereco }
    if (id) payload.id = id

    const { error } = await supabase
        .from('condominios')
        .upsert(payload)

    if (error) throw error

    revalidatePath('/dashboard/configuracoes')
}

export async function upsertTipoVisitante(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const nome = formData.get('nome') as string

    if (id) {
        const { error } = await supabase
            .from('tipos_visitantes')
            .update({ nome })
            .eq('id', id)
        if (error) throw error
    } else {
        const { error } = await supabase
            .from('tipos_visitantes')
            .insert({ nome })
        if (error) throw error
    }

    revalidatePath('/dashboard/configuracoes')
}

export async function deleteTipoVisitante(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('tipos_visitantes')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/configuracoes')
}

export async function updateUserRole(userId: string, role: 'admin' | 'user') {
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

    if (error) throw error

    revalidatePath('/dashboard/configuracoes')
}
