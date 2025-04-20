import React, { useState } from 'react';
import { Typography, Input, Button, Card, Row, Col, message, Spin } from 'antd';
import { MailOutlined, MessageOutlined, WechatOutlined, PhoneOutlined } from '@ant-design/icons'; // Используем WechatOutlined
import { motion } from 'framer-motion';
import AppLayout from '../components/Layout';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const SupportPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMessageSubmit = async () => {
        if (!email || !messageContent) {
            message.error('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            setLoading(true);

            // Отправка данных на сервер для обработки
            const response = await axios.post('/api/send-message', {
                email,
                message: messageContent,
            });

            if (response.status === 200) {
                message.success('Сообщение успешно отправлено!');
            } else {
                message.error('Ошибка при отправке сообщения.');
            }
        } catch (error: any) {
            message.error('Произошла ошибка при отправке сообщения. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    textAlign: 'center',
                    padding: '50px 0',
                    backgroundColor: '#f0f4f7',
                }}
            >
                <Title level={2}>Служба поддержки</Title>
                <Paragraph style={{ fontSize: '18px', color: '#555', maxWidth: 600, margin: '0 auto 30px' }}>
                    Возникли вопросы, сложности или нужна помощь? Мы всегда на связи и готовы помочь вам!
                </Paragraph>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ padding: '50px 0', backgroundColor: '#fff' }}
            >
                <Row justify="center" gutter={[24, 24]}>
                    <Col xs={24} sm={20} md={14} lg={10}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                padding: '30px',
                            }}
                        >
                            <Title level={4}>Связаться с нами</Title>
                            <Input
                                size="large"
                                placeholder="Ваш Email"
                                prefix={<MailOutlined />}
                                style={{ marginBottom: 20 }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextArea
                                rows={5}
                                placeholder="Опишите вашу проблему..."
                                style={{ marginBottom: 20 }}
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                            />
                            <Button
                                type="primary"
                                icon={<MessageOutlined />}
                                size="large"
                                block
                                onClick={handleMessageSubmit}
                                loading={loading}
                            >
                                {loading ? 'Отправка...' : 'Отправить сообщение'}
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    textAlign: 'center',
                    padding: '50px 0',
                    backgroundColor: '#f0f4f7',
                }}
            >
                <Title level={2}>Можете обратиться напрямую!</Title>
                <Paragraph style={{ fontSize: '18px', color: '#555', maxWidth: 600, margin: '0 auto 30px' }}>
                    Возникли вопросы, сложности или нужна помощь? Мы всегда на связи и готовы помочь вам!
                </Paragraph>

                <Row justify="center" gutter={[16, 16]}>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PhoneOutlined />}
                            size="large"
                            style={{
                                borderRadius: '8px',
                                padding: '10px 20px',
                                backgroundColor: '#1890ff',
                            }}
                            href="tel:+1234567890" // Пример номера телефона
                        >
                            Позвонить
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<WechatOutlined />}
                            size="large"
                            style={{
                                borderRadius: '8px',
                                padding: '10px 20px',
                                backgroundColor: '#1890ff',
                            }}
                            href="https://t.me/yourusername" // Ссылка на Telegram
                        >
                            Написать в Telegram
                        </Button>
                    </Col>
                </Row>
            </motion.section>
        </AppLayout>
    );
};

export default SupportPage;
