'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCondominio(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const nome = formData.get('nome') as string
    const endereco = formData.get('endereco') as string

    const { error } = await supabase
        .from('condominios')
        .update({ nome, endereco })
        .eq('id', id)

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
