import { Modal, Button, Space, Popconfirm, Form, Input, InputNumber, Select, message } from 'antd';
import { Room } from '../interfaces/hotel';
import { useEffect } from 'react';

interface Props {
    open: boolean;
    room: Room | null;
    hotelId: string;
    onClose: () => void;
    onSuccess?: (room: Room | 'deleted') => void;
}

const RoomModal: React.FC<Props> = ({ open, room, hotelId, onClose, onSuccess }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (room) {
            form.setFieldsValue({ ...room });
        } else {
            form.resetFields();
        }
    }, [room, form]);

    const handleSubmit = async (values: any) => {
        const payload = {
            roomNumber: values.roomNumber,
            type: values.type,
            price: values.price,
            hotelId,
        };

        try {
            const res = await fetch(room ? `/rooms/${room.id}` : '/rooms', {
                method: room ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Ошибка сохранения');
            const newRoom = await res.json();

            message.success(`Комната успешно ${room ? 'обновлена' : 'создана'}`);
            onClose();
            onSuccess?.(newRoom);
        } catch (err) {
            message.error((err as Error).message || 'Ошибка');
        }
    };

    const handleDelete = async () => {
        if (!room) return;

        try {
            const res = await fetch(`/rooms/${room.id}`, {
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
                    rules={[{ required: true, message: 'Укажите номер' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Тип"
                    name="type"
                    rules={[{ required: true, message: 'Укажите тип' }]}
                >
                    <Select
                        options={[
                            { value: 'SINGLE', label: 'Одноместная' },
                            { value: 'DOUBLE', label: 'Двухместная' },
                            { value: 'SUITE', label: 'Люкс' },
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
