export interface Documento {
    id: string;
    tipo_id: string;
    data_vencimento: string | null;
    status_verificacao: string;
}

export interface DocumentoTipo {
    id: string;
    obrigatorio: boolean;
    entidade_alvo: string;
    vencimento_tipo: string;
}

export type StatusConformidade = 'valido' | 'alerta' | 'vencido' | 'pendente' | 'sem_documentos' | 'bloqueado';

export function calcularStatusConformidade(
    documentos: Documento[],
    tiposRequeridos: DocumentoTipo[]
): StatusConformidade {
    if (!documentos || documentos.length === 0) {
        return tiposRequeridos.length > 0 ? 'sem_documentos' : 'valido';
    }

    let hasPendencia = false;
    let hasVencido = false;
    let hasAlerta = false;

    // Verificar se todos os obrigatórios foram enviados
    for (const tipo of tiposRequeridos) {
        if (tipo.obrigatorio) {
            const enviado = documentos.find(d => d.tipo_id === tipo.id);
            if (!enviado) {
                hasPendencia = true;
            }
        }
    }

    // Verificar os prazos dos documentos enviados
    for (const doc of documentos) {
        if (doc.data_vencimento) {
            const dataVenc = new Date(doc.data_vencimento);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const diffTime = dataVenc.getTime() - hoje.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                hasVencido = true;
            } else if (diffDays <= 10) {
                hasAlerta = true;
            }
        }
    }

    if (hasVencido) return 'vencido';
    if (hasPendencia) return 'pendente';
    if (hasAlerta) return 'alerta';

    return 'valido';
}
