import { Modal, Form, Input, Rate } from 'antd';
import { Hotel } from '../interfaces/hotel';

interface Props {
    open: boolean;
    onCancel: () => void;
    onSave: () => void;
    form: any;
    editingHotel: Hotel | null;
}

const HotelFormModal: React.FC<Props> = ({ open, onCancel, onSave, form, editingHotel }) => (
    <Modal
        title={editingHotel ? "Редактировать отель" : "Добавить отель"}
        open={open}
        onCancel={onCancel}
        onOk={onSave}
        okText="Сохранить"
        cancelText="Отмена"
    >
        <Form form={form} layout="vertical">
            <Form.Item name="name" label="Название" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="city" label="Город" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="category" label="Категория" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="availableFromDate" label="Дата доступности" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="rating" label="Рейтинг">
                <Rate />
            </Form.Item>
            <Form.Item name="imageUrl" label="Имя файла картинки">
                <Input />
            </Form.Item>
        </Form>
    </Modal>
);

export default HotelFormModal;
