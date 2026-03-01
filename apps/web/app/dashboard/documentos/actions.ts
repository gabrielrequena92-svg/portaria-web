'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const documentSchema = z.object({
    parentId: z.string().uuid(),
    parentType: z.enum(['empresa', 'visitante']),
    tipoId: z.string().uuid(),
    dataVencimento: z.string().optional().nullable(),
})

export async function uploadDocument(formData: FormData) {
    const supabase = await createClient()

    const file = formData.get('arquivo') as File
    const parentId = formData.get('parentId') as string
    const parentType = formData.get('parentType') as 'empresa' | 'visitante'
    const tipoId = formData.get('tipoId') as string
    const dataVencimento = formData.get('dataVencimento') as string || null

    if (!file || file.size === 0) {
        return { message: 'Nenhum arquivo enviado.' }
    }

    // 1. Validar Extensão
    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg']
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
        return { message: 'Extensão de arquivo não permitida. Use PDF, PNG ou JPG.' }
    }

    // 2. Pegar Condomínio do Usuário
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('condominio_id')
        .eq('id', user?.id)
        .single()

    const condominioId = profile?.condominio_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

    // 3. Upload para o Storage
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const filePath = `${condominioId}/${parentType}/${parentId}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        return { message: 'Erro ao fazer upload do arquivo para o storage.' }
    }

    // 4. Registrar no Banco de Dados
    const { error: dbError } = await supabase
        .from('documentos')
        .insert({
            condominio_id: condominioId,
            parent_id: parentId,
            parent_type: parentType,
            tipo_id: tipoId,
            arquivo_url: filePath, // Guardamos o path interno do storage
            data_vencimento: dataVencimento,
            status_verificacao: 'valido'
        })

    if (dbError) {
        console.error('DB Error:', dbError)
        // Cleanup storage if DB fails
        await supabase.storage.from('documentos').remove([filePath])
        return { message: 'Erro ao registrar documento no banco de dados.' }
    }

    revalidatePath(`/dashboard/${parentType}s`)
    return { success: true, message: 'Documento enviado com sucesso!' }
}

export async function deleteDocument(documentId: string, filePath: string, parentType: string) {
    const supabase = await createClient()

    // 1. Remover do Storage
    const { error: storageError } = await supabase.storage
        .from('documentos')
        .remove([filePath])

    if (storageError) {
        console.error('Storage Delete Error:', storageError)
        return { message: 'Erro ao remover arquivo do storage.' }
    }

    // 2. Remover do Banco
    const { error: dbError } = await supabase
        .from('documentos')
        .delete()
        .eq('id', documentId)

    if (dbError) {
        console.error('DB Delete Error:', dbError)
        return { message: 'Erro ao remover registro do banco de dados.' }
    }

    revalidatePath(`/dashboard/${parentType}s`)
    return { success: true }
}

export async function getDocumentTypes(entidade: 'MEI' | 'GERAL' | 'VISITANTE') {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('documento_tipos')
        .select('*')
        .or(`entidade_alvo.eq.${entidade},entidade_alvo.eq.TODOS`)
        .order('nome')

    if (error) {
        console.error('Fetch Types Error:', error)
        return []
    }

    return data
}

export async function getDocuments(parentId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('v_conformidade_documentos')
        .select('*')
        .eq('parent_id', parentId)

    if (error) {
        console.error('Fetch Docs Error:', error)
        return []
    }

    return data
}
