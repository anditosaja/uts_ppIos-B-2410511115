<?php

namespace App\Controllers;

use App\Models\BarangModel;
use CodeIgniter\RESTful\ResourceController;

class Barang extends ResourceController
{
    protected $modelName = 'App\Models\BarangModel';
    protected $format    = 'json';

    //get
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

    //get by id
    public function show($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound("Data tidak ditemukan");
        }

        return $this->respond($data);
    }

    //post
    public function create()
    {
        $data = $this->request->getJSON(true);

        $rules = [
            'nama_barang' => 'required',
            'stok'        => 'required|integer',
            'harga'       => 'required|numeric',
            'id_kategori' => 'required|integer',
            'id_supplier' => 'required|integer'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $this->model->insert($data);

        return $this->respondCreated([
            'message' => 'Barang berhasil ditambahkan'
        ]);
    }

    //put
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->find($id)) {
            return $this->failNotFound("Data tidak ditemukan");
        }

        $rules = [
            'nama_barang' => 'required',
            'stok'        => 'required|integer',
            'harga'       => 'required|numeric',
            'id_kategori' => 'required|integer',
            'id_supplier' => 'required|integer'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $this->model->update($id, $data);

        return $this->respond([
            'message' => 'Barang berhasil diupdate'
        ]);
    }

    //delete
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