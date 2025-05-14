import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, filename = 'data-export') => {
  // Tạo workbook mới
  const wb = XLSX.utils.book_new();
  
  // Chuyển đổi dữ liệu thành worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Tạo và tải xuống file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  
  // Tạo tên file với timestamp để tránh trùng lặp
  const dateStr = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}-${dateStr}.xlsx`;
  
  saveAs(blob, fullFilename);
};