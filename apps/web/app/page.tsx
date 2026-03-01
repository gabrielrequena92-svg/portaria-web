import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Smartphone, Globe, CheckCircle2, ArrowRight, Building2, Users, Lock, Zap, Clock, BarChart3, QrCode } from 'lucide-react'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Portaria SaaS" className="h-12 w-12 hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-black tracking-tighter text-slate-900">
              Portaria <span className="text-emerald-600">SaaS</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Funcionalidades</Link>
            <Link href="#how-it-works" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Como Funciona</Link>
            <Link href="#stats" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Benefícios</Link>
            <Link href="/login">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200">
                Acessar Sistema
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Gradient Background */}
        <section className="relative pt-40 pb-32 px-6 overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 opacity-60" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black tracking-widest uppercase animate-bounce shadow-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="h-2 w-2 rounded-full bg-emerald-500 absolute" />
                Nova Versão 2.0 Disponível
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Segurança Inteligente para <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] animate-gradient">
                  seu Condomínio.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                Gestão completa de visitantes e empresas com <span className="text-emerald-600 font-bold">sincronização offline</span>,
                QR Code dinâmico e monitoramento em <span className="text-emerald-600 font-bold">tempo real</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <Link href="/login">
                  <Button size="lg" className="group h-16 px-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-lg font-black shadow-2xl shadow-emerald-300 transition-all hover:-translate-y-1 hover:shadow-3xl">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-16 px-10 border-2 border-slate-300 rounded-2xl text-lg font-black hover:bg-slate-50 hover:border-emerald-600 hover:text-emerald-600 transition-all hover:scale-105">
                  Ver Demonstração
                </Button>
              </div>

              {/* Dashboard Preview Image */}
              <div className="pt-16 relative">
                <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                  <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                    <img src="/dashboard-preview.png" className="dark:hidden h-full w-full rounded-xl" alt="Dashboard Preview" />
                  </div>
                </div>
                <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="pt-20 space-y-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Integrado com as melhores tecnologias</p>
                <div className="flex flex-wrap justify-center gap-10 opacity-60">
                  <div className="flex items-center gap-2 hover:opacity-100 transition-opacity"><Globe className="h-6 w-6" /> <span className="font-bold">Next.js 16</span></div>
                  <div className="flex items-center gap-2 hover:opacity-100 transition-opacity"><Smartphone className="h-6 w-6" /> <span className="font-bold">Flutter 3.27</span></div>
                  <div className="flex items-center gap-2 hover:opacity-100 transition-opacity"><Lock className="h-6 w-6" /> <span className="font-bold">Supabase</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Resultados que Impressionam</h2>
              <p className="text-emerald-100 text-lg font-medium">Números que comprovam a eficiência do sistema</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105 hover:-translate-y-2 duration-300 border border-white/20">
                <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
                <div className="text-5xl font-black mb-2">1000+</div>
                <div className="text-emerald-100 font-bold">Registros/Dia</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105 hover:-translate-y-2 duration-300 border border-white/20">
                <Clock className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                <div className="text-5xl font-black mb-2">99.9%</div>
                <div className="text-emerald-100 font-bold">Uptime</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105 hover:-translate-y-2 duration-300 border border-white/20">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-purple-300" />
                <div className="text-5xl font-black mb-2">50+</div>
                <div className="text-emerald-100 font-bold">Condomínios</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105 hover:-translate-y-2 duration-300 border border-white/20">
                <Users className="h-12 w-12 mx-auto mb-4 text-pink-300" />
                <div className="text-5xl font-black mb-2">10k+</div>
                <div className="text-emerald-100 font-bold">Visitantes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Highlight */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                Funcionalidades <span className="text-emerald-600">Poderosas</span>
              </h2>
              <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar a segurança do seu condomínio em um só lugar
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="group relative bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative space-y-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">App Mobile Offline</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Sincronização inteligente que permite o registro de acessos mesmo sem internet,
                    ideal para portarias com conexão instável.
                  </p>
                  <div className="pt-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 inline mr-2" />
                    <span className="text-sm font-bold text-slate-700">Funciona 100% offline</span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative space-y-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">QR Code Dinâmico</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Gere acessos rápidos para visitantes via QR Code. Segurança total com validação
                    instantânea no dispositivo do porteiro.
                  </p>
                  <div className="pt-4">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 inline mr-2" />
                    <span className="text-sm font-bold text-slate-700">Validação em tempo real</span>
                  </div>
                </div>
              </div>

              {/* Novo Card: Gestão de Documentos */}
              <div className="group relative bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative space-y-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Conformidade Ativa</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Gestão inteligente de documentos para empresas e prestadores (NRs, ASO, CNH). Alertas automáticos 10 dias antes do vencimento.
                  </p>
                  <div className="pt-4">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 inline mr-2" />
                    <span className="text-sm font-bold text-slate-700">22 Tipos de Documentos Validáveis</span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-100 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative space-y-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Gestão 360º</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Dashboard intuitivo para administradores com fotos, histórico imutável e
                    relatórios detalhados exportáveis.
                  </p>
                  <div className="pt-4">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 inline mr-2" />
                    <span className="text-sm font-bold text-slate-700">Relatórios completos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
                Como <span className="text-emerald-600">Funciona</span>
              </h2>
              <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
                Implementação simples em 3 passos
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-teal-200 to-purple-200" />

              <div className="relative text-center group">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative h-20 w-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl mx-auto">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Cadastre seu Condomínio</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Crie sua conta, adicione empresas autorizadas e configure as permissões de acesso.
                </p>
              </div>

              <div className="relative text-center group">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative h-20 w-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl mx-auto">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Instale o App Mobile</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Baixe o app no dispositivo da portaria e sincronize os dados. Funciona offline!
                </p>
              </div>

              <div className="relative text-center group">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl mx-auto">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Monitore em Tempo Real</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Acompanhe todos os acessos pelo dashboard web com relatórios e histórico completo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-10" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-10" />

          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Pronto para Transformar a Segurança do seu Condomínio?
            </h2>
            <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">
              Junte-se a centenas de condomínios que já confiam no Portaria SaaS
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/login">
                <Button size="lg" className="group h-16 px-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl text-lg font-black shadow-2xl shadow-emerald-500/50 transition-all hover:scale-105">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="py-16 bg-slate-950 text-white px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Portaria SaaS" className="h-10 w-10" />
                <span className="text-lg font-black tracking-tighter">
                  Portaria <span className="text-emerald-500">SaaS</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Solução completa para gestão de visitantes e segurança de condomínios.
              </p>
            </div>

            <div>
              <h3 className="font-black text-sm uppercase tracking-wider mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#features" className="hover:text-emerald-400 transition-colors">Funcionalidades</Link></li>
                <li><Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">Como Funciona</Link></li>
                <li><Link href="#stats" className="hover:text-emerald-400 transition-colors">Benefícios</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-black text-sm uppercase tracking-wider mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Sobre Nós</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Contato</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Suporte</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-black text-sm uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Portaria SaaS. Todos os direitos reservados • v2.0.0
            </p>
            <p className="text-slate-400 text-sm font-bold">
              Desenvolvido por: <span className="text-emerald-400">Gabriel B. Requena</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
