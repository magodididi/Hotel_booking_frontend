import { Modal, Form, Input, InputNumber} from 'antd';
import { Hotel } from '../interfaces/hotel';
import dayjs from 'dayjs';

interface Props {
    open: boolean;
    onCancel: () => void;
    onSave: () => void;
    form: any;
    editingHotel: Hotel | null;
}

const HotelFormModal: React.FC<Props> = ({ open, onCancel, onSave, form, editingHotel }) => {
    return (
        <Modal
            title={editingHotel ? "Редактировать отель" : "Добавить отель"}
            open={open}
            onCancel={onCancel}
            onOk={() => form.validateFields().then(onSave)}
            okText="Сохранить"
            cancelText="Отмена"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Название"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите название' },
                        { min: 2, message: 'Название должно содержать минимум 2 символа' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="city"
                    label="Город"
                    rules={[
                        { required: true, message: 'Пожалуйста, укажите город' },
                        { min: 2, message: 'Город должен содержать минимум 2 символа' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Категория (1-5)"
                    rules={[
                        { required: true, message: 'Укажите категорию' },
                        {
                            type: 'number',
                            min: 1,
                            max: 5,
                            message: 'Категория должна быть от 1 до 5',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="availableFromDate"
                    label="Дата доступности"
                    rules={[
                        { required: true, message: 'Укажите дату' },
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.reject('Дата обязательна');
                                const selectedDate = dayjs(value);
                                const today = dayjs().startOf('day');
                                if (selectedDate.isSame(today) || selectedDate.isAfter(today)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Дата должна быть сегодня или позже');
                            }

                        }
                    ]}
                >
                    <Input type="date" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default HotelFormModal;
