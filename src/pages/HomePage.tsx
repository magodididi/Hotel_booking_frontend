import React from 'react';
import { Button, Typography, Card, Row, Col } from 'antd';
import { SearchOutlined, CheckCircleOutlined, MobileOutlined, ApartmentOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AppLayout from '../components/Layout';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
    return (
        <AppLayout>
            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', padding: '50px 0', backgroundColor: '#f0f4f7' }}
            >
                <Title level={2} style={{ marginBottom: '20px', color: '#1f1f1f' }}>
                    Добро пожаловать в Hotel-Booking
                </Title>
                <Paragraph style={{ fontSize: '20px', color: '#555', marginBottom: '30px', lineHeight: '1.6' }}>
                    Мы предоставляем удобный сервис для работы с бронированием отелей по всему миру.
                    <br />
                    Работайте с отелями и их номерами с комфортом.
                    <br />
                    Начните путешествие прямо сейчас — ваш идеальный отель всего в несколько кликов!
                </Paragraph>
                <Link to="/hotels">
                    <Button
                        type="primary"
                        size="large"
                        icon={<SearchOutlined />}
                        style={{
                            borderRadius: '8px',
                            padding: '10px 20px',
                            backgroundColor: '#1890ff',
                        }}
                    >
                        Перейти к отелям
                    </Button>
                </Link>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ padding: '50px 0', backgroundColor: '#ffffff' }}
            >
                <Title level={3} style={{ marginBottom: '40px', textAlign: 'center' }}>
                    Почему выбирают нас?
                </Title>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    padding: '20px',
                                }}
                                cover={<CheckCircleOutlined style={{ fontSize: '40px', color: '#1890ff', marginTop: '20px' }} />}
                            >
                                <Title level={4}>Гибкость выбора</Title>
                                <Paragraph>
                                    Фильтрация по типу, цене и удобствам и комфортным для вас датам.
                                </Paragraph>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    padding: '20px',
                                }}
                                cover={<MobileOutlined style={{ fontSize: '40px', color: '#1890ff', marginTop: '20px' }} />}
                            >
                                <Title level={4}>Мобильное приложение</Title>
                                <Paragraph>Управление бронированиям на ходу — легко и удобно.</Paragraph>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    padding: '20px',
                                }}
                                cover={<ApartmentOutlined style={{ fontSize: '40px', color: '#1890ff', marginTop: '20px' }} />}
                            >
                                <Title level={4}>Управление отелями</Title>
                                <Paragraph>Добавляйте, редактируйте и удаляйте — легко!</Paragraph>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </motion.section>
            <section style={{ padding: '60px 0', backgroundColor: '#f0f4f7' }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>Отзывы наших клиентов</Title>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Paragraph>"Очень удобно! Нашли отель за 5 минут."</Paragraph>
                            <Paragraph type="secondary">— Алексей, Москва</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Paragraph>"Интерфейс простой и понятный. Рекомендую!"</Paragraph>
                            <Paragraph type="secondary">— Марина, Санкт-Петербург</Paragraph>
                        </Card>
                    </Col>
                </Row>
            </section>

            <section style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#ffffff' }}>
                <Title level={3}>Как это работает?</Title>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/WvjAYp4NkOg"
                        title="Hotel-Booking demo"
                        style={{ border: 'none' }}
                        allowFullScreen
                    />
                </div>
            </section>
            <section style={{ padding: '60px 0', backgroundColor: '#f0f4f7' }}>
                <Row justify="center" gutter={[16, 16]}>
                    <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                        <Title level={2}>500+</Title>
                        <Paragraph>Отелей по всему миру</Paragraph>
                    </Col>
                    <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                        <Title level={2}>10K+</Title>
                        <Paragraph>Довольных клиентов</Paragraph>
                    </Col>
                    <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                        <Title level={2}>4.9★</Title>
                        <Paragraph>Средняя оценка пользователей</Paragraph>
                    </Col>
                </Row>
            </section>
        </AppLayout>
    );
};

export default HomePage;
