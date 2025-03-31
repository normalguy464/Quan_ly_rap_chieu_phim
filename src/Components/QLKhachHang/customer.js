import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customersFilePath = path.resolve(__dirname, '../../../public/customers_with_full_info.json');

const readCustomersFromFile = () => {
  const data = fs.readFileSync(customersFilePath, 'utf8');
  return JSON.parse(data);
};

const writeCustomersToFile = (data) => {
  fs.writeFileSync(customersFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export const addCustomer = (req, res) => {
  console.log('Received POST request:', req.body);
  const customers = readCustomersFromFile();
  const newCustomer = {
    id: customers.length + 1,
    ...req.body,
  };
  customers.push(newCustomer);
  writeCustomersToFile(customers);
  res.status(200).send({ message: 'Thêm khách hàng thành công', customer: newCustomer });
};

export const updateCustomer = (req, res) => {
  const customers = readCustomersFromFile();
  const customerId = parseInt(req.params.id, 10);
  const customerIndex = customers.findIndex((customer) => customer.id === customerId);

  if (customerIndex !== -1) {
    customers[customerIndex] = { ...customers[customerIndex], ...req.body };
    writeCustomersToFile(customers);
    res.status(200).send({ message: 'Cập nhật khách hàng thành công', customer: customers[customerIndex] });
  } else {
    res.status(404).send({ message: 'Không tìm thấy khách hàng' });
  }
};

export const deleteCustomer = (req, res) => {
  const customers = readCustomersFromFile();
  const customerId = parseInt(req.params.id, 10);
  const newCustomers = customers.filter((customer) => customer.id !== customerId);

  if (newCustomers.length !== customers.length) {
    writeCustomersToFile(newCustomers);
    res.status(200).send({ message: 'Xóa khách hàng thành công' });
  } else {
    res.status(404).send({ message: 'Không tìm thấy khách hàng' });
  }
};