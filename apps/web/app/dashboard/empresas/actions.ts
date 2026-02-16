'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const companySchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cnpj: z.string().optional(),
    status: z.enum(["ativa", "bloqueada", "inativa"]).default("ativa"),
})

export async function createOrUpdateCompany(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Verificar permissão e pegar condominio_id do perfil
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: 'Usuário não autenticado.' }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, condominio_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return { message: 'Erro ao buscar perfil do usuário.' }
    }

    if (profile.role !== 'admin') {
        return { message: 'Apenas administradores podem gerenciar empresas.' }
    }

    const condomioId = profile.condominio_id

    const rawData = {
        id: formData.get('id') as string,
        nome: formData.get('nome') as string,
        cnpj: formData.get('cnpj') as string,
        status: formData.get('status') as "ativa" | "bloqueada" | "inativa",
    }

    const validatedFields = companySchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Erro na validação dos campos.',
        }
    }

    const { id, ...data } = validatedFields.data

    let error

    if (id) {
        // Update
        const result = await supabase
            .from('empresas')
            .update({ ...data })
            .eq('id', id)
            .eq('condominio_id', condomioId)
        error = result.error
    } else {
        // Create
        const result = await supabase
            .from('empresas')
            .insert({ ...data, condominio_id: condomioId })
        error = result.error
    }

    if (error) {
        console.error(error)
        return { message: 'Erro ao salvar empresa no banco de dados.' }
    }

    revalidatePath('/dashboard/empresas')
    return { message: 'Sucesso!', success: true }
}

export async function toggleCompanyStatus(id: string, currentStatus: string) {
    const supabase = await createClient()

    const newStatus = currentStatus === 'ativa' ? 'inativa' : 'ativa'

    const { error } = await supabase
        .from('empresas')
        .update({ status: newStatus })
        .eq('id', id)

    if (error) {
        throw new Error('Falha ao atualizar status')
    }

    revalidatePath('/dashboard/empresas')
}
