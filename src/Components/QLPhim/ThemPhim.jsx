import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useFilmApi } from '../../services/filmService';
import { useGenreApi } from '../../services/genreService';

const ThemPhim = ({ isModalVisible, handleCancel }) => {
  const [form] = Form.useForm();
  const { createFilm } = useFilmApi();
  const { getAllGenres } = useGenreApi();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    console.log('useEffect triggered');
    const fetchGenres = async () => {
      try {
        console.log('Fetching genres...');
        const genreList = await getAllGenres();
        console.log('Fetched genres:', genreList);
        setGenres(genreList || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, [getAllGenres]);

  const onOk = () => {
    form.validateFields()
      .then(async values => {
        const success = await createFilm({
          title: values.title,
          description: values.description,
          duration: values.duration,
          release_date: values.releaseDate,
          author: values.author,
          genre: values.genre,
          poster_path: values.posterPath,
        });
        if (success) {
          form.resetFields();
          handleCancel();
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  console.log('ThemPhim component rendered, isModalVisible:', isModalVisible);

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
        <Form.Item label="Ngày phát hành" name="releaseDate" rules={[{ required: true, message: 'Vui lòng nhập ngày phát hành' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tác giả" name="author" rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Thể loại"
          name="genre"
          rules={[{ required: true, message: 'Vui lòng chọn thể loại phim' }]}
        >
          <Select placeholder="Chọn thể loại" allowClear>
            {genres.map(genre => (
              <Select.Option key={genre.id} value={genre.id}>
                {genre.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Đường dẫn poster" name="posterPath" rules={[{ required: true, message: 'Vui lòng nhập đường dẫn poster' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemPhim;