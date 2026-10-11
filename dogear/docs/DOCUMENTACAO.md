# Documentação do Dogear

## 1. Visão geral

O **Dogear** é um aplicativo móvel de acompanhamento de leituras. O usuário se cadastra, pesquisa livros em um catálogo interno complementado pela API do Google Books, registra o status de leitura, avalia com estrelas, lê as opiniões de leitores e críticos e recebe recomendações personalizadas.

**Problema que resolve:** leitores costumam anotar o que leram em lugares diferentes e têm dificuldade para decidir o próximo livro. O Dogear reúne histórico, avaliação e recomendação em um só lugar.

**Nome e identidade:** *dog-ear* é a dobra no canto da página usada para marcar a leitura. O logo é um livro com o canto dobrado.

**Idioma da interface:** português do Brasil.

## 2. Tecnologias e linguagem

| Item | Tecnologia | Para que serve |
|---|---|---|
| Linguagem | JavaScript (ES6+) com JSX | Toda a lógica e as telas |
| Biblioteca de interface | React 18 | Componentes, estado e ciclo de vida |
| Framework de UI móvel | Ionic React 8 | Componentes com visual de app (abas, listas, modais, botões) |
| Rotas | React Router 5 + `@ionic/react-router` | Navegação entre as telas |
| Ícones | Ionicons e SVGs próprios | Ícones das abas e do perfil |
| Build e servidor de desenvolvimento | Vite 5 | Rodar e gerar o app |
| Segurança de senha | Web Crypto API (SHA-256 com *salt*) | Guardar a senha sem texto puro |
| API externa | Google Books API (`fetch`, sem chave) | Traz livros reais para as recomendações |
| Armazenamento | localStorage do navegador | Contas, notas, perfil, preferências e cópia dos livros do Google Books |
| Estilo | CSS com variáveis | Temas claro/escuro e cor do app |
| Ambiente | Node.js (LTS) e npm | Instalar dependências e executar |
| APK (opcional) | Capacitor + Android Studio | Empacotar para Android |

## 3. Funcionalidades

### 3.1 Conta
- Cadastro e login por e-mail e senha.
- Se o e-mail informado no cadastro já existir, o app mostra o erro "Este e-mail já existe. Use outro e-mail ou faça login.".
- Quando o cadastro é concluído, o app **não entra sozinho**: volta para a tela de login, com o e-mail já preenchido e a mensagem "Cadastro realizado com sucesso! Agora faça login para entrar.".
- Regras de senha: mínimo de 6 caracteres, uma letra maiúscula e um número, com lista de verificação em tempo real.
- Botão de olho para mostrar ou ocultar a senha em todos os campos de senha.
- Indicador ao vivo de "senhas iguais" ou "senhas não iguais" no campo de confirmação.
- Trocar e-mail e trocar senha (ambos exigem a senha atual).
- Sair da conta, com confirmação.
- Conta de teste: `demo@dogear.com` / `123456`.

### 3.2 Catálogo e busca
- 24 livros já dentro do app, cada um com título, autor, páginas, gênero, sinopse, críticas e avaliações de leitores (dados fictícios).
- Livros reais da **API do Google Books**, carregados em segundo plano por gênero e misturados ao catálogo. Eles têm título, autor, páginas, sinopse e, quando a API informa, a nota média; não têm críticas. Não existe uma tela de "pesquisar na internet": para o usuário, são livros do próprio app.
- Busca por título, autor ou gênero, com resultados enquanto o usuário digita e sem diferenciar maiúsculas, minúsculas ou acentos.
- A lista de Explorar começa vazia, com uma dica de pesquisa. Os filtros de status (*Lendo*, *Lidos*, *Quero ler*) mostram os livros do usuário sem precisar digitar.
- O usuário não cadastra livros. A busca acontece sobre os livros que já estão no app (catálogo + Google Books carregados).

### 3.3 Leitura e avaliação
- Status de leitura: *Quero ler*, *Lendo* e *Lido*.
- Nota de 1 a 5 estrelas dada pelo usuário.
- Favoritar livros.
- **Nota dos leitores:** média das avaliações dos leitores do catálogo, da nota média do Google Books (quando existe) e da nota do próprio usuário.
- **Nota da crítica:** média das notas dos críticos do catálogo, mostrada separadamente e só nos livros que têm críticas.
- Resenhas de críticos e comentários de leitores na tela do livro.

### 3.4 Recomendações
Mostram livros dos gêneros escolhidos no perfil e dos gêneros dos livros avaliados com 4 ou 5 estrelas, sem os já lidos, ordenados pela média dos leitores. Livros do catálogo e do Google Books aparecem intercalados. Na tela Início, a seção "Novidades no Dogear" mostra mais livros vindos do Google Books. A orientação sexual, campo opcional do perfil, **não é usada** no cálculo, por privacidade.

### 3.5 Perfil
- Idade, gêneros favoritos (seleção múltipla) e orientação sexual (opcional, com a opção "Prefiro não informar").
- Gerenciamento da conta (e-mail, senha e sair).

### 3.6 Acessibilidade
- Tamanho da letra: pequena, normal, grande e muito grande.
- Tipo de letra: padrão, alta legibilidade, serifada e arredondada.
- Tema: automático, claro ou escuro.
- Cor de destaque: seis opções.
- Texto de exemplo para ver o efeito na hora e botão "Restaurar padrão".
- A seção fica recolhida no perfil e abre ao tocar no título. As escolhas são salvas no aparelho.

