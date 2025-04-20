import { Modal, Form, Input, Rate, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Hotel } from '../interfaces/hotel';

interface Props {
    open: boolean;
    onCancel: () => void;
    onSave: () => void;
    form: any;
    editingHotel: Hotel | null;
}

const HotelFormModal: React.FC<Props> = ({ open, onCancel, onSave, form, editingHotel }) => {
    // Функция для обработки ввода категории (удаляем звездочки)
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\*/g, '');
        form.setFieldsValue({ category: value });
    };

    return (
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
                    <Input onChange={handleCategoryChange} />
                </Form.Item>
                <Form.Item name="availableFromDate" label="Дата доступности" rules={[{ required: true }]}>
                    <Input type="date" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default HotelFormModal;