import { Table, Tag, Space } from 'antd';
import { Room, Facility } from '../interfaces/hotel';

const RoomTable: React.FC<{ rooms: Room[], onRoomClick: (room: Room) => void }> = ({ rooms, onRoomClick }) => (
    <Table
        rowKey="id"
        size="small"
        pagination={false}
        dataSource={rooms}
        onRow={(record) => ({
            onClick: () => onRoomClick(record),
            style: { cursor: 'pointer' },
        })}
        columns={[
            { title: 'Номер', dataIndex: 'roomNumber' },
            { title: 'Тип', dataIndex: 'type' },
            {
                title: 'Цена',
                dataIndex: 'price',
                render: (price: number) => <span>{price} $</span>,
            },
            {
                title: 'Удобства',
                dataIndex: 'facilities',
                render: (facilities: Facility[]) =>
                    <Space wrap>{facilities.map(f => <Tag key={f.id}>{f.name}</Tag>)}</Space>,
            }
        ]}
    />
);

export default RoomTable;
