# Lotofácil - Gerador e Otimizador de Jogos
> Aplicação Web/Mobile-First construída com React Native (Expo Web), TypeScript e identidade visual oficial da Caixa Econômica Federal.

---

## 1. Visão Geral

O **Lotofácil - Gerador e Otimizador** é uma aplicação voltada para apostadores que desejam gerar apostas matematicamente equilibradas a partir de um volante reduzido de **20 dezenas**.

A aplicação calcula todas as combinações possíveis de 15 números a partir das 20 escolhidas e aplica simultaneamente 4 filtros estatísticos baseados no histórico de sorteios da Lotofácil, exibindo e exportando apenas os jogos de maior probabilidade matemática.

---

## 2. Regras de Negócio e Algoritmo

### 2.1. Seleção no Volante
- O usuário escolhe exatamente **20 números** no volante interativo 5x5 (de 01 a 25).
- Funções auxiliares:
  - **SURPRESINHA:** Seleciona 20 dezenas aleatórias instantaneamente.
  - **COMPLETAR:** Quando há menos de 20 dezenas marcadas, completa aleatoriamente até atingir 20.
  - **LIMPAR:** Desmarca todas as dezenas e reinicia o estado.

### 2.2. Cálculo Combinatório
A partir das 20 dezenas escolhidas, o total de jogos de 15 números possíveis é dado pela combinação simples:

$$C(20, 15) = \frac{20!}{15! \times 5!} = 15.504 \text{ combinações}$$

### 2.3. Filtros Estatísticos Oficiais
Cada uma das 15.504 combinações é submetida a 4 critérios. Uma combinação só é aprovada se atender a todos os 4 filtros simultaneamente:

1. **Números Ímpares:** Entre **7 e 8** ímpares (ocorrência em ~62% dos sorteios históricos).
2. **Soma Total:** Soma das 15 dezenas entre **170 e 220**.
3. **Dezenas na Moldura:** Entre **9 e 11** dezenas pertencentes à borda do volante (as 16 dezenas periféricas: `01, 02, 03, 04, 05, 06, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25`).
4. **Números Primos:** Entre **4 e 6** números primos (dos 9 primos existentes: `02, 03, 05, 07, 11, 13, 17, 19, 23`).

---

## 3. Identidade Visual e Design System

### 3.1. Tipografia
Família tipográfica oficial integrada via `expo-font`: **BBC Reith Sans**.
- `BBCReithSans-Regular` (`BBCReithSans_A_Rg.ttf`): Textos corridos e subtítulos.
- `BBCReithSans-Medium` (`BBCReithSans_A_Md.ttf`): Rótulos, métricas e legendas.
- `BBCReithSans-Bold` (`BBCReithSans_A_Bd.ttf`): Títulos, dezenas das bolas e botões de ação.
- `BBCReithSans-ExtraBold` (`BBCReithSans_A_ExBd.ttf`): Destaques institucionais.

### 3.2. Paleta de Cores
- **Magenta Lotofácil Principal:** `#a8348c` (Bolas selecionadas, destaques, botões secundários).
- **Azul Caixa Institucional:** `#005CA9` / `#0066A6` (Ações Caixa, destaques).
- **Azul Acinzentado (*Slate Blue*):** `#334E68` / `#243B53` (Botão flutuante FAB e halos luminosos de alto contraste).
- **Cinza Moldura:** `#4C556C` (Indicador de dezenas da borda na legenda, volante e cartões).
- **Laranja Números Primos:** `#FF6000` (Indicador de dezenas primas na legenda, volante e cartões).
- **Fundo da Aplicação:** `#F4F4F6` (Cinza claro institucional).
- **Superfície dos Cartões:** `#FFFFFF` com bordas finas `#D2D4DA` / `#E2E8F0`.
- **Texto Principal:** `#1F2A47` (Azul marinho escuro de alto contraste).
- **Texto Secundário:** `#4C556C` (Cinza médio institucional).

> **Diretriz de Design:** Zero uso de emojis em toda a interface gráfica, alertas, botões, modais e arquivos exportados.

---

## 4. Arquitetura de Componentes

