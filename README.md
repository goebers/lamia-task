# Lamia "Map places" frontend task

## Prerequisites

Have following installed on your machine with your favorite package manager to start developing
*[PHP](https://www.php.net/)
* [Composer](https://getcomposer.org/)
* [Node.js](https://nodejs.org/)
* [NPM](https://www.npmjs.com/)
* [Laravel](https://laravel.com/)

Ability to host one of these databases locally 
* [SQLite](https://www.sqlite.org/index.html)
* [MySQL](https://www.mysql.com/)
* [PostgreSQL](https://www.postgresql.org/)

## Developed & tested with following versions

* PHP 7.4.2
* NPM 6.13.4
* Node.js 12.16.1
* Composer 1.9.3
* Laravel 6.16.0
* MySQL 8.0.19

## Installation

Clone the repository to a directory of your choosing
```bash
git clone https://github.com/goebers/lamia-task.git
```
Go inside project root
```bash
cd lamia-task
```

Run 
```bash
npm install
```
and
```bash
composer install
```

Rename the ```.env.example``` file to ```.env```

Make changes accordingly to the following variables 

```env
DB_CONNECTION=<sqlite/mysql/pgsql>
DB_HOST=<DATABASE IP>
DB_PORT=<DATABASE PORT>
DB_DATABASE=<DATABASE NAME>
DB_USERNAME=<DATABASE USERNAME>
DB_PASSWORD=<DATABASE PASSWORD>

GMAPS_KEY=<GOOGLE MAPS API KEY>
```

After modifying ```.env``` make sure your database of choosing is running and you have created a database for the project.

Next up run the database migrations & seeding
```laravel
php artisan migrate
```
and
```laravel
php artisan db:seed
```

Now that database has content in it its time to run
```npm 
npm run prod
```
or
```npm 
npm run watch
```
the ```npm run watch``` continues to run on the terminal window and builds the scss & js files to ``` public/``` folder on save while ```npm run prod``` builds only once

If you choose to run ```npm run watch``` start new terminal window in the project root and run

```larvel
php artisan serve
```

Congrats! Now you have this project running on your local machine!

### Created by [Robert Laitila](https://github.com/goebers)