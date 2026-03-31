# macOS Native Dashboard for Linux

> Um widget de produtividade e telemetria de hardware escrito em Electron, focado em performance absoluta, renderização sem frameworks e integração profunda com o sistema operacional (Wayland/X11).

![Dashboard Screenshot](./images/screenshot.png) 

## 🏗️ Arquitetura e Decisões de Engenharia

Este projeto foi construído com a premissa de **zero inchaço (bloatware)**. Em vez de depender de frameworks de front-end pesados (React/Angular) ou servidores locais em Python para coletar dados, a aplicação opera através de manipulação direta do DOM e chamadas nativas do Node.js aos controladores do hardware.

Abaixo estão as soluções arquiteturais implementadas para resolver problemas complexos do ciclo de vida de aplicações desktop no Linux:

### 1. Telemetria de Hardware em Tempo Real (Zero-Server)
A dependência de rotas HTTP locais (`localhost:5000`) foi extirpada. O consumo de CPU, RAM, uso de disco, status de rede e o Uptime absoluto dos processos são capturados diretamente do kernel do Linux através da biblioteca `systeminformation`. 
* **Otimização:** A renderização dos gráficos (Top Processos) é desenhada via cálculos CSS/DOM em tempo real, eliminando a necessidade de importar bibliotecas de gráficos pesadas como Chart.js.

### 2. Motor Geométrico Dinâmico (Clima)
Para replicar a interface de barras de temperatura da Apple de forma funcional (e não apenas estética), foi desenvolvido um algoritmo matemático que calcula a amplitude térmica da semana e injeta os percentuais de largura e margem esquerda dinamicamente no CSS.
* A posição e o tamanho de cada barra são calculados usando interpolação linear básica: 
$W_{\%} = \frac{T_{max} - T_{min}}{Amplitude_{total}} \times 100$ e $L_{\%} = \frac{T_{min} - T_{absoluta}}{Amplitude_{total}} \times 100$.

### 3. Blindagem de File System (ASAR Protection)
Aplicativos empacotados pelo `electron-builder` rodam a partir de um arquivo read-only (`app.asar`), o que quebra tentativas de gravação em arquivos locais como `.json`.
* **Solução:** Implementação de uma ponte IPC (`ipcMain` e `ipcRenderer`) para espelhar e ler contratos de dados dinâmicos (como o `events.json` do calendário) diretamente no diretório nativo seguro do usuário (`~/.config/macos-dashboard/`), garantindo que a aplicação não quebre após a compilação.

### 4. Transparência Tátil e Controle de Estado (Wayland)
Para que o dashboard flutuasse no desktop sem bloquear os cliques do usuário no Ubuntu, a janela foi configurada com `win.setIgnoreMouseEvents(true)`.
* **O Kill-Switch:** Como a janela se torna intocável (um fantasma de interface), botões "X" físicos perdem a utilidade. Foi implementado um ouvinte de hardware via `globalShortcut` no motor do Node.js. Pressionar `Ctrl + Shift + X` em qualquer lugar do sistema operacional encerra o processo do Electron e limpa a memória RAM graciosamente (`app.quit()`), evitando o uso de `kill -9` no terminal.

### 5. Isolamento de Credenciais
A comunicação com a API do OpenWeatherMap não carrega chaves expostas no código-fonte do front-end. O ambiente injeta chaves de um cofre local não versionado (`config.json`), evitando vazamentos de cota por bots de raspagem no GitHub.

## 🚀 Como Executar e Compilar

**Requisitos:** Node.js v18+ e Ubuntu (X11 ou Wayland).

**Execução em Ambiente de Desenvolvimento:**
```bash
npm install
npm start