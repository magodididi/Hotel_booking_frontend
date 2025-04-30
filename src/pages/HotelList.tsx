import {
    Typography, Button, AutoComplete, Select, DatePicker, Spin, Alert,
    Row, Col, message, Form, Flex
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

import HotelCard from '../components/HotelCard';
import HotelFormModal from '../components/HotelFormModal';
import { Hotel } from '../interfaces/hotel';
import AppLayout from '../components/Layout';

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

    useEffect(() => {
        axios.get('/api/hotels')
            .then(res => {
                console.log("API response:", res.data);
                setHotels(res.data);
                setFilteredHotels(res.data);
            })
            .catch(() => setError("Ошибка загрузки отелей"))
            .finally(() => setLoading(false));
    }, []);


    const cities = useMemo(() => {
        return Array.isArray(hotels)
            ? Array.from(new Set(hotels.map(h => h.city)))
            : [];
    }, [hotels]);

    const categories = useMemo(() => {
        return Array.isArray(hotels)
            ? Array.from(new Set(hotels.map(h => h.category)))
            : [];
    }, [hotels]);

    const hotelOptions = useMemo(() => {
        return Array.isArray(hotels)
            ? hotels.map(h => ({ value: h.name }))
            : [];
    }, [hotels]);

    useEffect(() => {
        let result = [...hotels];

        if (selectedCity) result = result.filter(h => h.city === selectedCity);
        if (selectedCategory) result = result.filter(h => h.category === selectedCategory);
        if (selectedDate) result = result.filter(h => dayjs(h.availableFromDate).isBefore(selectedDate));
        if (searchQuery) result = result.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));

        setFilteredHotels(result);
    }, [selectedCity, selectedCategory, selectedDate, searchQuery, hotels]);

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

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const payload = { ...values };

            if (editingHotel) {
                await axios.put(`/api/hotels/${editingHotel.id}`, payload);
                message.success("Отель обновлен");
            } else {
                await axios.post("/api/hotels", payload);
                message.success("Отель создан");
            }

            const updated = await axios.get('/api/hotels');
            const data = updated.data;
            if (Array.isArray(data)) {
                setHotels(data);
                setFilteredHotels(data);
            } else {
                setError("Ошибка при загрузке обновлённых данных");
            }

            setSelectedCity(undefined);
            setSelectedCategory(undefined);
            setSelectedDate(null);
            setSearchQuery("");
            setIsModalVisible(false);
        } catch {
            message.error("Ошибка при сохранении");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/hotels/${id}`);
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
        <AppLayout>
            <div style={{ padding: 24 }}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: 16 }}>
                    <Title level={2} style={{ margin: 0 }}>Список отелей</Title>
                </Flex>
                <div style={{ margin: '24px 0' }}>
                    <Flex
                        justify="space-between"
                        align="middle"
                        wrap
                        style={{ marginBottom: 24 }}
                    >
                        <Flex gap="middle" wrap>
                            <AutoComplete
                                style={{ width: 200 }}
                                options={hotelOptions}
                                onSelect={setSearchQuery}
                                onSearch={setSearchQuery}
                                placeholder="Поиск по названию"
                            />
                            <Select
                                style={{ width: 160 }}
                                placeholder="Город"
                                allowClear
                                onChange={setSelectedCity}
                                value={selectedCity}
                            >
                                {cities.map(city => (
                                    <Option key={city} value={city}>{city}</Option>
                                ))}
                            </Select>
                            <Select
                                style={{ width: 160 }}
                                placeholder="Категория"
                                allowClear
                                onChange={setSelectedCategory}
                                value={selectedCategory}
                            >
                                {categories.map(cat => (
                                    <Option key={cat} value={cat}>{cat}</Option>
                                ))}
                            </Select>
                            <DatePicker
                                style={{
                                    width: 160,
                                    padding: '0 8px',
                                    height: 32,
                                    lineHeight: '40px'
                                }}
                                placeholder="До даты"
                                onChange={setSelectedDate}
                                value={selectedDate}
                            />
                        </Flex>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            size="large"
                            style={{ minWidth: 180 }}
                            onClick={() => showModal()}
                        >
                            Добавить отель
                        </Button>
                    </Flex>
                </div>

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
        </AppLayout>
    );
};

export default HotelList;
