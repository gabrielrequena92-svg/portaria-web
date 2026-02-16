import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Users, Building, Tags } from 'lucide-react'

export default async function ConfiguracoesPage() {
    const supabase = await createClient()

    // Verificar se é Admin
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    // Buscar dados do condomínio
    const { data: condominio } = await supabase
        .from('condominios')
        .select('*')
        .single()

    // Buscar Tipos de Visitantes
    const { data: tipos } = await supabase
        .from('tipos_visitantes')
        .select('*')
        .order('nome')

    // Buscar perfis para gestão de usuários
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Configurações</h2>
                <p className="text-slate-500">Gerencie os parâmetros do sistema e equipe.</p>
            </div>

            <Tabs defaultValue="condominio" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-2xl h-14 overflow-hidden">
                    <TabsTrigger value="condominio" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                        <Building className="h-4 w-4" />
                        Condomínio
                    </TabsTrigger>
                    <TabsTrigger value="usuarios" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                        <Users className="h-4 w-4" />
                        Usuários
                    </TabsTrigger>
                    <TabsTrigger value="categorias" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white gap-2">
                        <Tags className="h-4 w-4" />
                        Categorias
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="condominio">
                    <Card className="border-none shadow-sm rounded-3xl">
                        <CardContent className="pt-6">
                            <CondominioEditor condominio={condominio} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="usuarios">
                    <Card className="border-none shadow-sm rounded-3xl">
                        <CardContent className="pt-6">
                            <UserManager profiles={profiles || []} currentUserId={user?.id || ''} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categorias">
                    <Card className="border-none shadow-sm rounded-3xl">
                        <CardContent className="pt-6">
                            <CategoriaManager tipos={tipos || []} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

import { CondominioEditor } from './CondominioEditor'
import { UserManager } from './UserManager'
import { CategoriaManager } from './CategoriaManager'

function Badge({ children, className, variant }: any) {
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${className}`}>{children}</span>
}
