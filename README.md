# Sistem Inventaris Toko/Gudang
Sistem API Gateway berbasis Node.js (Express) yang menghubungkan beberapa layanan microservices:
1. Auth Service (Node.js) = Authentication (JWT + OAuth GitHub)
2. Inventory Service (PHP) = Manajemen Barang & Stok
3. Log/Supplier Service (Node.js) = Logging & Supplier

Semua request dari client hanya melalui API Gateway.

## Teknologi yang digunakan
1. Node.js
2. Express.js
3. JSON Web Token (JWT)
4. PHP (CodeIgniter 4)
5. MySQL 
6. Git & GitHub
7. Postman

## Instalasi
Buka terminal dan masuk ke folder projek lalu instal:
``` bash
npm install express jsonwebtoken bcrypt dotenv cors axios express-session http-proxy-middleware
```

## Konfigurasi dan Menjalankan Server
1. Auth Service
``` bash
cd services/auth-service
node index.js
```
berjalan di `http://localhost:3001`

2. Inventory Service 
``` bash
cd services/inventory-service
php spark serve
```
berjalan di `http://localhost:8080`

3. API Gateway
``` bash
cd gateway
node index.js
```
berjalan di `http://localhost:3000`

## ENDPOINT API
Testing dapat dilakukan di Postman
1. Auth Service (/auth)
|Method|	  Endpoint	      |     Deskripsi               |
|------|-------------------|-----------------------------|
|POST	  |/auth/register | registrasi user         |
|POST	  |/auth/login|	Login JWT|


3. Inventory Service (/inventory)
|Method|	  Endpoint	      |     Deskripsi               |
|------|-------------------|-----------------------------|
|GET	  |/inventory/barang | Ambil semua barang        |


## JWT Authentication
1. Access Token (15 menit)
2. Refresh Token (7 hari)
3. Token dikirim melalui header:
   ``` bash
   Authorization: Bearer <token>
   ```
