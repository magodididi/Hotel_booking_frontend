import {
    Card,
    Rate,
    Typography,
    Space,
    Divider,
    Popconfirm,
    Button
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import RoomModal from './RoomModal';
import { Hotel, Room } from '../interfaces/hotel';

interface Props {
    hotel: Hotel;
    index: number;
    onEdit: (hotel: Hotel) => void;
    onDelete: (id: string) => void;
}

const HotelCard: React.FC<Props> = ({ hotel, index, onEdit, onDelete }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [localRooms, setLocalRooms] = useState<Room[]>(hotel.rooms);

    const handleCloseRoomModal = () => {
        setIsRoomModalOpen(false);
        setSelectedRoom(null);
    };

    const handleOpenRoomModal = () => {
        setIsRoomModalOpen(true);
        setSelectedRoom(null);
    };

    const categoryToStars = (category: string): number => {
        const match = category.match(/\d+/);
        return match ? Math.min(5, Math.max(1, parseInt(match[0]))) : 3;
    };

    const starCount = categoryToStars(hotel.category);

    const prices = localRooms.map(room => room.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    const roomTypes = Array.from(new Set(localRooms.map(room => room.type)));
    const allAmenities = Array.from(
        new Set(localRooms.flatMap(room => room.facilities.map(f => f.name)))
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card
                hoverable
                title={
                    <Space direction="vertical" size={0} style={{ paddingTop: 24 }}>
                        <Typography.Text strong>{hotel.name}</Typography.Text>
                        <Typography.Text type="secondary">
                            {hotel.city} • {hotel.category}
                        </Typography.Text>
                        <Space>
                            <Rate disabled value={starCount} style={{ color: '#faad14' }} />
                            <Typography.Text>{hotel.rating} / 5</Typography.Text>
                        </Space>
                    </Space>
                }
                bordered={false}
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    position: 'relative'
                }}
                bodyStyle={{ padding: '16px 16px 12px' }}
            >
                <Space style={{ position: 'absolute', top: 12, right: 12 }}>
                    <EditOutlined
                        onClick={() => onEdit(hotel)}
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                    />
                    <Popconfirm
                        title="Удалить отель?"
                        onConfirm={() => onDelete(hotel.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                    </Popconfirm>
                </Space>

                <Space direction="vertical" size={4} style={{ display: 'flex' }}>
                    <Typography.Text>
                        <CalendarOutlined /> Доступен с: {hotel.availableFromDate}
                    </Typography.Text>

                    <Divider style={{ margin: '8px 0' }} />

                    {localRooms.length > 0 ? (
                        <>
                            <Typography.Text strong>Цены:</Typography.Text>
                            <Typography.Text>
                                {minPrice === maxPrice
                                    ? `${minPrice} ₽ за ночь`
                                    : `${minPrice} – ${maxPrice} ₽ за ночь`}
                            </Typography.Text>

                            <Typography.Text strong>Типы комнат:</Typography.Text>
                            <Typography.Text>{roomTypes.join(', ')}</Typography.Text>

                            <Typography.Text strong>Удобства:</Typography.Text>
                            <Typography.Text>
                                {allAmenities.length > 0 ? allAmenities.join(', ') : 'Нет'}
                            </Typography.Text>

                            <Typography.Text strong>Количество доступных комнат:</Typography.Text>
                            <Typography.Text>{localRooms.length} комнат</Typography.Text>
                        </>
                    ) : (
                        <Typography.Text type="secondary">Нет доступных комнат</Typography.Text>
                    )}
                </Space>

                <Divider style={{ margin: '12px 0 8px' }} />

                <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => localRooms.length > 0
                        ? window.location.href = `/rooms/${hotel.id}`
                        : handleOpenRoomModal()}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        width: '100%',
                        borderRadius: 8,
                        borderColor: isHovered ? '#1890ff' : '#d9d9d9',
                        backgroundColor: isHovered ? '#1890ff' : 'transparent',
                        color: isHovered ? '#ffffff' : '#595959',
                        transition: 'all 0.3s ease',
                        userSelect: 'none'
                    }}
                >
                    {localRooms.length === 0 ? 'Добавить комнату' : 'Посмотреть комнаты'}
                </Button>
            </Card>

            <RoomModal
                open={isRoomModalOpen}
                onClose={handleCloseRoomModal}
                room={selectedRoom}
                hotelId={hotel.id}
                onSuccess={(result) => {
                    if (result === 'deleted' && selectedRoom) {
                        setLocalRooms(prev => prev.filter(r => r.id !== selectedRoom.id));
                    } else if (typeof result === 'object') {
                        setLocalRooms(prev => {
                            const existing = prev.find(r => r.id === result.id);
                            return existing
                                ? prev.map(r => (r.id === result.id ? result : r))
                                : [...prev, result];
                        });
                    }
                }}
            />
        </motion.div>
    );
};

export default HotelCard;
