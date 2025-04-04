import {
    PieChartOutlined,
    VideoCameraOutlined,
    UserOutlined,
    LogoutOutlined,
    GiftOutlined,
    HomeOutlined,
    DoubleRightOutlined,
  } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
function MenuSlider() {
    const items=[
        {
            key:"menu 1",
            label:"Dashboard",
            icon:<DoubleRightOutlined />,
        },
        {
            key:"menu 2",
            label:"Manage Employee",
            icon:<UserOutlined />,
            children:[
                {
                    key:"menu 2_1",
                    label:<Link to={'/employee'}>Employee List</Link>,
                    icon:<UserOutlined />,
                }
            ]
        },
        {
            key:"menu 3",
            label:"Manage Customer",
            icon:<UserOutlined />,
            children:[
                {
                    key:"menu 3_1",
                    label:<Link to={'/customer'}>Customer List</Link>,
                    icon:<UserOutlined />,
                }
            ]
        },
        {
            key:"menu 4",
            label:"Manage Movie",
            icon:<VideoCameraOutlined />,
            children:[
                {
                    key:"menu 4_1",
                    label:<Link to={'/film'}>Movie List</Link>,
                    icon:<VideoCameraOutlined />,
                }
            ]
        },
        {
            key:"menu 5",
            label:"Manage Cinema",
            icon:<HomeOutlined />,
            children:[
                {
                    key:"menu 5_1",
                    label:<Link to={'/cinema'}>Cinema List</Link>,
                    icon:<VideoCameraOutlined />,
                }
            ]
        },
        {
            key:"menu 6",
            label:"Manage Promotion",
            icon:<GiftOutlined />,
            children:[
                {
                    key:"menu 6_1",
                    label:<Link to={'/promotion'}>Promotion List</Link>,
                    icon:<VideoCameraOutlined />,
                }
            ]
        },
        {
            key:"menu 7",
            label:"Manage Genre",
            icon:<HomeOutlined />,
            children:[
                {
                    key:"menu 7_1",
                    label:<Link to={'/genre'}>Genre List</Link>,
                    icon:<VideoCameraOutlined />,
                }
            ]
        },
        {
            key:"menu 8",
            label:"Manage Showtime",
            icon:<VideoCameraOutlined />,
            children:[
                {
                    key:"menu 8_1",
                    label:<Link to={'/showtime'}>Showtime List</Link>,
                    icon:<VideoCameraOutlined />,
                }
            ]
        },
        
    ]
    return ( 
        <>
        <Menu 
            theme="dark"
              mode="inline" 
              items={items} 
              defaultSelectedKeys={['menu 1']}
              defaultOpenKeys={['menu 1']}
              />
        </>
     );
}

export default MenuSlider;