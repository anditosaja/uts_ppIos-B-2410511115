const name = userRes.data.name;
const avatar = userRes.data.avatar_url;

let user = findUserByEmail(email);

if (!user) {
  user = createUser({
    email,
    name,
    avatar,
    provider: "github",
    password: "oauth"
  });
}
const findUserByEmail = (email) => users.find(u => u.email === email);

const createUser = (user) => {
  user.id = users.length + 1;
  users.push(user);
  return user;
};

module.exports = {
  findUserByEmail,
  createUser
};