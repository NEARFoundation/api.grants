# api.grants

> Easy to set up end to end grant application form for DAOs on NEAR Protocol

## Repositories

- [ui.grants](https://github.com/NEARWEEK/ui.grants)
- [api.grants](https://github.com/NEARWEEK/api.grants)

## Technology stack

- Blockchain: **[NEAR](https://near.org/)**
- Smart Contracts: **[Sputnik DAO Factory V2](https://github.com/near-daos/sputnik-dao-contract/tree/main/sputnikdao-factory2), [Sputnik DAO V2](https://github.com/near-daos/sputnik-dao-contract/tree/main/sputnikdao2)**
- Package manager: **[NPM](https://www.npmjs.com/)**
- Application framework: **[ExpressJS](https://expressjs.com/)**
- Code quality: **[Eslint](https://eslint.org/), [Prettier](https://prettier.io/)**
- Database: **[MongoDB](https://www.mongodb.com/)**
- Docx Templating: **[docx-templates](https://github.com/guigrpa/docx-templates)**
- Contract Signature: **[hellosign](https://github.com/HelloFax/hellosign-nodejs-sdk)**
- KYC: **[KYC DAO](https://github.com/kycdao)**
- Invoicing: **[Node microinvoice](https://github.com/baptistejamin/node-microinvoice)**
- Scheduling: **[Calendly](https://developer.calendly.com/)**

## Guides

### Configuration

```bash
cp .env.dist .env
# 1. set up variables on .env
# 2. update the template in templates/agreement.docx
# 3. replace the logo in `assets`
```

### Special routes for admin

> These special routes should be moved to the admin panel with a better security. Also in the meanwhile it's recommended to change the ADMIN_TOKEN in a regular basis

#### Invoice downloading

> Use this route to download the invoice

- Route: `/admin/:adminToken/accounts/:nearId/grants/:id/invoices/:invoiceId`
  - `adminToken`: ADMIN_TOKEN from the env variable to authorize the request
  - `nearId`: The near account id of the grant user
  - `id`: The grant id that can be found in the database
  - `invoiceId`: The invoice id (0 for the first payment, 1 for milestone 1, ...)
- Example: `/admin/TdgB349TfjpUnOqQMIIMOQoPf2kU/accounts/sound.testnet/grants/6/invoices/0`

#### Agreement signature

> This route has been created as a workaround because it seems like the hellosign API doesn't allow to have one signer using the embedded widget and the other using the hello sign website; more info here: https://github.com/NEARWEEK/api.grants/issues/22#issuecomment-1180164237

- Route: `/admin/:adminToken/accounts/:nearId/grants/:id/agreement/signature`
  - `adminToken`: ADMIN_TOKEN from the env variable to authorize the request
  - `nearId`: The near account id of the grant user
  - `id`: The grant id that can be found in the database
- Example: `/admin/TdgB349TfjpUnOqQMIIMOQoPf2kU/accounts/sound.testnet/grants/6/agreement/signature`

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
