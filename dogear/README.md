# Dogear

**Dogear** é um aplicativo para acompanhar suas leituras e descobrir o próximo livro. O nome vem de *dog-ear*, a "orelha" que se dobra no canto da página para marcar onde você parou, e é isso que o logo mostra: um livro com o canto dobrado.

Com o Dogear você pesquisa livros em um catálogo que já vem dentro do app (24 livros) e que é complementado com livros da **API do Google Books**, marca o que está lendo, o que já leu e o que quer ler, dá nota de 1 a 5 estrelas, vê o que leitores e críticos acharam e recebe recomendações baseadas no seu gosto.

> Projeto acadêmico feito em **Ionic + React** (JavaScript). A documentação completa está em [`docs/DOCUMENTACAO.md`](docs/DOCUMENTACAO.md).

## O que o app tem

- **Cadastro e login** com senha forte (mínimo de 6 caracteres, uma letra maiúscula e um número), olho para mostrar/ocultar a senha e aviso em tempo real de "senhas iguais / não iguais". Se o e-mail já estiver cadastrado, o app mostra o erro "Este e-mail já existe". Quando o cadastro dá certo, o app volta para o login com a mensagem "Cadastro realizado com sucesso! Agora faça login para entrar." (o e-mail já vem preenchido).
- **Início:** recomendações de livros (do catálogo e do Google Books, intercalados), novidades e resumo das suas leituras.
- **Explorar:** busca por título, autor ou gênero, que mostra resultados enquanto você digita (sem diferenciar acentos). A lista começa vazia de propósito, para você pesquisar. A busca é feita sobre os livros que já estão no app, inclusive os que vieram do Google Books.
- **Detalhe do livro:** sinopse, nota média dos leitores, nota média da crítica (quando houver), resenhas e a sua própria nota.
- **Favoritos** e status de leitura (*Quero ler*, *Lendo*, *Lido*).
- **Perfil:** idade, gêneros favoritos, orientação sexual (opcional), troca de e-mail e de senha e sair da conta.
- **Acessibilidade:** tamanho e tipo de letra, tema claro/escuro/automático e cor do app. As escolhas ficam salvas no aparelho.
- **Splash** de abertura com o logo.

## Como as recomendações funcionam

O app sugere livros dos **gêneros que você escolheu no perfil** e dos gêneros dos livros que você avaliou com **4 ou 5 estrelas**, escondendo os que você já leu e ordenando pela média dos leitores. Livros do catálogo e do Google Books aparecem intercalados, e a seção "Novidades no Dogear" mostra mais livros vindos do Google Books. A orientação sexual, que é opcional, **não entra** no cálculo.

## Como rodar

Você só precisa do [Node.js](https://nodejs.org) (versão LTS). O Ionic já vem nas dependências do projeto, não precisa instalar o Ionic CLI.

    npm install
    npm run dev

Abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

**Conta de teste** (já com algumas leituras): `demo@dogear.com` / `123456`

## Tecnologias

JavaScript (ES6+ com JSX) · React 18 · Ionic React 8 · React Router 5 · Vite 5 · Ionicons · Web Crypto API (SHA-256) · localStorage · **Google Books API** (`fetch`)

## Organização das pastas

    src/
      pages/        telas (Login, Cadastro, Início, Explorar, Favoritos, Detalhe, Perfil)
      components/   peças visuais reutilizáveis (BookItem, StarRating, Splash...)
      hooks/        toda a lógica do app (login, livros, busca, acessibilidade, senha)
      data/         catálogo com 24 livros, críticas e avaliações (dados fictícios)
      theme/        cores e estilos
      App.jsx       rotas e abas
      main.jsx      ponto de entrada

## Observações

- Os 24 livros do catálogo, as críticas e as avaliações dos leitores são **fictícios**, criados para demonstração (`src/data/catalog.js`). Os livros do Google Books são reais, mas não têm críticas, e o app mostra a nota deles só quando a API a fornece.
- Não existe servidor: contas, notas e preferências ficam salvas **no próprio aparelho** (localStorage). Por isso, cada navegador ou aparelho tem seus próprios dados.
- **Google Books:** `src/hooks/useBookSearch.js` consulta a API (sem chave) por gênero, e `src/hooks/useGoogleBooks.js` guarda o resultado no aparelho por 24 h. Os livros aparecem como parte do app, sem tela de "buscar na internet". Se a API estiver fora do ar ou sem internet, o app continua funcionando só com o catálogo e com o que já foi carregado. Na tela de detalhe desses livros aparece o crédito "Google Books".
- Para gerar um APK Android, use o Capacitor com o Android Studio.
