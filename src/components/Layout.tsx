import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface LayoutProps {
    children: ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ backgroundColor: '#1890ff', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2} style={{ color: 'white', margin: 0 }}>
                        <Link to="/" style={{ color: 'white' }}>Hotel-Booking</Link>
                    </Title>
                    <Menu
                        mode="horizontal"
                        style={{
                            backgroundColor: 'transparent',
                            borderBottom: 'none',
                            color: 'white',
                        }}
                        defaultSelectedKeys={['home']}
                    >
                        <Menu.Item key="home">
                            <Link to="/" style={{ color: 'white' }}>Главная</Link>
                        </Menu.Item>
                        <Menu.Item key="hotels">
                            <Link to="/hotels" style={{ color: 'white' }}>Отели</Link>
                        </Menu.Item>
                        <Menu.Item key="support">
                            <Link to="/support" style={{ color: 'white' }}>Поддержка</Link>
                        </Menu.Item>
                    </Menu>
                </div>
            </Header>
            <Content style={{ padding: '20px', backgroundColor: '#f7f7f7' }}>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center', backgroundColor: '#1890ff', color: 'white', padding: '20px' }}>
                <p>&copy; {new Date().getFullYear()} Hotel-Booking. Все права защищены ДМ.</p>
            </Footer>
        </Layout>
    );
};

export default AppLayout;
