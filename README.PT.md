# SPA-Trecks — Analisador Offline de Trilhas GPS

[![Versão](https://img.shields.io/badge/versão-1.1.0-blue.svg)](https://github.com/Antigravity/SPA-Trecks)
[![Licença](https://img.shields.io/badge/licença-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-estável-brightgreen.svg)]()

**Linguagens / Languages:** [English](README.md) | [Русский](README.RU.md) | [Українська](README.UA.md) | [Deutsch](README.DE.md) | [Français](README.FR.md) | **Português**

---

## Descrição

O **SPA-Trecks** é um analisador de trilhas GPS que funciona totalmente no navegador, sem necessidade de backend, banco de dados ou etapa de compilação. Basta abrir a página, carregar seus arquivos GPX, TCX ou KML e explorar suas trilhas com mapas interativos, gráficos sincronizados, animação de percurso e estatísticas detalhadas.

Construído com JavaScript puro (ES2022+), Leaflet, Chart.js e Hammer.js — sem frameworks, sem npm, sem configuração.

---

## Funcionalidades

- **Carregamento de múltiplas trilhas** — Adicione vários arquivos GPX/TCX/KML simultaneamente pelo painel lateral. Clique em "+ Adicionar Arquivos" para selecionar.
- **Alternância de visibilidade** — Cada trilha carregada possui uma caixa de seleção. Marque/desmarque para exibir ou ocultar no mapa. Trilhas desmarcadas permanecem carregadas na memória.
- **Seleção de trilha primária** — Clique no nome de uma trilha na lista para defini-la como primária (destacada em dourado). A trilha primária recebe coloração por mapa de calor, animação de reprodução, gráficos e estatísticas. As demais trilhas são desenhadas em sua cor sólida atribuída.
- **Remoção de trilha** — Clique no botão × para remover uma trilha da sessão atual.
- **Coloração por mapa de calor** — Rotas coloridas por velocidade (verde=lento → vermelho=rápido), elevação ou frequência cardíaca, usando gradiente HSL com 32 faixas de cor.
- **Gráficos sincronizados (Chart.js)** — Gráficos de velocidade, elevação e frequência cardíaca sincronizados com a reprodução no mapa.
- **Reprodução animada** — Animação com marcador móvel ao longo da rota. Painel de telemetria em tempo real mostrando velocidade, FC, elevação e tempo.
- **Estatísticas da rota** — Distância, duração, velocidade média/máxima, ganho/perda de elevação, FC média/máxima, quantidade de pontos, horários de início e fim.
- **Dicas de ferramenta (tooltip)** — Passe o mouse sobre a rota para ver informações detalhadas do ponto: velocidade, elevação, FC, tempo, distância e coordenadas.
- **Exportação de dados** — Exporte a trilha primária nos formatos CSV, JSON ou GPX.
- **Suporte mobile** — Gestos de toque via Hammer.js (deslizar para trocar modo, toque duplo para reproduzir/pausar).
- **Correção de deriva de altitude** — Suaviza dados de elevação e corrige a deriva de altitude entre o início e o fim da trilha.
- **Modo tela cheia** — Pressione F para ativar tela cheia.
- **Painel de trilhas recolhível** — Clique em ▼/▶ para recolher ou expandir o painel de trilhas.

---

## Atalhos de teclado

| Atalho | Ação |
|--------|------|
| **S** | Modo velocidade (coloração por velocidade) |
| **H** | Modo altura (coloração por elevação) |
| **P** | Modo pulso (coloração por frequência cardíaca) |
| **G** | Mostrar/ocultar painel de gráficos |
| **T** | Mostrar/ocultar sobreposição de estatísticas |
| **Espaço** | Reproduzir/Pausar animação |
| **← / →** | Retroceder/Avançar um ponto |
| **X** | Exportar CSV |
| **Z** | Exportar JSON |
| **E** | Exportar GPX |
| **F** | Ativar/Desativar tela cheia |
| **C** | Aplicar correção de deriva de altitude |

---

## Controles por toque (Mobile)

| Gesto | Ação |
|-------|------|
| **Deslizar para esquerda/direita** | Alternar modo (velocidade/altura) |
| **Deslizar para cima** | Abrir painel de gráficos |
| **Deslizar para baixo** | Fechar painel de gráficos |
| **Toque duplo** | Reproduzir/Pausar |
| **Toque longo** | Log de depuração |

---

## Instalação e início rápido

O SPA-Trecks não requer instalação de dependências, nem etapa de compilação. Basta servir os arquivos estáticos:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Antigravity/SPA-Trecks.git
   ```

2. **Acesse o diretório do projeto:**
   ```bash
   cd SPA-Trecks
   ```

3. **Inicie um servidor de arquivos estáticos**, por exemplo:
   ```bash
   # Com Python
   python3 -m http.server 8000

   # Com Node.js
   npx serve .
   ```
   Ou utilize a extensão **Live Server** do VS Code.

4. **Abra o navegador** em `http://localhost:8000`.

5. Clique em **"+ Adicionar Arquivos"** no painel superior direito para carregar seus arquivos de trilha GPS.

> **Nota:** O aplicativo não funciona abrindo o `index.html` diretamente pelo protocolo `file://`. É necessário um servidor HTTP.

---

## Estrutura do projeto

```
SPA-Trecks/
├── index.html              # Página HTML principal
├── app.js                  # Orquestrador da aplicação
├── style.css               # Todos os estilos CSS
├── modules/
│   ├── parser.js           # Interpretador de arquivos GPX/TCX/KML
│   ├── renderer.js         # Renderização no mapa, mapa de calor, marcadores, tooltips
│   ├── charts.js           # Gráficos de velocidade/elevação/FC (Chart.js)
│   ├── playback.js         # Motor de animação de reprodução
│   ├── statistics.js       # Calculadora de estatísticas da rota
│   ├── tracks-panel.js     # Painel de seleção de trilhas com caixas de seleção
│   ├── export.js           # Exportação nos formatos CSV/JSON/GPX
│   ├── ui.js               # Controles por teclado e botões
│   ├── drift.js            # Suavização de altitude e correção de deriva
│   └── mobile.js           # Gestos de toque com Hammer.js
├── LICENSE                 # Licença MIT
└── README.md               # Documentação (English)
```

---

## Requisitos do navegador

Navegador moderno com suporte a módulos ES:

- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

> **Conexão com a internet:** necessária para carregar as bibliotecas via CDN (Leaflet, Chart.js, Hammer.js) na primeira vez e para os tiles do mapa.

---

## Licença

Este projeto está licenciado sob a **Licença MIT**. É livre para uso, cópia, distribuição e modificação. Consulte o arquivo [LICENSE](LICENSE) para o texto completo da licença.
