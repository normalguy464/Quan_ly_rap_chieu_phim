import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { addUser, updateUser, deleteUser } from './employee.js';
import { addCustomer, updateCustomer, deleteCustomer } from './src/Components/QLKhachHang/customer.js';
import { addCinema, updateCinema, deleteCinema } from './src/Components/QLRapChieu/cinema.js';
import { updatePromotion, deletePromotion, addPromotion } from './src/Components/QLKhuyenMai/promotion.js';

const app = express();
const port = 5001; 

app.use(cors());
app.use(bodyParser.json());

app.post('/api/addUser', addUser);
app.put('/api/updateUser/:id', updateUser);
app.delete('/api/deleteUser/:id', deleteUser);

app.post('/api/addCustomer', addCustomer);
app.put('/api/updateCustomer/:id', updateCustomer);
app.delete('/api/deleteCustomer/:id', deleteCustomer);

app.post('/api/addCinema', addCinema);
app.put('/api/updateCinema/:id', updateCinema);
app.delete('/api/deleteCinema/:id', deleteCinema);

app.post('/api/addPromotion', addPromotion);
app.put('/api/updatePromotion/:id', updatePromotion);
app.delete('/api/deletePromotion/:id', deletePromotion);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});