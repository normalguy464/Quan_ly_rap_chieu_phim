import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, 'public', 'users_with_full_info.json');

// Đọc dữ liệu từ file JSON
const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
};

// Ghi dữ liệu vào file JSON
const writeUsersToFile = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export const addUser = (req, res) => {
  console.log('Received POST request:', req.body);
  const users = readUsersFromFile();
  const newUser = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(newUser);
  writeUsersToFile(users);
  res.status(200).send({ message: 'Thêm nhân viên thành công', user: newUser });
};

export const updateUser = (req, res) => {
  const users = readUsersFromFile();
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    writeUsersToFile(users);
    res.status(200).send({ message: 'Cập nhật nhân viên thành công', user: users[userIndex] });
  } else {
    res.status(404).send({ message: 'Không tìm thấy nhân viên' });
  }
};

export const deleteUser = (req, res) => {
  const users = readUsersFromFile();
  const userId = parseInt(req.params.id, 10);
  const newUsers = users.filter((user) => user.id !== userId);

  if (newUsers.length !== users.length) {
    writeUsersToFile(newUsers);
    res.status(200).send({ message: 'Xóa nhân viên thành công' });
  } else {
    res.status(404).send({ message: 'Không tìm thấy nhân viên' });
  }
};