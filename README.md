# XPTO Courses - Gerenciamento de Cursos (Node.js + React + PostgreSQL)

Solução do teste técnico da XPTO Tecnologia da Informação: CRUD de usuários, cursos, módulos e conteúdos, relatórios em SQL, controle de aulas assistidas, documentação com Swagger e collection do Postman.

## Executar com Docker

```bash
docker compose up --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:8080 |
| API | http://localhost:3001/api |
| Swagger UI | http://localhost:3001/api-docs |

O container da API executa as migrations e os seeds ao iniciar.

> Se alguma porta já estiver em uso no seu computador, altere o número à esquerda em `ports` no `docker-compose.yml` (por exemplo, `"8081:80"`).

Para parar: `Ctrl+C` e `docker compose down` (use `-v` para apagar também os dados do banco).

## Executar localmente (apps sem Docker)

```bash
docker compose up -d db
cd backend && cp .env.example .env && npm install && npm run setup && npm run dev
cd frontend && npm install && npm run dev      # http://localhost:5173 (proxy para /api)
```

Outros scripts do backend: `npm run migrate`, `npm run migrate:undo`, `npm run seed`.

## Tecnologias
Node.js, Express, Sequelize + sequelize-cli (migrations e seeders), PostgreSQL, React (Vite), Docker, Swagger UI (OpenAPI 3) e Postman.

## Modelo de dados
Veja o DER em [docs/DER.md](docs/DER.md).

- `users`, `courses`, `modules` e `contents` seguem o enunciado.
- `courses` e `modules` possuem `user_id` (chave estrangeira) para identificar qual usuário inseriu o registro.
- Tabela adicional `content_views`: registra qual usuário assistiu a qual conteúdo (relação muitos-para-muitos com a coluna `watched_at`, única por usuário/conteúdo). Foi escolhida uma tabela nova, e não colunas extras, porque um usuário pode assistir a várias aulas e uma aula pode ser assistida por vários usuários.

Todo o código, tabelas e banco estão em inglês, conforme o enunciado.

## Dados iniciais (seed)
5 usuários e 5 cursos:

| Curso | Módulos | Conteúdos por módulo |
|---|---|---|
| 1 - Node.js Fundamentals | 5 | 3 |
| 2 - React from Scratch | 3 | 5 |
| 3 - PostgreSQL Essentials | 2 | 4 |
| 4 - Docker for Developers | 1 | 2 |
| 5 - Git and GitHub | 1 | 2 |

Os cursos 4 e 5 foram adicionados para chegar a 5 registros por tabela. O conteúdo de ID 2 foi assistido por 3 usuários.

Observação: os cursos 1 e 2 empatam com 15 conteúdos, por isso o SQL 02 retorna os dois.

## Relatórios (SQL)
Todas as queries estão em [docs/reports.sql](docs/reports.sql) e são expostas pela API e pela tela **Reports** do frontend.

| Relatório | Endpoint |
|---|---|
| 01 - Usuários com mais cursos | `GET /api/reports/users-most-courses` |
| 02 - Curso com mais conteúdos | `GET /api/reports/course-most-contents` |
| 03 - Cursos com total de módulos e conteúdos (1 query) | `GET /api/reports/courses-totals` |
| 04 - Conteúdos com o nome do curso (1 query) | `GET /api/reports/contents-with-course` |
| 05 - Usuários que assistiram ao conteúdo ID=2 | `GET /api/reports/contents/2/watched-by` |

## API
Rotas REST: `/api/users`, `/api/courses`, `/api/modules` e `/api/contents` (`GET`, `POST`, e `GET`/`PUT`/`DELETE` em `/:id`). Também é possível filtrar por chave estrangeira, por exemplo `/api/modules?courseId=1`.

Aulas assistidas: `GET` e `POST` em `/api/contents/:id/views` (corpo do POST: `{ "userId": 1 }`).

Documentação:
- Swagger: `/api-docs`
- Especificação OpenAPI: [docs/openapi.json](docs/openapi.json)
- Collection do Postman: [docs/postman_collection.json](docs/postman_collection.json) (variável `baseUrl`, padrão `http://localhost:3001/api`)

Para regenerar os dois arquivos de documentação: `npm run docs:generate` dentro de `backend`.

## Deploy no Heroku
O `Procfile` executa as migrations no release. Exemplo para a API:

```bash
heroku create <nome-do-app>
heroku addons:create heroku-postgresql:essential-0
heroku config:set DB_SSL=true
git subtree push --prefix backend heroku main
heroku run "npx sequelize-cli db:seed:all"
```

O frontend pode ser publicado como um segundo app (build com `VITE_API_URL=https://<app-da-api>.herokuapp.com/api`, servindo a pasta `dist`) ou em qualquer hospedagem estática.
