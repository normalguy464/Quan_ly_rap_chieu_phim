import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const showtimesFilePath = path.resolve(__dirname, '../../../public/showtimes_with_full_info.json');

const readShowtimesFromFile = () => {
  if (!fs.existsSync(showtimesFilePath)) return [];
  const data = fs.readFileSync(showtimesFilePath, 'utf8');
  return data ? JSON.parse(data) : [];
};

const writeShowtimesToFile = (data) => {
  fs.writeFileSync(showtimesFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export const addShowtime = (req, res) => {
  const showtimes = readShowtimesFromFile();
  const { date, time, film, cinema, room } = req.body;

  if (room === 'all') {
    const roomsFilePath = path.resolve(__dirname, '../../../public/rooms_with_full_info.json');
    const roomsData = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
    const cinemaRooms = roomsData[`cinema_${cinema}`] || [];

    cinemaRooms.forEach((room) => {
      const newShowtime = {
        id: showtimes.length + 1,
        date,
        time,
        film,
        cinema,
        room: room.name,
      };
      showtimes.push(newShowtime);
    });
  } else {
    const newShowtime = {
      id: showtimes.length + 1,
      date,
      time,
      film,
      cinema,
      room,
    };
    showtimes.push(newShowtime);
  }

  writeShowtimesToFile(showtimes);
  res.status(200).send({ message: 'Thêm suất chiếu thành công' });
};

export const deleteShowtime = (req, res) => {
  const showtimes = readShowtimesFromFile();
  const newShowtimes = showtimes.filter((showtime) => showtime.id !== parseInt(req.params.id, 10));
  writeShowtimesToFile(newShowtimes);
  res.status(200).send({ message: 'Xóa suất chiếu thành công' });
};
