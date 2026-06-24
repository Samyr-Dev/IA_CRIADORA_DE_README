# Projeto Cinema

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/nestjs/nest/blob/master/LICENSE)

Este projeto consiste no desenvolvimento e teste do CRUD de um sistema de cinema, abrangendo os módulos de cinema, filme, salas, sessões, lanches, ingressos e pedidos.

## 🛠️ Tecnologias
* TypeScript
* Prisma

## 🚀 Execução do Projeto

Para iniciar o servidor de desenvolvimento:
bash
npm run start:dev


Para visualizar o banco de dados através do Prisma Studio:
bash
npx prisma studio --url file:./prisma/dev.db


## 🗺️ Ordem Correta dos Testes (Fluxo Lógico)

Para realizar os testes do CRUD sem erros de chave estrangeira (Foreign Key), siga rigorosamente esta sequência:

1.  **Cinema**: Crie um Cinema (módulo independente).
2.  **Filme e Sala**: Crie um Filme e uma Sala (também são independentes).
3.  **Sessão**: Crie a Sessão informando o `cinemaId`, `filmeId` e `salaId` gerados nos passos anteriores.
4.  **Lanches e Ingressos**: Crie os Lanches (independente) e os Ingressos (vinculados à Sessão).
5.  **Pedido**: Por último, crie o Pedido unindo o Ingresso e o Lanche.

## 👥 Autores
* Pedro Lucas
* Samyr Silva - [LinkedIn](https://www.linkedin.com/in/samyrtertuliano)

## 🔗 Repositório
[https://github.com/Samyr-Dev/POO3_P2-Projeto_Cinema](https://github.com/Samyr-Dev/POO3_P2-Projeto_Cinema)

## 📄 Licença
Este projeto está sob a licença descrita em: [NestJS License](https://github.com/nestjs/nest/blob/master/LICENSE)