# Sistem Inventaris Toko/Gudang
Sistem API Gateway berbasis Node.js (Express) yang menghubungkan beberapa layanan microservices:
1. Auth Service (Node.js) = Authentication (JWT + OAuth GitHub)
2. Inventory Service (PHP - CodeIgniter4) = Manajemen Barang & Stok
3. API Gateaway (Node.js) = Routing
4. Loging Service = Monitoring aktivitas

Semua request dari client hanya melalui API Gateway.
Link Youtube: https://youtu.be/P6MhTWBVqps?si=ANvir5VeWNx38MQL

## Arsitektur sistem
Client tidak langsung mengakses servis:
`Client -> Gateaway -> Auth/Inventory Servis`
### gateaway juga mencatat aktivitas ke logging servis

## Teknologi yang digunakan
1. Node.js
2. Express.js
3. JSON Web Token (JWT)
4. PHP (CodeIgniter 4)
5. MySQL (Inventory Database)
6. Git & GitHub
7. Postman

## Instalasi
1. Untuk Node.js buka terminal dan masuk ke folder projek lalu instal:
``` bash
npm install express jsonwebtoken bcrypt dotenv cors axios express-session http-proxy-middleware mysql2
```
2. Untuk PHP CodeIgniter4;
   ``` bash
   composer install
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

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| POST | /auth/register | registrasi user |
| POST | /auth/login | Login JWT |
| POST | /auth/refresh | refresh token |
| POST | /auth/logout | Logout |
| GET | /auth/github | Login OAuth |
| GET | /auth/github/callback | Callback oAuth |


2. Inventory Service (/inventory)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| GET | /inventory/barang | Ambil semua barang |
| GET | /inventory/barang/{ID} | Ambil 1 barang |
| POST | /inventory/barang | Tambah barang |
| PUT | /inventory/barang/{ID} | Update barang |
| DELETE | /inventory/barang{ID) | Hapus barang |

3. Log Service (/logs)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| GET | /logs | Ambil semua log |

## JWT Authentication
1. Access Token (15 menit)
2. Refresh Token (7 hari)
3. Token dikirim melalui header:
   ``` bash
   Authorization: Bearer <token>
   ```
