# Quake Parser

## Solução

Como ferramentas utilizei o NodeJS com JavaScript vanilla e a biblioteca Express para fazer a API em si.

O maior desafio foi usar OOP com JavaScript, uma linguagem baseada em dicionários, faltam features básicas como métodos e atributos privados, a convenção usada na comunidade é usar o padrão `_variableName` para estes campos.

### Task 1

Essa task é resolvida com a implementação da classe GameLogParser. Esta classe lê o log, o separa em tokens, e itera pelos mesmo até achar os tokens "Killed:", "ClientUserinfoChanged:" e "InitGame:", e com isso monta o objeto "games", com informações de jogadores e kills.

Os resultados também são salvos no arquivo "games.json".

### Task 2

Essa task é resolvida com a implementação do método `GameAPI.printRanking()` a partir do objeto retornado por `GameLogParser.parse()`, que ranqueia os players pelo seu número de kills.

### Task 3

Essa task é resolvida com a implementação do método `GameAPI.startServer()`, uma simples função que usa a biblioteca Express para criar servidor.

## Usando o projeto

- É necessário o NodeJS para rodar esse projeto, usei a versão 15.10, porém qualquer versão mais nova deve funcionar.
- Instale as dependências utilizando o comando: de terminal:

```
npm install
```

- Inicie o script utilizando o comando:

```
npm run-script start
```

Com isso o programa irá ler o log, printar os ranks por jogo e iniciar o servidor.

## Requests

### Game by ID

Devolve a informação de um jogo a partir do seu ID.

- ### URL
  `/gameByID/:gameID`
- ### Parametros

  `gameID=[integer]`

- ### Respostas

  - **Código**: `200`
  - **Conteúdo**:

```
  {
  "game_1": {
    "total_kills": 11,
    "players": [
      "Isgalamido",
      "Mocinha"
    ],
    "kills": {
      "Isgalamido": -5,
      "Mocinha": 0
    }
  }
}
```

- **Código**: `404 NOT FOUND`
- **Conteúdo**: `ID provided does not represent a game.`

## Exemplo

### Request

- **URL:** `http://localhost:3000/gameByID/5`

### Response

```
{
  "game_5": {
    "total_kills": 29,
    "players": [
      "Oootsimo",
      "Isgalamido",
      "Zeh",
      "Dono da Bola",
      "Mal",
      "Assasinu Credi"
    ],
    "kills": {
      "Oootsimo": 8,
      "Isgalamido": 3,
      "Zeh": 7,
      "Dono da Bola": 2,
      "Mal": 0,
      "Assasinu Credi": 1
    }
  }
}
```
