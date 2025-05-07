import { Children } from "react";
import App from "../Test1";
import DanhSachNhanVien from "../QLNhanVien/DanhSachNhanVien";
import DanhSachKhachHang from "../QLKhachHang/DanhSachKhachHang";
import DanhSachPhim from "../QLPhim/DanhSachPhim";
import DanhSachRapChieu from "../QLRapChieu/DanhSachRapChieu";
import DanhSachSuatChieu from "../QLSuatChieu/DanhSachSuatChieu";
import DanhSachTheLoai from "../QLTheLoai/DanhSachTheLoai";
import DanhSachKhuyenMai from "../QLKhuyenMai/DanhSachKhuyenMai";
import DanhSachPhongChieu from "../QLPhongChieu/DanhSachPhongChieu";
import Dashboard from "../DashBoard/Dashboard";
// Import 3 pages thống kê mới
import TopFilmRevenuePage from "../../Pages/TopFilmRevenuePage";
import RevenueByCinemaPage from "../../Pages/RevenueByCinemaPage";
import RevenueByMonthPage from "../../Pages/RevenueByMonthPage";
import PromotionRatioChart from "../../Charts/PromotionRatioChart";
import PaymentMethodChart from "../../Charts/PaymentMethodChart";
import TopFilmRatingChart from "../../Charts/TopFilmRatingChart";
import PaymentMethodPage from "../../Pages/Payment";
import PromotionRatioPage from "../../Pages/PromotionRatioPage";
import TopFilmRatingPage from "../../Pages/TopFilmRatingPage";

export const routes = [
    {
        path: '/',
        element: <App />,
        children:[
            {
                path: '/dashboard',
                element: <Dashboard/>, 
            },
            // Thêm 3 routes mới cho thống kê
            {
                path: '/top-film-revenue',
                element: <TopFilmRevenuePage />,
            },
            {
                path: '/revenue-by-cinema',
                element: <RevenueByCinemaPage />,
            },
            {
                path: '/revenue-by-month',
                element: <RevenueByMonthPage />,
            },
            {
                path: '/promotion-ratio',
                element: <PromotionRatioPage />,
            }, 
            {
                path: '/payment-method',
                element: <PaymentMethodPage />,
            },
            {
                path: '/film-rating',
                element: <TopFilmRatingPage />,
            },
            // Các routes khác giữ nguyên
            {
                path: '/employee',
                element: <DanhSachNhanVien/>, 
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
                path: '/room',
                element: <DanhSachPhongChieu />,
            },
            {
                path: '/showtime',
                element: <DanhSachSuatChieu />,
            },
            {
                path: '/genre',
                element: <DanhSachTheLoai/>
            },
            {
                path: '/promotion',
                element: <DanhSachKhuyenMai/>
            },
        ]
    }
]