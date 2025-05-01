import { Modal, Button, Space, Popconfirm, Form, InputNumber, Select, message } from 'antd';
import { Room, Facility } from '../interfaces/hotel';
import { useState, useEffect} from 'react';

interface Props {
    open: boolean;
    room: Room | null;
    hotelId: string;
    onClose: () => void;
    onSuccess?: (room: Room | 'deleted') => void;
}

const RoomModal: React.FC<Props> = ({ open, room, hotelId, onClose, onSuccess }) => {
    const [form] = Form.useForm();

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);

    useEffect(() => {
        if (room) {
            form.setFieldsValue({ ...room });
        } else {
            form.resetFields();
        }
    }, [room, form]);

    useEffect(() => {
        const fetchFacilities = async () => {
            const res = await fetch('/api/facilities');
            const data = await res.json();

            // Если пусто — заполним начальными удобствами
            if (data.length === 0) {
                const defaultFacilities = [
                    { name: 'Wi-Fi' },
                    { name: 'Swimmig pool' },
                    { name: 'Bar' },
                    { name: 'Dogs/Cats' },
                ];

                await Promise.all(
                    defaultFacilities.map(facility =>
                        fetch('/api/facilities', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(facility),
                        })
                    )
                );

                const res2 = await fetch('/api/facilities');
                const facilitiesAfterInsert = await res2.json();
                setFacilities(facilitiesAfterInsert);
            } else {
                setFacilities(data);
            }
        };

        fetchFacilities();
    }, []);

    useEffect(() => {
        if (room) {
            setSelectedFacilityIds(room.facilities.map(f => f.id));
        } else {
            setSelectedFacilityIds([]);
        }
    }, [room]);

    const handleSubmit = async (values: any) => {
        const payload = {
            roomNumber: values.roomNumber,
            type: values.type,
            price: values.price,
            hotelId,
        };

        try {
            const res = await fetch(room ? `/api/rooms/${room.id}` : '/api/rooms', {
                method: room ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Ошибка сохранения');
            const updatedRoom: Room = await res.json();

            // Обновление удобств
            const existingIds = room?.facilities.map(f => f.id) || [];
            const toAdd = selectedFacilityIds.filter(id => !existingIds.includes(id));
            const toRemove = existingIds.filter(id => !selectedFacilityIds.includes(id));

            await Promise.all([
                ...toAdd.map(id =>
                    fetch(`/api/facilities/${updatedRoom.id}/add/${id}`, { method: 'POST' })),
                ...toRemove.map(id =>
                    fetch(`/api/facilities/${updatedRoom.id}/remove/${id}`, { method: 'DELETE' })),
            ]);

            message.success(`Комната успешно ${room ? 'обновлена' : 'создана'}`);
            onClose();
            onSuccess?.(updatedRoom);
        } catch (err) {
            message.error((err as Error).message || 'Ошибка');
        }
    };

    const handleDelete = async () => {
        if (!room) return;

        try {
            const res = await fetch(`/api/rooms/${room.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Ошибка удаления');

            message.success('Комната удалена');
            onClose();
            onSuccess?.('deleted');
        } catch (err) {
            message.error((err as Error).message || 'Ошибка удаления');
        }
    };

    return (
        <Modal
            title={room ? `Редактировать комнату ${room.roomNumber}` : 'Добавить комнату'}
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Номер комнаты"
                    name="roomNumber"
                    rules={[
                        { required: true, message: 'Укажите номер' },
                        {
                            validator: (_, value) => {
                                if (!value || value < 1) {
                                    return Promise.reject('Номер комнаты не может быть меньше 1');
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>



                <Form.Item
                    label="Тип"
                    name="type"
                    rules={[{ required: true, message: 'Укажите тип' }]}
                >
                    <Select
                        options={[
                            { value: 'SINGLE', label: 'Single' },
                            { value: 'DOUBLE', label: 'Double' },
                            { value: 'SUITE', label: 'Suite' },
                            { value: 'FAMILY', label: 'Family' },  {/* Новый тип */}
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Цена"
                    name="price"
                    rules={[{ required: true, type: 'number', min: 0.1, message: 'Укажите цену больше 0' }]}
                >
                    <InputNumber min={0.1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Удобства">
                    <Select
                        mode="multiple"
                        value={selectedFacilityIds}
                        onChange={setSelectedFacilityIds}
                        options={facilities.map(f => ({ value: f.id, label: f.name }))}
                        placeholder="Выберите удобства"
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button htmlType="submit" type="primary">
                            {room ? 'Сохранить' : 'Создать'}
                        </Button>
                        <Button onClick={onClose}>Отмена</Button>
                        {room && (
                            <Popconfirm
                                title="Удалить комнату?"
                                onConfirm={handleDelete}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Button danger>Удалить комнату</Button>
                            </Popconfirm>
                        )}
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoomModal;
