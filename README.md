# Symfony Task Manager

Task Manager built with Symfony 6.4 & Tailwind CSS. Create, Toggle & Delete tasks.

## Requirements

* PHP 8.1+
* Composer
* Symfony CLI (optional)
* npm

## Installation

Clone the Repo
```bash
git clone https://github.com/gavbrown89/symfony-task-manager.git

cd /symfony-task-manager
```

Install Dependencies
``` bash
composer install
npm install
```

Configure Environment
``` bash
cp .env.example .env
```

Edit .env database
``` bash
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8&charset=utf8mb4"
```

Setup the database
``` bash
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

Start the Dev Server
``` bash
symfony server:start
npm run watch
```
