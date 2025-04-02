import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genresFilePath = path.resolve(__dirname, '../../../public/genres_with_full_info.json');

const readGenresFromFile = () => {
  const data = fs.readFileSync(genresFilePath, 'utf8');
  return JSON.parse(data);
};

const writeGenresToFile = (data) => {
  fs.writeFileSync(genresFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export const addGenre = (req, res) => {
  console.log('Received POST request:', req.body);
  const genres = readGenresFromFile();
  const newGenre = {
    id: genres.length > 0 ? genres[genres.length - 1].id + 1 : 1,
    ...req.body,
  };
  genres.push(newGenre);
  writeGenresToFile(genres);
  res.status(200).send({ message: 'Thêm thể loại thành công', genre: newGenre });
};

export const updateGenre = (req, res) => {
  const genres = readGenresFromFile();
  const genreId = parseInt(req.params.id, 10);
  const genreIndex = genres.findIndex((genre) => genre.id === genreId);

  if (genreIndex !== -1) {
    genres[genreIndex] = { ...genres[genreIndex], ...req.body };
    writeGenresToFile(genres);
    res.status(200).send({ message: 'Cập nhật thể loại thành công', genre: genres[genreIndex] });
  } else {
    res.status(404).send({ message: 'Không tìm thấy thể loại' });
  }
};

export const deleteGenre = (req, res) => {
  const genres = readGenresFromFile();
  const genreId = parseInt(req.params.id, 10);
  const newGenres = genres.filter((genre) => genre.id !== genreId);

  if (newGenres.length !== genres.length) {
    writeGenresToFile(newGenres);
    res.status(200).send({ message: 'Xóa thể loại thành công' });
  } else {
    res.status(404).send({ message: 'Không tìm thấy thể loại' });
  }
};
