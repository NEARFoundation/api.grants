# api.fund3r

> Easy to set up end to end grant application form for DAOs on NEAR Protocol

## Repositories

- [ui.fund3r](https://github.com/NEAR-labs/ui.fund3r)
- [api.fund3r](https://github.com/NEAR-labs/api.fund3r)

## Technology stack

- Blockchain: **[NEAR](https://near.org/)**
- Smart Contracts: **[Sputnik DAO Factory V2](https://github.com/near-daos/sputnik-dao-contract/tree/main/sputnikdao-factory2), [Sputnik DAO V2](https://github.com/near-daos/sputnik-dao-contract/tree/main/sputnikdao2)**
- Package manager: **[NPM](https://www.npmjs.com/)**
- Application framework: **[ExpressJS](https://expressjs.com/)**
- Code quality: **[Eslint](https://eslint.org/), [Prettier](https://prettier.io/)**
- Database: **[MongoDB](https://www.mongodb.com/)**

## Guides

### Configuration

```bash
cp .env.dist .env
# set up variables on .env
```

### Installation

```bash
npm install
```

Set up .env

### Development

```bash
# run mongodb
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

```bash
npm install
npm start
```

### Testing

No tested are implemented yet.
