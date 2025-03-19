import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promotionsFilePath = path.join(__dirname, 'public', 'promotions_with_full_info.json');

const readPromotionsFromFile = () => {
  const data = fs.readFileSync(promotionsFilePath, 'utf8');
  return JSON.parse(data);
};

const writePromotionsToFile = (data) => {
  fs.writeFileSync(promotionsFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export const addPromotion = (req, res) => {
  console.log('Received POST request:', req.body);
  const promotions = readPromotionsFromFile();
  const newPromotion = {
    id: promotions.length + 1,
    ...req.body,
  };
  promotions.push(newPromotion);
  writePromotionsToFile(promotions);
  res.status(200).send({ message: 'Thêm khuyến mãi thành công', promotion: newPromotion });
};

export const updatePromotion = (req, res) => {
  const promotions = readPromotionsFromFile();
  const promotionId = parseInt(req.params.id, 10);
  const promotionIndex = promotions.findIndex((promotion) => promotion.id === promotionId);

  if (promotionIndex !== -1) {
    promotions[promotionIndex] = { ...promotions[promotionIndex], ...req.body };
    writePromotionsToFile(promotions);
    res.status(200).send({ message: 'Cập nhật khuyến mãi thành công', promotion: promotions[promotionIndex] });
  } else {
    res.status(404).send({ message: 'Không tìm thấy khuyến mãi' });
  }
};

export const deletePromotion = (req, res) => {
  const promotions = readPromotionsFromFile();
  const promotionId = parseInt(req.params.id, 10);
  const newPromotions = promotions.filter((promotion) => promotion.id !== promotionId);

  if (newPromotions.length !== promotions.length) {
    writePromotionsToFile(newPromotions);
    res.status(200).send({ message: 'Xóa khuyến mãi thành công' });
  } else {
    res.status(404).send({ message: 'Không tìm thấy khuyến mãi' });
  }
};