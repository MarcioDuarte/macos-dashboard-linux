#!/bin/bash

# 1. A Marreta Absoluta: Força a morte imediata (-9) de qualquer processo, GPU ou Renderer gerado pelo seu projeto
pkill -9 -f "/home/marcio/.electron/node_modules/electron/dist/electron"

# 2. O Respiro de Segurança
sleep 5

# 3. O Renascimento Limpo
/home/marcio/.electron/node_modules/.bin/electron /home/marcio/.electron --no-sandbox > /home/marcio/.electron/debug.log 2>&1 &