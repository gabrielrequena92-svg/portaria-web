'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileSpreadsheet, 
  Download, 
  ArrowLeft, 
  Search, 
  Building2, 
  Calendar, 
  User, 
  Image as ImageIcon, 
  Clock, 
  Layers, 
  RefreshCw,
  ExternalLink,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { getHistoricoRelatorios, getObras, HistoricoDbRecord, ObraDbRecord } from '../actions';
import { toast } from 'sonner';

export default function HistoricoRelatoriosPage() {
  const [historico, setHistorico] = useState<HistoricoDbRecord[]>([]);
  const [obras, setObras] = useState<ObraDbRecord[]>([]);
  const [selectedObra, setSelectedObra] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async (obraFilter?: string) => {
    setIsLoading(true);
    try {
      const [historicoRes, obrasRes] = await Promise.all([
        getHistoricoRelatorios(obraFilter && obraFilter !== 'TODAS' ? obraFilter : undefined),
        getObras()
      ]);

      if (historicoRes.success) {
        setHistorico(historicoRes.data);
      }
      if (obrasRes.success) {
        setObras(obrasRes.data);
      }
    } catch (err: any) {
      toast.error('Erro ao carregar histórico: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedObra);
  }, [selectedObra]);

  // Filtro de busca textual
  const filteredHistorico = historico.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchObra = item.obra_nome?.toLowerCase().includes(search);
    const matchSemana = item.semana_ref?.toLowerCase().includes(search);
    const matchEng = item.engenheiro?.toLowerCase().includes(search);
    const matchCoord = item.coordenador?.toLowerCase().includes(search);
    const matchArquivo = item.arquivo_nome?.toLowerCase().includes(search);
    return matchObra || matchSemana || matchEng || matchCoord || matchArquivo;
  });

  // Métricas
  const totalRelatorios = historico.length;
  const totalFotosRegistradas = historico.reduce((acc, curr) => acc + (curr.total_fotos || 0), 0);
  const totalObrasAtivas = new Set(historico.map(h => h.obra_nome)).size;

  const handleDownload = (item: HistoricoDbRecord) => {
    if (item.arquivo_url) {
      window.open(item.arquivo_url, '_blank');
      toast.success(`Baixando ${item.arquivo_nome}...`);
    } else {
      toast.error('Arquivo não disponível no storage.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER DA PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/relatorio-organizacao"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-sm transition"
              >
                <ArrowLeft size={14} /> Voltar ao Gerador
              </Link>
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Nuvem Supabase
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 mt-2">
              Histórico de Relatórios Gerados
            </h1>
            <p className="text-xs text-neutral-500">
              Consulte, filtre e faça o download dos relatórios oficiais (.xlsx) salvos no banco de dados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(selectedObra)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 rounded-2xl border border-neutral-200 text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Atualizar
            </button>

            <Link
              href="/dashboard/relatorio-organizacao"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
            >
              <PlusCircle size={16} />
              Novo Relatório
            </Link>
          </div>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Relatórios Salvos</p>
              <p className="text-2xl font-black text-neutral-900">{totalRelatorios}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fotos Catalogadas</p>
              <p className="text-2xl font-black text-neutral-900">{totalFotosRegistradas}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Obras com Registros</p>
              <p className="text-2xl font-black text-neutral-900">{totalObrasAtivas}</p>
            </div>
          </div>
        </div>

        {/* BARRA DE FILTROS E BUSCA */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
            {/* Seletor de Obras */}
            <div className="w-full md:w-72">
              <select
                value={selectedObra}
                onChange={(e) => setSelectedObra(e.target.value)}
                className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="TODAS">🏢 Todas as Obras</option>
                {obras.map((obra) => (
                  <option key={obra.nome} value={obra.nome}>
                    {obra.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de Busca Livre */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por semana, engenheiro, arquivo..."
                className="w-full h-11 pl-10 pr-4 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <span className="text-xs font-semibold text-neutral-400 shrink-0">
            {filteredHistorico.length} {filteredHistorico.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {/* LISTAGEM DE HISTÓRICO */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 border border-neutral-200 text-center space-y-3">
            <RefreshCw className="animate-spin text-emerald-600 mx-auto" size={32} />
            <p className="text-sm font-bold text-neutral-700">Carregando histórico do Supabase...</p>
          </div>
        ) : filteredHistorico.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-neutral-200 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <FileSpreadsheet size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-800">Nenhum relatório encontrado</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                {searchTerm || selectedObra !== 'TODAS'
                  ? 'Nenhum relatório corresponde aos filtros selecionados. Tente ajustar a busca.'
                  : 'Gere o seu primeiro relatório fotográfico de organização para vê-lo listado aqui com backup na nuvem.'}
              </p>
            </div>
            <Link
              href="/dashboard/relatorio-organizacao"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
            >
              <PlusCircle size={16} />
              Criar Novo Relatório
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistorico.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-emerald-600 shrink-0" />
                      <h3 className="font-bold text-sm text-neutral-900 line-clamp-1">{item.obra_nome}</h3>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                      <Calendar size={13} className="text-neutral-400" />
                      {item.semana_ref || 'Semana não especificada'}
                    </p>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider shrink-0 ${
                    item.tipo_arquivo === 'pdf' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.tipo_arquivo === 'pdf' ? 'DOCUMENTO .PDF' : 'EXCEL .XLSX'}
                  </span>
                </div>

                {/* Detalhes do Relatório */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-neutral-600">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">Engenheiro(a):</span>
                    <p className="font-medium truncate">{item.engenheiro || 'Não informado'}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">Coordenador:</span>
                    <p className="font-medium truncate">{item.coordenador || 'Não informado'}</p>
                  </div>
                </div>

                {/* Footer do Card com Botão de Download */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700">
                      <Layers size={13} className="text-neutral-400" />
                      <span>{item.total_fotos} fotos</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-400 font-normal">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')} às {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate max-w-[200px]" title={item.arquivo_nome}>
                      {item.arquivo_nome}
                    </p>
                  </div>

                  {item.arquivo_url ? (
                    <button
                      onClick={() => handleDownload(item)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 ${
                        item.tipo_arquivo === 'pdf'
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      }`}
                    >
                      <Download size={14} />
                      Baixar ({item.tipo_arquivo === 'pdf' ? '.pdf' : '.xlsx'})
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-400 rounded-xl text-xs font-medium"
                    >
                      Processado
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
