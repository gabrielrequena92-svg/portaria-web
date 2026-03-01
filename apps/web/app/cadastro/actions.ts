'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const leadSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(10, 'Telefone inválido'),
    descricao_local: z.string().min(10, 'Por favor, detalhe mais o seu local (Condomínio, Empresa, Portaria...)'),
})

export type LeadState = {
    errors?: {
        nome?: string[];
        email?: string[];
        telefone?: string[];
        descricao_local?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function submitLeadForm(prevState: LeadState, formData: FormData): Promise<LeadState> {
    const validatedFields = leadSchema.safeParse({
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        descricao_local: formData.get('descricao_local'),
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Por favor, preencha todos os campos corretamente.',
            success: false,
        }
    }

    const supabase = await createClient()

    const { error } = await supabase
        .from('leads')
        .insert([
            {
                nome: validatedFields.data.nome,
                email: validatedFields.data.email,
                telefone: validatedFields.data.telefone,
                descricao_local: validatedFields.data.descricao_local,
                status: 'NOVO'
            }
        ])

    if (error) {
        console.error('Erro ao salvar lead:', error)
        return {
            message: 'Erro interno ao enviar a solicitação. Tente novamente.',
            success: false,
        }
    }

    return {
        message: 'Sucesso! Nossa equipe entrará em contato em breve.',
        success: true,
    }
}
