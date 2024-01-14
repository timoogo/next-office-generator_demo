# Steps

install the lib

```bash
npm i next-office-generator
```



Renommee le fichier .env.example en .env et remplissez les champs
```bash
npx prisma migrate dev --name init
```
```bash
npx prisma generate
```