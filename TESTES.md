# Testes Automatizados

Documento de referência para os testes implementados no frontend (`ufscompras-frontend`) e backend (`Gestao`). Cada caso descreve o que é validado, o status obtido na última execução e o motivo de existir, garantindo rastreabilidade.

---

## Frontend (Vite + React + Vitest)

### Resultado da última execução

Fonte: `output_tests_frontend.txt`

| Suite (arquivo) | Cenário validado | Status | Justificativa |
| --- | --- | --- | --- |
| `src/components/__tests__/AdminRoute.test.tsx` | Redireciona anônimos para `/admin/login` | ✅ | Garante que o guard de rotas impeça acesso administrativo sem autenticação. |
| | Bloqueia usuários autenticados sem privilégio admin | ✅ | Evita exposição de telas sensíveis a perfis errados. |
| | Permite admins verem o dashboard | ✅ | Confirma que o guard não bloqueia indevidamente perfis válidos. |
| `src/services/__tests__/api.test.ts` | Cacheia/mapeia categorias com fallback de imagem | ✅ | As listas da home/catálogo dependem desse cache; evita requisições repetidas. |
| | Envia ID correto ao filtrar produtos por slug | ✅ | Sem esse mapeamento o backend receberia filtros incorretos. |
| | Aplica filtros locais (cor/tamanho) e ordenação de preço | ✅ | O UI mostra filtros client-side; garante consistência da ordenação. |
| | Normaliza `getProductById` | ✅ | As páginas de detalhe dependem do shape padronizado. |
| | Retorna `undefined` para IDs vazios | ✅ | Evita requisições inválidas e erros de runtime. |
| | Mapeia acessórios para o formato de UI | ✅ | Necessário para a experiência de upsell na página do produto. |
| `src/components/__tests__/QuantityInput.test.tsx` | Desabilita decremento no mínimo e incrementa corretamente | ✅ | Impede quantidades negativas no fluxo de compra. |
| | Impede exceder o máximo configurado | ✅ | Evita ordens acima do limite suportado pelo backend. |
| `src/components/__tests__/Header.test.tsx` | Renderiza ações de login/cadastro para anônimos | ✅ | UX básica para visitantes. |
| | Mostra atalhos/admin/logout para autenticados | ✅ | Confirma que o estado global de auth está refletido no header. |
| `src/pages/__tests__/HomePage.test.tsx` | Renderiza herói, categorias e destaques | ✅ | Garante que a landing page funciona quando API responde. |
| | Exibe mensagem de erro se `/products/featured` falha | ✅ | Feedback amigável em caso de indisponibilidade de destaque. |
| `src/pages/__tests__/ProductCatalogPage.test.tsx` | Sincroniza filtros (busca/categoria/ordem) na URL | ✅ | Mantém compartilhabilidade de filtros e navegação consistente. |
| | Exibe estado de erro quando `/products` falha | ✅ | Evita UI silenciosa em falhas críticas. |
| `src/pages/__tests__/LoginPage.test.tsx` | Redireciona usuários já autenticados para a home | ✅ | Evita re-login desnecessário e loops. |
| | Respeita parâmetro `from` após login | ✅ | Mantém fluxo pós-login (ex.: checkout interrompido). |
| | Mostra mensagem de credencial inválida do backend | ✅ | Ajuda o usuário a entender falhas de autenticação reais. |
| `src/services/__tests__/orders.test.ts` | Confirma compra quando backend responde sucesso | ✅ | Certifica integração com `/purchase`. |
| | Propaga mensagens de erro do backend | ✅ | Evita ocultar falhas relevantes na conclusão da compra. |
| `src/services/__tests__/auth.test.ts` | Retorna token/usuário no login | ✅ | Base para o contexto de autenticação. |
| | Lança erro com mensagem retornada pelo backend | ✅ | Exibe ao usuário o motivo real da falha de login. |
| `src/pages/__tests__/ProductPage.test.tsx` | Seleção de acessórios atualiza total e confirma compra autenticada | ❌ | Falhou (`Unable to find a label with the text of: Bucket Hat`). Precisa aguardar o carregamento da lista antes de interagir. |
| | Redireciona não-autenticados para `/login?from=…` | ❌ | Falhou (URL final não continha o `from`). É necessário simular corretamente `window.location`/navegação. |

> **Observação:** Todos os demais testes do frontend passaram; somente os dois cenários da página de produto precisam de correção nos waits/mocks.

---

## Backend (Gestao + Vitest + Supertest)

### Resultado da última execução

Comando: `cd "…/Gestao" && npm test`

```
✓ tests/unit/loginController.test.js (2)
✓ tests/unit/authMiddleware.test.js (5)
✓ tests/integration/categoryRoutes.test.js (3)
Test Files: 3 passed • Tests: 10 passed • Duration: 1.30s
```

### Detalhamento por suíte

| Suite (arquivo) | Cenário validado | Status | Justificativa |
| --- | --- | --- | --- |
| `tests/unit/loginController.test.js` | Gera token e payload quando credenciais são válidas | ✅ | Verifica o fluxo happy-path que abastece o frontend com `token` e `user`. |
| | Retorna 400 quando usuário não existe ou senha não confere | ✅ | Evita vazar se o email existe e mantém mensagem genérica conforme requisito de segurança. |
| `tests/unit/authMiddleware.test.js` | Responde 401 sem header Authorization | ✅ | Garante negação imediata sem token. |
| | Responde 401 para token inválido | ✅ | Evita acesso de tokens expirados/corrompidos. |
| | Anexa payload válido e segue fluxo (`next`) | ✅ | Confirma que rotas conseguem ler `req.user`. |
| | `requireAdmin` bloqueia não-admin (403) | ✅ | Evita escalada de privilégio em rotas protegidas. |
| | `requireAdmin` libera admins | ✅ | Garante que rotas administrativas são acessíveis para perfis corretos. |
| `tests/integration/categoryRoutes.test.js` | Lista categorias ordenadas (`GET /api/categories`) | ✅ | Confirma integração Controller/Router, garantindo consistência do catálogo público. |
| | Exige autenticação para `POST /api/categories` | ✅ | Protege criação de categorias de acessos não autenticados. |
| | Permite admins criarem categorias com normalização de payload | ✅ | Valida slugificação, split de subcategorias e requisitos da API administrativa. |

---

## Como reproduzir

- **Frontend:** `cd ufscompras-frontend && npm run test` (Vitest em modo watch). Para inspecionar o estado atual dos testes E2E, utilizar `npm run e2e` (requer Playwright).
- **Backend:** `cd Gestao && npm test` (Vitest modo run, sem dependência de MongoDB real graças aos mocks).

---

### Próximos passos sugeridos

1. Ajustar os waits/mocks da suíte `ProductPage.test.tsx` para aguardar o carregamento dos acessórios e simular corretamente o redirecionamento de usuários não autenticados.
2. (Opcional) Cobrir rotas adicionais do backend (produtos, compras) reutilizando a infraestrutura de Supertest agora disponível.


