import { useParams, useNavigate } from 'react-router-dom'; // Добавили useNavigate
import { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Select,
    InputNumber,
    message,
    Spin,
    Alert,
    Row,
    Col,
    Input,
    Collapse
} from 'antd';
import { PlusOutlined, ReloadOutlined, ArrowLeftOutlined  } from '@ant-design/icons';
import axios from 'axios';
import RoomTable from '../components/RoomTable';
import RoomModal from '../components/RoomModal';
import { Room, Hotel } from '../interfaces/hotel';
import AppLayout from '../components/Layout';

const { Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;


const RoomPage: React.FC = () => {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

    const [selectedType, setSelectedType] = useState<string | undefined>();
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [searchRoomNumber, setSearchRoomNumber] = useState<string>('');

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hotelId) {
                    setError('Неверный ID отеля');
                    return;
                }

                const [hotelRes, roomsRes] = await Promise.all([
                    axios.get<Hotel>(`https://hotel-v2-final-production.up.railway.app/hotels/${hotelId}`),
                    axios.get(`https://hotel-v2-final-production.up.railway.app/rooms/hotel/${hotelId}`),
                ]);

                const roomsData = Array.isArray(roomsRes.data) ? roomsRes.data : [];
                const sortedRooms = roomsData.sort((a, b) =>
                    a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
                );

                setHotel(hotelRes.data);
                setRooms(sortedRooms);
                setFilteredRooms(sortedRooms);
            } catch (err) {
                console.error(err);
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        if (hotelId) fetchData();
    }, [hotelId]);


    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...rooms];

            if (selectedType) {
                filtered = filtered.filter((room) => room.type === selectedType);
            }
            if (minPrice !== undefined) {
                filtered = filtered.filter((room) => room.price >= minPrice);
            }
            if (maxPrice !== undefined) {
                filtered = filtered.filter((room) => room.price <= maxPrice);
            }
            if (searchRoomNumber.trim()) {
                filtered = filtered.filter((room) => room.roomNumber.toLowerCase().includes(searchRoomNumber.toLowerCase()));
            }

            setFilteredRooms(filtered);
        };

        applyFilters();
    }, [selectedType, minPrice, maxPrice, searchRoomNumber, rooms]);

    const openRoomModal = (room?: Room) => {
        setSelectedRoom(room || null);
        setIsRoomModalOpen(true);
    };

    const closeRoomModal = () => {
        setIsRoomModalOpen(false);
        setSelectedRoom(null);
    };

    const refreshRooms = async () => {
        try {
            const res = await axios.get<Room[]>(`https://hotel-v2-final-production.up.railway.app/rooms/hotel/${hotelId}`);
            const sorted = res.data.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }));
            setRooms(sorted);
        } catch {
            message.error('Не удалось обновить список комнат');
        }
    };

    const resetFilters = () => {
        setSelectedType(undefined);
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setSearchRoomNumber('');
    };

    if (loading) return <Spin tip="Загрузка..." />;
    if (error || !hotel) return <Alert type="error" message={error || 'Отель не найден'} />;

    const availableRoomTypes = rooms.reduce<string[]>((acc, room) => {
        if (acc.indexOf(room.type) === -1) {
            acc.push(room.type);
        }
        return acc;
    }, []);

    return (
        <AppLayout>
            <div style={{ padding: '24px', backgroundColor: '#f4f7fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/hotels')}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 500,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        Назад
                    </Button>
                    <Title level={3} style={{ margin: 0, color: '#1f1f1f' }}>
                        Комнаты отеля «{hotel.name}»
                    </Title>
                </div>

                <Collapse defaultActiveKey={['1']} accordion style={{ borderRadius: '8px', marginBottom: 16 }}>
                    <Panel header="Фильтры" key="1">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={6}>
                                <Input
                                    placeholder="Поиск по номеру"
                                    value={searchRoomNumber}
                                    allowClear
                                    onChange={(e) => setSearchRoomNumber(e.target.value)}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4}>
                                <Select
                                    placeholder="Тип комнаты"
                                    value={selectedType}
                                    onChange={setSelectedType}
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    {availableRoomTypes.map((type) => (
                                        <Option key={type} value={type}>{type}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} sm={6} md={4}>
                                <InputNumber
                                    placeholder="Мин. цена"
                                    value={minPrice}
                                    onChange={(value) => typeof value === 'number' ? setMinPrice(value) : setMinPrice(undefined)}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={4}>
                                <InputNumber
                                    placeholder="Макс. цена"
                                    value={maxPrice}
                                    onChange={(value) => typeof value === 'number' ? setMaxPrice(value) : setMaxPrice(undefined)}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={resetFilters}
                                    style={{ width: '100%' }}
                                >
                                    Сбросить фильтры
                                </Button>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>

                <div style={{ marginBottom: 24 }}>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => openRoomModal()}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            border: 'none',
                        }}
                    >
                        Добавить комнату
                    </Button>
                </div>

                <RoomTable rooms={filteredRooms} onRoomClick={openRoomModal} />

                <RoomModal
                    open={isRoomModalOpen}
                    room={selectedRoom}
                    hotelId={hotelId!}
                    onClose={closeRoomModal}
                    onSuccess={refreshRooms}
                />
            </div>
        </AppLayout>
    );
};

export default RoomPage;