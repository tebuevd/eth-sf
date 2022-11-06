# Video Demo
https://www.loom.com/share/24154ab396aa430b881290233a6a82ad
```
cd packages/web-app
cp .env-example .env
// add
DATABASE_URL=file:"postgresql://ethsf:ethsf@localhost:54320/main?schema=public"
```

at project root run `docker-compose up`

start server

```
cd packages/web-app
pnpm dev
```
