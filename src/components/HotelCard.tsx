import { Card, Rate, Typography, Space, Divider, Popconfirm, Button } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import RoomTable from './RoomTable';
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

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
        setIsRoomModalOpen(true);
    };

    const handleAddRoom = () => {
        setSelectedRoom(null);
        setIsRoomModalOpen(true);
    };

    const handleCloseRoomModal = () => {
        setIsRoomModalOpen(false);
        setSelectedRoom(null);
    };

    // Функция для преобразования категории в количество звезд
    const categoryToStars = (category: string): number => {
        // Пример: если категория содержит число, извлекаем его
        const match = category.match(/\d+/);
        return match ? Math.min(5, Math.max(1, parseInt(match[0]))) : 3;
    };

    const starCount = categoryToStars(hotel.category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card
                hoverable
                cover={<img alt={hotel.name} src={hotel.imageUrl ? `/images/${hotel.imageUrl}` : 'https://via.placeholder.com/300'} />}
                title={
                    <Space direction="vertical" size={0}>
                        <Typography.Text strong>{hotel.name}</Typography.Text>
                        <Typography.Text type="secondary">{hotel.city} • {hotel.category}</Typography.Text>
                        <Space>
                            <Rate
                                disabled
                                value={starCount}
                                style={{ color: '#faad14' }} // Желтый цвет звезд
                            />
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
                bodyStyle={{ padding: '16px' }}
            >
                <Space style={{ position: 'absolute', top: 12, right: 12 }}>
                    <EditOutlined onClick={() => onEdit(hotel)} style={{ color: '#1890ff', cursor: 'pointer' }} />
                    <Popconfirm
                        title="Удалить отель?"
                        onConfirm={() => onDelete(hotel.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                    </Popconfirm>
                </Space>

                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Typography.Text><CalendarOutlined /> Доступен с: {hotel.availableFromDate}</Typography.Text>
                    <Divider style={{ margin: '8px 0' }} />

                    {hotel.rooms.length > 0
                        ? <RoomTable rooms={hotel.rooms} onRoomClick={handleRoomClick} />
                        : <Typography.Text type="secondary">Нет доступных комнат</Typography.Text>}

                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAddRoom}
                        block
                    >
                        Добавить комнату
                    </Button>
                </Space>
            </Card>

            <RoomModal
                open={isRoomModalOpen}
                room={selectedRoom}
                onClose={handleCloseRoomModal}
                hotelId={hotel.id}
            />
        </motion.div>
    );
};

export default HotelCard;