## 4. Telas

| Tela | Rota | Função |
|---|---|---|
| Splash | (abertura) | Mostra o logo e o nome por alguns segundos antes do login |
| Login | `/login` | Entrar na conta |
| Cadastro | `/cadastro` | Criar conta com validação de senha |
| Início | `/app/inicio` | Recomendações, novidades e resumo das leituras |
| Explorar | `/app/biblioteca` | Busca no catálogo e filtros de status |
| Favoritos | `/app/favoritos` | Livros marcados como favoritos |
| Detalhe do livro | `/app/livro/:id` | Sinopse, notas, resenhas e avaliação do usuário |
| Perfil | `/app/perfil` | Dados pessoais, gêneros, conta e acessibilidade |

As quatro telas principais (Início, Explorar, Favoritos e Perfil) ficam em uma **barra de abas na parte de baixo**. Login, Cadastro e Splash ficam fora dela, e as telas internas só aparecem para quem está logado.

## 5. Princípios de design das telas

1. **Pensado para o celular (mobile-first).** A navegação fica na barra inferior, ao alcance do polegar, e os elementos tocáveis têm tamanho confortável.
2. **Consistência.** Todas as telas usam os mesmos componentes Ionic, o mesmo estilo de cartões e os mesmos ícones de linha, o que reduz o esforço de aprender o app.
3. **Hierarquia visual clara.** Título da tela, conteúdo principal e ações secundárias têm pesos diferentes. As notas usam estrelas, e leitores e crítica aparecem separados para não se misturarem.
4. **Feedback imediato.** A busca responde enquanto se digita, e a senha mostra na hora quais regras já foram cumpridas e se as duas senhas coincidem.
5. **Prevenção de erros.** Ações importantes pedem confirmação (sair da conta) ou a senha atual (trocar e-mail e senha).
6. **Estados vazios que orientam.** Quando não há resultado, a tela explica o que fazer (por exemplo, a dica de pesquisa em Explorar).
7. **Acessibilidade.** O usuário controla tamanho e tipo de letra, tema e cor, e tudo é salvo.
8. **Privacidade por padrão.** Dados sensíveis são opcionais e não alimentam as recomendações.
9. **Identidade visual simples.** Poucas cores, ícones de linha no lugar de emojis e o logo do livro com a página dobrada.

## 6. Arquitetura

```
src/
  pages/        telas
  components/   componentes visuais reutilizáveis
  hooks/        lógica do app
  data/         catálogo (dados fictícios)
  theme/        variáveis de cor e estilos
  App.jsx       rotas, abas e provedores
  main.jsx      ponto de entrada
```

A pasta `hooks/` concentra toda a lógica, separada do visual:

| Arquivo | Responsabilidade |
|---|---|
| `useAuth.jsx` | Cadastro, login, sair, trocar e-mail e senha |
| `useLibrary.jsx` | Status de leitura, favoritos, notas, médias e recomendações |
| `useBookSearch.js` | Busca local nos livros do app e consulta à API do Google Books |
| `useGoogleBooks.js` | Carrega os livros do Google Books em segundo plano e guarda no aparelho por 24 h |
| `useA11y.jsx` | Preferências de acessibilidade |
| `usePassword.js` | Regras de senha |
| `useLocalStorage.js` | Salvar e ler dados do aparelho |
| `crypto.js` | *Hash* SHA-256 com *salt* |

O estado compartilhado usa a Context API do React (`AuthProvider`, `BooksProvider`, `A11yProvider`), e as telas consomem esses dados por hooks (`useAuth`, `useLibrary`, `useA11y`).

## 7. Armazenamento e segurança

- Os dados ficam no **localStorage** do navegador ou do aparelho, separados por usuário. Não há servidor nem banco de dados próprio.
- Os livros do Google Books ficam guardados em `dogear:google-books` e são renovados a cada 24 horas. Livros já carregados não são removidos, para não perder notas e favoritos.
- A única comunicação com a internet é a consulta pública à Google Books API, sem chave e sem enviar dados do usuário. Se ela falhar, o app segue funcionando com o catálogo e com o que já foi carregado.
- As senhas não são guardadas em texto puro: usa-se SHA-256 com *salt* aleatório.
- A Web Crypto API exige conexão segura (HTTPS ou `localhost`).
- Essa proteção é adequada para um projeto acadêmico e **não substitui** a autenticação de um servidor real.

## 8. Limitações e próximos passos

- Os 24 livros do catálogo, as críticas e as avaliações são **fictícios**, feitos para demonstração. Os livros do Google Books são reais, mas sem críticas.
- Como não há servidor, os dados não são compartilhados entre aparelhos e as avaliações de "outros leitores" não vêm de usuários reais.
- A API sem chave tem limite de uso compartilhado. Para uso real, o ideal é criar uma chave no Google Cloud.
- A busca encontra os livros já carregados, não todo o acervo do Google.
- Evoluções possíveis: servidor e banco de dados para contas e avaliações reais, outras fontes de avaliações e publicação do app Android via Capacitor.

## 9. Como executar

1. Instalar o Node.js (LTS).
2. Na pasta do projeto: `npm install`.
3. `npm run dev` e abrir o endereço mostrado (geralmente `http://localhost:5173`).

Para gerar a versão final: `npm run build`.
