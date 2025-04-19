import {
    Typography, Button, AutoComplete, Select, DatePicker, Spin, Alert,
    Row, Col, Space, message, Form
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

import HotelCard from './HotelCard';
import HotelFormModal from './HotelFormModal';
import { Hotel } from '../interfaces/hotel';

const { Title } = Typography;
const { Option } = Select;

const HotelList: React.FC = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCity, setSelectedCity] = useState<string>();
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
    const [form] = Form.useForm();

    // Загрузка отелей
    useEffect(() => {
        axios.get<Hotel[]>('/hotels')
            .then(res => {
                setHotels(res.data);
                setFilteredHotels(res.data);
            })
            .catch(() => setError("Ошибка загрузки отелей"))
            .finally(() => setLoading(false));
    }, []);

    // Города и категории
    const cities = useMemo(() => Array.from(new Set(hotels.map(h => h.city))), [hotels]);
    const categories = useMemo(() => Array.from(new Set(hotels.map(h => h.category))), [hotels]);

    // Фильтрация
    useEffect(() => {
        let result = [...hotels];

        if (selectedCity) result = result.filter(h => h.city === selectedCity);
        if (selectedCategory) result = result.filter(h => h.category === selectedCategory);
        if (selectedDate) result = result.filter(h => dayjs(h.availableFromDate).isBefore(selectedDate));
        if (searchQuery) result = result.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));

        setFilteredHotels(result);
    }, [selectedCity, selectedCategory, selectedDate, searchQuery, hotels]);

    // Открытие формы
    const showModal = (hotel?: Hotel) => {
        if (hotel) {
            setEditingHotel(hotel);
            form.setFieldsValue(hotel);
        } else {
            setEditingHotel(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // Сохранение (создание / обновление)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const payload = { ...values };

            if (editingHotel) {
                await axios.put(`/hotels/${editingHotel.id}`, payload);
                message.success("Отель обновлен");
            } else {
                await axios.post("/hotels", payload);
                message.success("Отель создан");
            }


            const updated = await axios.get<Hotel[]>('/hotels');
            setHotels(updated.data);
            setSelectedCity(undefined);
            setSelectedCategory(undefined);
            setSelectedDate(null);
            setSearchQuery("");
            setFilteredHotels(updated.data);

            setIsModalVisible(false);
        } catch {
            message.error("Ошибка при сохранении");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/hotels/${id}`);
            message.success("Отель удалён");
            setHotels(prev => prev.filter(h => h.id !== id));
            setFilteredHotels(prev => prev.filter(h => h.id !== id));
        } catch {
            message.error("Не удалось удалить");
        }
    };

    if (loading) return <Spin tip="Загрузка отелей..." style={{ display: 'block', marginTop: 50 }} />;
    if (error) return <Alert message={error} type="error" showIcon style={{ marginTop: 20 }} />;

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>🏨 Список отелей</Title>

            <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => showModal()}
                style={{ marginBottom: 24 }}
            >
                Добавить отель
            </Button>

            <Space wrap style={{ marginBottom: 24 }}>
                <AutoComplete
                    style={{ width: 200 }}
                    options={hotels.map(h => ({ value: h.name }))}
                    onSelect={setSearchQuery}
                    onSearch={setSearchQuery}
                    placeholder="Поиск по названию"
                />
                <Select
                    style={{ width: 160 }}
                    placeholder="Город"
                    allowClear
                    onChange={setSelectedCity}
                >
                    {cities.map(city => <Option key={city} value={city}>{city}</Option>)}
                </Select>
                <Select
                    style={{ width: 160 }}
                    placeholder="Категория"
                    allowClear
                    onChange={setSelectedCategory}
                >
                    {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                </Select>
                <DatePicker
                    style={{ width: 180 }}
                    placeholder="До даты"
                    onChange={setSelectedDate}
                />
            </Space>

            <Row gutter={[24, 24]}>
                {filteredHotels.map((hotel, index) => (
                    <Col key={hotel.id} xs={24} md={12} lg={8}>
                        <HotelCard
                            hotel={hotel}
                            index={index}
                            onEdit={showModal}
                            onDelete={handleDelete}
                        />
                    </Col>
                ))}
            </Row>

            <HotelFormModal
                open={isModalVisible}
                onCancel={handleCancel}
                onSave={handleSave}
                form={form}
                editingHotel={editingHotel}
            />
        </div>
    );
};

export default HotelList;
