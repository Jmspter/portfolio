---
postId: piaf
title: PIAF
description: API REST do PIAF – Programa Institucional de Atividade Física (COESPE/UFRN). Gerencia usuários (alunos, instrutores e administradores), turmas, matrículas com fila de espera, presenças, renovações e relatórios, com autenticação JWT e e-mails transacionais.
stack: ["Ruby", "Rails 8 (API)", "PostgreSQL", "Devise + JWT", "Pundit", "Pagy"]
cover: piaf-03
coverAlt: Capa do projeto PIAF
gallery: [piaf-01, piaf-02, piaf-03]
---

## Problema

O COESPE/UFRN oferece atividades físicas à comunidade, mas a gestão era manual: matrículas por formulário e e-mail, listas de presença em papel e controle de renovações sujeito a erros. Com fila de espera e muitos alunos, escalar sem um sistema era inviável.

## Solução

Desenvolvi a API REST do PIAF com Ruby 4.0.6 e Rails 8.1.3 (API), separando de forma clara os papéis de aluno, instrutor e administrador. A autenticação usa JWT com revogação via denylist (Devise 5 + devise-jwt), a autorização por papel é feita com Pundit e a serialização com Blueprinter. Matrículas respeitam a fila de espera, presenças geram relatórios paginados com Pagy 9, e e-mails transacionais disparam em segundo plano com Delayed Job e agendamento via Whenever. Auditoria com paper_trail, rate limiting com Rack::Attack e CORS com rack-cors.

## O que aprendi

Aprendi a projetar uma API com papéis bem definidos desde a modelagem e o valor de escolher a ferramenta certa para cada preocupação: JWT para sessão, Pundit para autorização e jobs assíncronos para e-mail. A fila de espera de matrículas foi um bom exercício de transações e consistência em cenário concorrente.