```text
src/
├── components/
│   ├── Header.tsx              # Logo oficial da Lotofácil com redimensionamento proporcional
│   ├── NumberGrid.tsx          # Volante 5x5 com indicadores de Moldura/Primos e botões de ação
│   ├── FilterControls.tsx      # Seletor de quantidade (5, 10, 15, 20, 50, Todos) com alinhamento óptico
│   ├── ActionBar.tsx           # Botão circular da Lotofácil com anel de pulso luminoso contínuo
│   ├── StatsBanner.tsx         # Resumo estatístico com taxa de aprovação e barra de progresso
│   ├── GameCard.tsx            # Cartão de aposta individual com 15 dezenas e métricas
│   ├── FloatingActions.tsx     # Menu flutuante (FAB) em azul acinzentado (Copiar, Exportar, Como Funciona)
│   ├── HowItWorksModal.tsx     # Modal com a explicação da matemática e dos 4 filtros
│   ├── ExportModal.tsx         # Modal com visualização e download direto de arquivos TXT / CSV
│   └── Toast.tsx               # Notificações toast acessíveis e não intrusivas
├── types/
│   └── index.ts                # Definições de tipos TypeScript (GameResult, FilterRules, etc.)
└── utils/
    └── lotofacilUtils.ts       # Motor combinatório C(n, k), filtros e geradores TXT/CSV
```

---

## 5. Comandos de Desenvolvimento e Build

### Instalação de Dependências
```bash
cd lotofacil-app
npm install
```

### Executar Localmente (Navegador Web)
```bash
npx expo start --web
```

### Checagem de Tipagem TypeScript
```bash
npx tsc --noEmit
```

### Gerar Pacote de Produção Estático
```bash
npx expo export -p web --output-dir dist
```
*Gera todo o pacote estático otimizado na pasta `dist/`.*

---

## 6. Manual de Publicação na VPS (Deploy)

### 6.1. Dados de Produção
- **Domínio:** `lotofacil.engine.lat`
- **Diretório na VPS:** `/home/engine/labs/lotofacil`

### 6.2. Enviar Arquivos para o Servidor
No computador local (PowerShell):
```powershell
cd C:\Users\thiag\lotofacil-app
npx expo export -p web --output-dir dist
scp -r dist/* root@SEU_IP:/home/engine/labs/lotofacil/
```

### 6.3. Configurar Permissões no Servidor
No terminal da VPS:
```bash
# 1. Permissão de travessia nos diretórios pai
sudo chmod a+x /home
sudo chmod a+x /home/engine
sudo chmod a+x /home/engine/labs
sudo chmod a+x /home/engine/labs/lotofacil

# 2. Permissão de leitura nos arquivos
sudo chmod -R 755 /home/engine/labs/lotofacil
sudo chmod -R a+r /home/engine/labs/lotofacil

# 3. Adicionar o usuário do Nginx ao grupo
sudo usermod -aG engine www-data
```

### 6.4. Configuração do Nginx
Arquivo `/etc/nginx/sites-available/lotofacil.engine.lat`:

```nginx
server {
    listen 80;
    server_name lotofacil.engine.lat;
    root /home/engine/labs/lotofacil;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html =404;
    }

    # Compressão de alta velocidade
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Cache para fontes e imagens
    location ~* \.(ttf|woff|woff2|png|jpg|jpeg|ico)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Ativação do site:
```bash
sudo ln -sf /etc/nginx/sites-available/lotofacil.engine.lat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6.5. Certificado SSL Gratuito (HTTPS)
```bash
sudo certbot --nginx -d lotofacil.engine.lat
```

---

## 7. Formato de Exportação dos Jogos

### Formato TXT
```text
=================================================
                  - LOTOFÁCIL -
        Gerado em: 16/08/2026, 16:51:44
                20 Dezenas Base: 
01 02 03 05 06 07 08 09 10 11 12 13 14 18 20 21 22 23 24 25
               Total de Jogos: 10
=================================================

Jogo 01: 01 02 03 05 06 07 08 09 10 11 14 22 23 24 25
Jogo 02: 01 02 03 05 06 07 08 09 10 11 18 20 21 24 25
Jogo 03: 01 02 03 05 06 07 08 09 10 11 18 20 22 23 25
...
```

### Formato CSV (Excel / Planilhas)
```csv
Jogo,D01,D02,D03,D04,D05,D06,D07,D08,D09,D10,D11,D12,D13,D14,D15,Soma,Impares,Pares,Moldura,Primos
1,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,120,8,7,11,6
2,01,02,03,04,05,06,07,08,09,10,11,12,13,14,16,121,7,8,12,6
```
