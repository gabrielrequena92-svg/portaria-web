# 🚀 Guia de Deploy no GitHub & Vercel

Este guia contém as instruções passo a passo para enviar o código para o GitHub e realizar o deploy em produção na Vercel com as melhores práticas de segurança e performance.

---

## 1. 🛡️ Segurança das Variáveis de Ambiente
* O arquivo `.env.local` contém as suas credenciais reais do Supabase e **NÃO** deve ser enviado ao GitHub (já está protegido pelo `.gitignore`).
* O arquivo `.env.example` serve como referência para os membros da equipe ou para configuração inicial.

---

## 2. 📦 Passo a Passo para o GitHub

No terminal (dentro da pasta do projeto `portaria-web-master`), execute os seguintes comandos:

```bash
# 1. Inicializar o repositório Git (caso ainda não esteja inicializado)
git init

# 2. Adicionar todos os arquivos organizados
git add .

# 3. Criar o commit com uma mensagem profissional
git commit -m "feat: modulo de relatorio fotografico oficial com suporte a excel e pdf"

# 4. Definir a branch principal como main
git branch -M main

# 5. Conectar com o seu repositório remoto no GitHub (substitua pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 6. Enviar para o GitHub
git push -u origin main --force
```

---

## 3. ⚡ Passo a Passo para o Deploy na Vercel

1. Acesse o seu painel na [Vercel](https://vercel.com) e clique em **"Add New..." > "Project"**.
2. Selecione o repositório do GitHub recém-atualizado e clique em **"Import"**.
3. **Configuração do Projeto (Project Settings):**
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Se o seu repositório tiver a pasta `apps/web`, clique em *Edit* e selecione `apps/web`.
4. **Variáveis de Ambiente (Environment Variables):**
   * Adicione as seguintes variáveis (copiadas do seu `.env.local`):
     * `NEXT_PUBLIC_SUPABASE_URL`: `https://accynhzkryldezkzmury.supabase.co`
     * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_8wHIsUnRMDl3ECtK4296FQ_XBYNcqPl`
5. Clique em **"Deploy"**!

---

## 4. 🧪 Verificação Pós-Deploy
* Acesse a URL gerada pela Vercel (ex: `https://seu-app.vercel.app`).
* Faça login com suas credenciais.
* Acesse o menu **"Relatório Org."**.
* Teste a geração de uma planilha `.xlsx` com fotos direto pelo celular e pelo computador para validar a nuvem.
