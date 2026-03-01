# Business Plan: Portaria SaaS & Controle de Obras

Este documento descreve o modelo de negócios, a estrutura de custos de infraestrutura e o roadmap de evolução técnica do sistema (versão atual v2.1.2) para comercialização em larga escala.

---

## 1. O Produto e o Público-Alvo

### Público-Alvo Primário:
1. **Condomínios Residenciais de Alto Padrão**: Buscam controle rígido, QR Code, e aplicativo próprio para porteiros e moradores.
2. **Construtoras e Obras Civis**: Necessitam garantir que terceirizados e empreiteiras não acessem o local com documentação trabalhista (NRs, ASO, CNH) vencida.
3. **Centros Logísticos e Galpões Industriais**: Fluxo massivo de caminhões, controle de frota (placas) e agendamento de docas.

### O Que o Sistema Entrega (Vantagem Competitiva):
Sistema 100% em Nuvem (SaaS - Software as a Service). O cliente **não precisa comprar servidor local** nem gerenciar licenças complexas de software e redes. Eles precisam apenas de acesso à internet nos desktops da portaria e smartphones/tablets para a ronda ou operação nativa do App (que funciona Offline).

---

## 2. Precificação (Modelo de Assinatura)

O formato mais lucrativo é escalar em *assinaturas recorrentes* com uma taxa de setup (implantação) que cobre seus custos primários e serviços.

### Plano de Preços Recomendados (2026)

**A. Taxa de SETUP (Pagamento Único ao Fechar Contrato)**
- **Valor**: R$ 1.500,00 a R$ 3.500,00.
- **Justificativa Comercial**: Isso cobre o cadastramento do painel principal na sua infraestrutura, importação de dados de moradores pré-existentes e o treinamento no local para a equipe de porteiros e síndico.

**B. Assinatura Mensal (SaaS - Recorrente)**
| Porte do Cliente | Valor Mensal Sugerido | Ideal Para |
| :--- | :--- | :--- |
| **Pequeno** | R$ 350,00 | Prédios até 50 aptos, obras pequenas. |
| **Médio** | R$ 700,00 | Condomínios de até 200 lotes/aptos. |
| **Grande / Corporativo** | R$ 1.250,00+ | Megacondomínios, construtoras gigantes ou centros logísticos. Suporte VIP. |

> **Dica de Ouro**: Se a construtora quiser o sistema atrelado à marca dela (White-label), como `portaria.nomedaconstrutora.com.br`, cobre a taxa de Setup o DOBRO.

---

## 3. Custos de Servidores (Cloud Infrastructure)

Como você é o provedor do serviço (SaaS), a hospedagem e o banco de dados ficam na **sua** conta. O cliente não vê isso. 

### Estimativa Inicial (Plano Grátis - Fase de Captação)
No começo (1 a 3 clientes), seus custos serão **ZERO**.
- **Vercel (Hospedagem Web + Backend Node.js)**: O plano *Hobby* (Grátis) aguenta as primeiras instâncias.
- **Supabase (Banco de Dados, Autenticação, Storage)**: O plano *Free* suporta até 50.000 usuários ativos e 500MB de banco de dados, além de 1GB de Storage de Imagens/PDFs.

### Estimativa de Escala (Plano Profissional - Quando você tiver 5+ clientes pagantes)
Quando o sistema ganhar tração e faturar mais de R$ 5.000/mês, os recursos do plano grátis estourarão (principalmente o espaço de armazenamento de PDFs/Fotos de documentos e o tráfego de banda).

1. **Supabase PRO**: **$25 USD / mês (Aprox. R$ 125,00)**
   - Backups diários automáticos.
   - Picos de milhares de conexões simultâneas livres.
   - 8GB de armazenamento de banco (milhões de registros) e 100GB para PDFs/Fotos.
   
2. **Vercel PRO**: **$20 USD / mês (Aprox. R$ 100,00)**
   - Banda de tráfego ultra-rápida (1 TB).
   - Suporte e domínios personalizados ilimitados.

**Total Custos Cloud (Escalado)**: Aproximadamente **R$ 225,00 / mês**.
**Matemática Final**: Se você tiver 10 clientes pagando R$ 500 mensais = R$ 5.000 de faturamento bruto - R$ 225 de servidor = **Margem de lucro de quase 95%** referente ao SaaS em si.

---

## 4. Roadmap Técnico: Rumo à Escalabilidade Multi-Tenant

Para tornar possível vender esse sistema livremente na internet para múltiplos condomínios/obras diferentes no **mesmo** banco de dados, e permitir que o Síndico ou Engenheiro crie seus próprios documentos obrigatórios, este é o *Roadmap de Código* a ser executado:

### Etapa 1: Preparação Multi-Tenant (Isolamento de Dados)
Hoje o sistema assume que existe apenas um painel central. Adicionaremos o ID da empresa ou condomínio raiz a tudo.
1. **Migrations SQL**: Adicionar a coluna `condominio_id` às tabelas: `documento_tipos`, `profiles`, `empresas`, `visitantes` e `eventos`.
2. **Postgres RLS (Row Level Security)**: Adicionar regras no Supabase que forcem o filtro: `CREATE POLICY "Dados isolados" ON visitantes FOR ALL USING (condominio_id = auth.jwt()->>condominio_id)`. Assim, nenhum dado do Condomínio A vaza para o B, mesmo estando na mesma tabela de banco.

### Etapa 2: Customização de Documentação Dinâmica (Compliance)
1. **Remover Globalidade**: Alterar a UI de `/dashboard/configuracoes/documentos` para que, ao invés de usar os 22 tipos de NRs prévios do código puro, cada cliente crie o seu.
2. **Camada de Backend (Supabase RPCs)**: Mudar o nosso motor `conformity.ts` atual para cruzar apenas os dados associados à propriedade (`condominio_id`) daquele cliente específico, mantendo a regra de "Pendente", "Vencido" ou "Alerta".

### Etapa 3: White Label Parcial (Opcional)
1. Nas páginas do App e na Dashboard Web, criar uma tabela auxiliar `tenant_config` onde salva-se a URL do Logotipo da construtora e a cor primária. 
2. Os estilos React (Tailwind) e Flutter poderão aplicar aquela paleta de cores primárias sob demanda quando o morador daquele condomínio loga na conta.
