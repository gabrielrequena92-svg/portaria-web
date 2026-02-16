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

    // Get Condominio ID (Assumindo single tenant por enquanto ou pegando do user metadata)
    // Como simplificação para o MVP e testes manuais, vamos pegar o primeiro condomínio que o usuário tem acesso ou 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' (do seed)
    // Em produção, isso viria do contexto do usuário logado.
    const condominioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

    let error

    if (id) {
        // Update
        const result = await supabase
            .from('empresas')
            .update({ ...data })
            .eq('id', id)
            .eq('condominio_id', condominioId)
        error = result.error
    } else {
        // Create
        const result = await supabase
            .from('empresas')
            .insert({ ...data, condominio_id: condominioId })
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
