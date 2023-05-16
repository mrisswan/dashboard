import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import React from "react";

//admin
import Login from "./Commponents/Login";
import Dashboard from "./pages/Admin/Dashboard";
import User from "./pages/Admin/User";
import Meja from "./pages/Admin/Meja";
import Menu from "./pages/Admin/Menu";

//kasir
import Kasir from "./pages/Kasir/Dashboard";
import Transaksi from "./pages/Kasir/Transaksi";
import Riwayat from "./pages/Kasir/Riwayat";

//maanjer
import Manajer from "./pages/Manajer/Dashboard";
import Chart from "./pages/Manajer/Manajer";
import Penjualan from "./pages/Manajer/Penjualan";

const App = () => (
  <Routes>
    <Route exact path="/" element={<Login />} />
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/user" element={<User />} />
    <Route path="/admin/meja" element={<Meja />} />
    <Route path="/admin/menu" element={<Menu />} />

    <Route path="/kasir/dashboard" element={<Kasir />} />
    <Route path="/kasir/transaksi" element={<Transaksi />} />
    <Route path="/kasir/riwayat" element={<Riwayat />} />

    <Route path="/manajer/dashboard" element={<Manajer />} />
    <Route path="/manajer/manajer" element={<Chart />} />
    <Route path="/manajer/penjualan" element={<Penjualan />} />
  </Routes>
);
export default App;
