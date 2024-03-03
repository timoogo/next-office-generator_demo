# Étapes

### Installation automatique
Modifier les variables spécifiées à l'intérieur du fichier nog-setup-(version).sh.
Il est nécesssaire d'attribuer une valeur aux variables suivantes : 
- PROJECT_FOLDER (chemin absolu)
- DB_DRIVER
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT
- DB_NAME (La base de données doit ne pas exister car elle va être créée)

Seul MySQL est pris en compte pour le moment.
MySQL doit être dans vos variables d'environnement pour que ce script fonctionne.
Lancez ensuite la commande suivante dans un Git Bash :

```bash
sh nog-setup-v1.sh
```

À la fin du processus d'installation vous devriez trouver une table users à l'url suivante avec les paramètres par défault :

[http://localhost:3000/admin/users](http://localhost:3000/admin/users)

### Installation  manuelle

Installer la bibliothèque
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