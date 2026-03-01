'use client'

import { Building2, ArrowLeft, CheckCircle2, ShieldCheck, Mail, Phone, UserRound } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useActionState } from 'react'
import { submitLeadForm, LeadState } from './actions'
import { ParticlesBackground } from '@/components/ui/particles-background'

const initialState: LeadState = { message: undefined, errors: {} }

export default function CadastroPage() {
    const [state, formAction, isPending] = useActionState(submitLeadForm, initialState)

    if (state.success) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
                <ParticlesBackground />
                <div className="max-w-md w-full bg-white border border-emerald-100 p-10 rounded-3xl text-center relative z-10 shadow-2xl shadow-emerald-900/5">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">Solicitação Enviada!</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Nossa equipe de especialistas recebeu seus dados. Entraremos em contato em breve para liberar o seu acesso à plataforma.
                    </p>
                    <Link href="/">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-2xl">
                            Voltar ao Início
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden">
            <ParticlesBackground />

            {/* Left Column - Presentation */}
            <div className="md:flex-1 p-8 md:p-20 relative z-10 flex flex-col justify-between hidden md:flex">
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Voltar
                    </Link>

                    <div className="mt-20 max-w-lg">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                            O futuro da sua portaria começa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">agora.</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed mb-12">
                            Transforme o controle de acesso do seu condomínio com a plataforma mais moderna e segura do mercado.
                        </p>

                        <div className="space-y-6">
                            {[
                                "Implantação rápida e 100% online",
                                "Gestão de Documentos inteligente (NRs, CNH)",
                                "Funcionamento Offline para o porteiro",
                                "App Exclusivo para Moradores e QR Code"
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex-1 p-6 flex items-center justify-center relative z-10 w-full">
                <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-2xl shadow-emerald-900/5">
                    <div className="md:hidden mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </Link>
                        <h2 className="text-3xl font-black text-slate-900">Começar Agora</h2>
                        <p className="text-slate-600 mt-2">Dê o primeiro passo para modernizar sua portaria.</p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nome" className="text-slate-700 font-bold">Nome Completo</Label>
                            <div className="relative">
                                <Input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    placeholder="Seu nome completo"
                                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 pl-12 rounded-2xl focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                                <UserRound className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                            </div>
                            {state.errors?.nome && <p className="text-red-500 text-sm">{state.errors.nome[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-bold">E-mail Profissional</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="voce@condominio.com"
                                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 pl-12 rounded-2xl focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                            </div>
                            {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone" className="text-slate-700 font-bold">Telefone / WhatsApp</Label>
                            <div className="relative">
                                <Input
                                    id="telefone"
                                    name="telefone"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    placeholder="(11) 99999-9999"
                                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 pl-12 rounded-2xl focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                                <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                            </div>
                            {state.errors?.telefone && <p className="text-red-500 text-sm">{state.errors.telefone[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao_local" className="text-slate-700 font-bold">Tipo de Local (Condomínio, Empresa...)</Label>
                            <div className="relative">
                                <Textarea
                                    id="descricao_local"
                                    name="descricao_local"
                                    required
                                    rows={3}
                                    placeholder="Ex: Condomínio Residencial com 200 apartamentos..."
                                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 pt-4 pl-12 rounded-2xl resize-none focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                                <Building2 className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                            </div>
                            {state.errors?.descricao_local && <p className="text-red-500 text-sm">{state.errors.descricao_local[0]}</p>}
                        </div>

                        {state.message && !state.success && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">
                                {state.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1 mt-4"
                        >
                            {isPending ? 'Enviando Solicitação...' : 'Solicitar Acesso Gratuito'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
