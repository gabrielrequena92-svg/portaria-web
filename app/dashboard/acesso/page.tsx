import { createClient } from '@/lib/supabase/server'
import { AccessControl } from '@/components/features/acesso/access-control'

export default async function AcessoPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Controle de Acesso</h2>
                    <p className="text-slate-500">
                        Escaneie o QR Code ou digite o código para validar a entrada.
                    </p>
                </div>
            </div>

            <AccessControl />
        </div>
    )
}
