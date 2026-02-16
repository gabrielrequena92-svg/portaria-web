'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const visitorSchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos (apenas números)"),
    empresa_id: z.string().optional().nullable(),
    status: z.enum(["ativo", "bloqueado", "inativo"]).default("ativo"),
    tipo_visitante_id: z.string().min(1, "Selecione uma categoria"),
    placa_veiculo: z.string().optional().nullable(),
})

export async function createOrUpdateVisitor(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Pegar o condomínio do usuário logado
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: 'Usuário não autenticado.' }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('condominio_id')
        .eq('id', user.id)
        .single()

    // Fallback para o condomínio padrão se o perfil não estiver configurado (evita erro de bloqueio)
    const condomioId = profile?.condominio_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

    const rawData = {
        id: formData.get('id') as string,
        nome: formData.get('nome') as string,
        cpf: formData.get('cpf') as string,
        empresa_id: formData.get('empresa_id') as string === 'none' ? null : formData.get('empresa_id') as string,
        status: formData.get('status') as "ativo" | "bloqueada" | "inativa",
        tipo_visitante_id: formData.get('tipo_visitante_id') as string,
        placa_veiculo: formData.get('placa_veiculo') as string || null,
    }

    const photoFile = formData.get('foto') as File | null

    const validatedFields = visitorSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Erro na validação dos campos.',
        }
    }

    const { id, ...data } = validatedFields.data

    let photoUrl = null

    // Upload da Foto (se houver)
    if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('visitantes')
            .upload(filePath, photoFile)

        if (uploadError) {
            console.error('Erro no upload:', uploadError)
            return { message: 'Erro ao fazer upload da foto.' }
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('visitantes')
            .getPublicUrl(filePath)

        photoUrl = publicUrl
    }

    let error

    const dataToSave = {
        ...data,
        condominio_id: condomioId,
        ...(photoUrl ? { foto_url: photoUrl } : {}) // Só atualiza se tiver nova foto
    }

    if (id) {
        // Update
        const result = await supabase
            .from('visitantes')
            .update(dataToSave)
            .eq('id', id)
            .eq('condominio_id', condomioId)
        error = result.error
    } else {
        // Create
        const result = await supabase
            .from('visitantes')
            .insert(dataToSave)
        error = result.error
    }

    if (error) {
        console.error(error)
        if (error.code === '23505') { // Unique violation
            return { message: 'Já existe um visitante com este CPF neste condomínio.' }
        }
        return { message: 'Erro ao salvar visitante no banco de dados.' }
    }

    revalidatePath('/dashboard/visitantes')

    // Return the ID for QR Code generation (if new)
    const finalId = id || (error === null ? (await supabase.from('visitantes').select('id').eq('cpf', data.cpf).eq('condominio_id', condomioId).single()).data?.id : null)

    return {
        message: 'Sucesso!',
        success: true,
        visitorId: finalId
    }
}
