#!/bin/bash
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
NOCOLOR="\033[0m"

# Variables à modifier
PROJECT_FOLDER="C:\Users\...\next-office-generator_demo" # chemin absolu vers la racine du projet
DB_DRIVER="mysql" # seulement mysql pris en charge pour le moment
DB_USER="Username" # Utilisateur pour la BDD utilisée
DB_PASSWORD="Password" # Mot de passe pour la BDD utilisée
DB_HOST="localhost" # Host de utilisée par la BDD
DB_PORT="3306" # Port utilisée par la BDD
DB_NAME="Database name" # Nom donné lors de la création de la BDD (Création d'une nouvelle base de données)

# Variables statiques
PROJECT_FOLDER_NODE_MODULES="$PROJECT_FOLDER/node_modules"
PROJECT_FOLDER_ENV="$PROJECT_FOLDER/.env"
PROJECT_FOLDER_SCHEMA_PRISMA="$PROJECT_FOLDER/prisma"

# Fonction utilitaire
function print_message() {
    case $1 in
        success) echo -e "${GREEN}$2${NOCOLOR}" ;;
        warning) echo -e "${YELLOW}$2${NOCOLOR}" ;;
        error) echo -e "${RED}$2${NOCOLOR}"; exit 1 ;;
    esac
}

# ETAPE 1 - npm install next-office-generator
function npm_install() {
    cd $PROJECT_FOLDER || { echo -e "${RED}Erreur: Chemin du projet invalide !${NOCOLOR}"; exit 1; }
    if [ -d "$PROJECT_FOLDER_NODE_MODULES" ]; then
        print_message warning "Le dossier node_modules existe déjà !"
    else
        npm i next-office-generator
        [ $? -eq 0 ] && print_message success "npm install effectué avec succès !" || print_message error "Erreur lors de l'exécution de npm install !"
    fi
}

# ETAPE 2 - Configuration .env avec gestion conditionnelle du mot de passe
function setup_env_file() {
    if [ -f "$PROJECT_FOLDER_ENV" ]; then
        print_message warning "Le fichier .env existe déjà !"
    else
        DB_CONNECTION_URL="${DB_DRIVER}://${DB_USER}${DB_PASSWORD:+":$DB_PASSWORD"}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
        cat > "$PROJECT_FOLDER_ENV" <<EOF
        DATABASE_URL="$DB_CONNECTION_URL"
        NEXT_PUBLIC_URL=http://localhost:3000/
        NEXT_PUBLIC_FRONTEND_HOST=http://localhost
        NEXT_PUBLIC_FRONTEND_PORT=3000
EOF
        print_message success ".env créé avec succès !"
    fi
}

# ETAPE 3 - Modification schema.prisma
function update_prisma_schema() {
    sed -i -e "s/postgresql/$DB_DRIVER/g" "$PROJECT_FOLDER_SCHEMA_PRISMA/schema.prisma"
    print_message success "Modification du fichier schema.prisma effectuée avec succès !"
}

# ETAPE 4 - Prisma generate et setup
function prisma_generate_and_setup() {
    npx prisma generate && npx next-office-generator setup-next-office-generator
    print_message success "Prisma et next-office-generator configurés avec succès !"
}



# ETAPE 5 - Création de la base de données (mysql)

function create_database() {
  if [ "$DB_DRIVER" = "mysql" ]; then
    mysql --user=$DB_USER --password=$DB_PASSWORD -e "create database $DB_NAME";
    if [ "$?" -eq 0 ]; 
    then
        echo -e "${GREEN}Réussite: La base de données $DB_NAME à été créé sur $DB_HOST !${NOCOLOR}"
    else 
        echo -e "${RED}Erreur: Il y a eu une erreur lors de la création de la base de données $DB_NAME avec $DB_HOST !${NOCOLOR}"
        echo "Etape Suivante"
    fi
  else
    # psql --username=postgres --password=
    echo -e "${RED}Erreur: le paramètre $DB_DRIVER n'est pas reconnu !${NOCOLOR}"
    echo -e "${RED}Les options valide pour le driver sont: "mysql", "postgresql" ${NOCOLOR}"
    exit
  fi
}

# ETAPE 6 - prisma migrate dev init
function prisma_dev_init() {
    npx prisma migrate dev --name init
    npx prisma format
}

npm_install
setup_env_file
update_prisma_schema
prisma_generate_and_setup
create_database
prisma_dev_init

# ETAPE 7 - npm run dev
npm run dev