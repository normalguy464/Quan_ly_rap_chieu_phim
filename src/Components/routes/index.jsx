import { Children } from "react";
import App from "../Test1";
import DanhSachNhanVien from "../QLNhanVien/DanhSachNhanVien";
import DanhSachKhachHang from "../QLKhachHang/DanhSachKhachHang";
import DanhSachPhim from "../QLPhim/DanhSachPhim";
import DanhSachRapChieu from "../QLRapChieu/DanhSachRapChieu";
import DanhSachSuatChieu from "../QLSuatChieu/DanhSachSuatChieu";
import DanhSachTheLoai from "../QLTheLoai/DanhSachTheLoai";
import DanhSachKhuyenMai from "../QLKhuyenMai/DanhSachKhuyenMai";

export const routes = [
    {
        path: '/',
        element: <App />,
        children:[
            {
                path: '/employee',
                element: < DanhSachNhanVien/>, 
            },
            {
                path: '/customer',
                element: <DanhSachKhachHang />,
            },
            {
                path: '/film',
                element: <DanhSachPhim />,
            },
            {
                path: '/cinema',
                element: <DanhSachRapChieu />,
            },
            {
                path: '/showtime',
                element: <DanhSachSuatChieu />,
            },
            {
                path:'/genre',
                element:<DanhSachTheLoai/>
            },
            {
                path:'/promotion',
                element:<DanhSachKhuyenMai/>
            },
            
        ]
    }
]