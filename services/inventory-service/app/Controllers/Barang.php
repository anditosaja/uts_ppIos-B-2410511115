<?php

namespace App\Controllers;

use App\Models\BarangModel;
use CodeIgniter\RESTful\ResourceController;

class Barang extends ResourceController
{
    protected $modelName = 'App\Models\BarangModel';
    protected $format    = 'json';

    // GET 
    public function index()
    {
        $page = $this->request->getGet('page') ?? 1;
        $limit = $this->request->getGet('per_page') ?? 5;

        $data = $this->model->paginate($limit);

        return $this->respond([
            'data' => $data,
            'pager' => $this->model->pager->getDetails()
        ]);
    }

    // GET by id
    public function show($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound("Data tidak ditemukan");
        }

        return $this->respond($data);
    }

    // POST 
    public function create()
    {
        $data = $this->request->getJSON(true);

        $rules = [
            'nama' => 'required',
            'stok' => 'required|integer',
            'harga' => 'required|numeric'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $this->model->insert($data);

        return $this->respondCreated([
            'message' => 'Barang berhasil ditambahkan'
        ]);
    }

    // PUT by id
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->find($id)) {
            return $this->failNotFound("Data tidak ditemukan");
        }

        $rules = [
            'nama' => 'required',
            'stok' => 'required|integer',
            'harga' => 'required|numeric'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $this->model->update($id, $data);

        return $this->respond([
            'message' => 'Barang berhasil diupdate'
        ]);
    }

    // DELETE by id
    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound("Data tidak ditemukan");
        }

        $this->model->delete($id);

        return $this->respondDeleted([
            'message' => 'Barang berhasil dihapus'
        ]);
    }
}