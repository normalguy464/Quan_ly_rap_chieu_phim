import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useFilmApi } from '../../services/filmService';
import { useGenreApi } from '../../services/genreService';

const ThemPhim = ({ isModalVisible, handleCancel, onOk }) => {
  const [form] = Form.useForm();
  const { createFilm } = useFilmApi();
  const { getAllGenres } = useGenreApi();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getAllGenres();
        setGenres(genreList || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // const onOk = () => {
  //   form.validateFields()
  //     .then(async values => {
  //       const success = await createFilm({
  //         title: values.title,
  //         description: values.description,
  //         duration: values.duration,
  //         release_date: values.releaseDate,
  //         author: values.author,
  //         genre: values.genre,
  //         poster_path: values.posterPath,
  //       });
  //       if (success) {
  //         form.resetFields();
  //         handleCancel();
  //       }
  //     })
  //     .catch(info => {
  //       console.log('Validate Failed:', info);
  //     });
  // };


  return (
    <Modal title="Thêm phim mới" visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Tên phim" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Thời lượng (phút)" name="duration" rules={[{ required: true, message: 'Vui lòng nhập thời lượng phim' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Ngày phát hành" name="release_date" rules={[{ required: true, message: 'Vui lòng nhập ngày phát hành' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tác giả" name="author" rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Thể loại"
          name="genre_ids" // Update to genre_ids
          rules={[{ required: true, message: 'Vui lòng chọn thể loại phim' }]}
        >
          <Select
            mode="multiple" // Cho phép chọn nhiều thể loại
            placeholder="Chọn thể loại"
            allowClear
          >
            {genres.map(genre => (
              <Select.Option key={genre.id} value={genre.id}>
                {genre.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Đường dẫn poster" name="poster_path" rules={[{ required: true, message: 'Vui lòng nhập đường dẫn poster' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="COMING_SOON">Sắp chiếu</Select.Option>
            <Select.Option value="NOW_SHOWING">Đang chiếu</Select.Option>
            <Select.Option value="ENDED">Đã kết thúc</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Đạo diễn" name="director" rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Diễn viên" name="actors" rules={[{ required: true, message: 'Vui lòng nhập danh sách diễn viên' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemPhim;