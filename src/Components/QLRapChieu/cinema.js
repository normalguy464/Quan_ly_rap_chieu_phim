import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cinemasFilePath = path.join(__dirname, 'public', 'cinemas_with_full_info.json');

const readCinemasFromFile = () => {
  const data = fs.readFileSync(cinemasFilePath, 'utf8');
  return JSON.parse(data);
};

const writeCinemasToFile = (data) => {
  fs.writeFileSync(cinemasFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export const addCinema = (req, res) => {
  console.log('Received POST request:', req.body);
  const cinemas = readCinemasFromFile();
  const newCinema = {
    id: cinemas.length > 0 ? cinemas[cinemas.length - 1].id + 1 : 1,
    ...req.body,
  };
  cinemas.push(newCinema);
  writeCinemasToFile(cinemas);
  res.status(200).send({ message: 'Thêm rạp chiếu thành công', cinema: newCinema });
};

export const updateCinema = (req, res) => {
  const cinemas = readCinemasFromFile();
  const cinemaId = parseInt(req.params.id, 10);
  const cinemaIndex = cinemas.findIndex((cinema) => cinema.id === cinemaId);

  if (cinemaIndex !== -1) {
    cinemas[cinemaIndex] = { ...cinemas[cinemaIndex], ...req.body };
    writeCinemasToFile(cinemas);
    res.status(200).send({ message: 'Cập nhật rạp chiếu thành công', cinema: cinemas[cinemaIndex] });
  } else {
    res.status(404).send({ message: 'Không tìm thấy rạp chiếu' });
  }
};

export const deleteCinema = (req, res) => {
  const cinemas = readCinemasFromFile();
  const cinemaId = parseInt(req.params.id, 10);
  const newCinemas = cinemas.filter((cinema) => cinema.id !== cinemaId);

  if (newCinemas.length !== cinemas.length) {
    writeCinemasToFile(newCinemas);
    res.status(200).send({ message: 'Xóa rạp chiếu thành công' });
  } else {
    res.status(404).send({ message: 'Không tìm thấy rạp chiếu' });
  }
};