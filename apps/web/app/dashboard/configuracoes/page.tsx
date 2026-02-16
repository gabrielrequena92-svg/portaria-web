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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Configurações</h2>
                <p className="text-slate-500">Gerencie os parâmetros do sistema e usuários.</p>
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
                        <CardHeader>
                            <CardTitle>Dados do Condomínio</CardTitle>
                            <CardDescription>Informações básicas do estabelecimento.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Nome</p>
                                <p className="text-lg font-medium">{condominio?.nome || 'Não configurado'}</p>
                            </div>
                            <div className="grid gap-2">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Endereço</p>
                                <p className="text-slate-600">{condominio?.endereco || 'Não configurado'}</p>
                            </div>
                            <p className="text-xs text-slate-400 italic mt-8">* Edição de dados do condomínio será implementada na próxima fase.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="usuarios">
                    <Card className="border-none shadow-sm rounded-3xl text-center py-20">
                        <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Gestão de Usuários</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-6">Cadastre novos porteiros e administradores para o sistema.</p>
                        <p className="text-xs text-slate-400">Em desenvolvimento.</p>
                    </Card>
                </TabsContent>

                <TabsContent value="categorias">
                    <Card className="border-none shadow-sm rounded-3xl">
                        <CardHeader>
                            <CardTitle>Tipos de Visitantes</CardTitle>
                            <CardDescription>Gerencie as opções disponíveis no cadastro.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                {tipos?.map(tipo => (
                                    <div key={tipo.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="font-bold text-slate-700">{tipo.nome}</span>
                                        <Badge variant="outline" className="bg-white">Padrão</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function Badge({ children, className, variant }: any) {
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${className}`}>{children}</span>
}
