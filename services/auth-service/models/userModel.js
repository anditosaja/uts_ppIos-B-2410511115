// Inisialisasi array users 
let users = []; 

//Fungsi mencari user berdasarkan email
const findUserByEmail = (email) => {
    return users.find(u => u.email === email);
};

// Fungsi membuat user baru
const createUser = (userData) => {
    const newUser = {
        id: users.length + 1,
        ...userData
    };
    users.push(newUser);
    return newUser;
};

// Export fungsi agar bisa dipakai di controller
module.exports = {
    findUserByEmail,
    createUser
};