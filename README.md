## Sistem Inventaris Toko/Gudang
Sistem API Gateway berbasis Node.js (Express) yang menghubungkan beberapa layanan microservices:
1. Auth Service (Node.js) = Authentication (JWT + OAuth GitHub)
2. Inventory Service (PHP) = Manajemen Barang & Stok
3. Log/Supplier Service (Node.js) = Logging & Supplier

Semua request dari client hanya melalui API Gateway.
