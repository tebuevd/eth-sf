```
pnpm install
```

```
cd packages/web-app
cp .env-example .env
// add
DATABASE_URL=file:"postgresql://ethsf:ethsf@localhost:54320/main?schema=public"
```

start server
```
cd packages/web-app
pnpm dev
```
