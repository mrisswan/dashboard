import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Sidebar from "./Sidebar";
import axios from "axios";
// import $ from "jquery";

export default class Manajer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      nama: [],
      total: [],
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [],
        },
      },
    };
    let user = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("token") && user.role == "manajer") {
      this.state.token = localStorage.getItem("token");
    } else {
      window.alert("Anda tidak terdaftar sebagai manajer");
      window.location = "/";
    }
  }

  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    return header;
  };

  getChart = () => {
    let url = "http://localhost:4040/cafe/transaksi/qtybymenu";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        const categories = response.data.map((data) => data.nama_menu);
        const values = response.data.map((data) => data.total_qty);

        this.setState({
          data: [
            {
              name: "Value",
              data: values,
            },
          ],
          options: {
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: categories,
              labels: {
                style: {
                  fontFamily: "Arial, sans-serif",
                  fontSize: "15px",
                },
              },
            },
            fill: {
              colors: "#1F2937",
            },
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getMax = () => {
    let url = "http://localhost:4040/cafe/transaksi/max";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        const categories = response.data.map((data) => data.nama_menu);
        const values = response.data.map((data) => data.total_qty);

        this.setState({
          data: [
            {
              name: "Value",
              data: values,
            },
          ],
          options: {
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: categories,
              labels: {
                style: {
                  fontFamily: "Arial, sans-serif",
                  fontSize: "15px",
                },
              },
            },
            fill: {
              colors: "#1F2937",
            },
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getMin = () => {
    let url = "http://localhost:4040/cafe/transaksi/min";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          nama: this.state.nama,
          total: this.state.total,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            window.alert(error.response.data.message);
            window.location = "/";
          }
        } else {
          console.log(error);
        }
      });
  };

  componentDidMount() {
    this.getChart();
  }

  render() {
    return (
      <div class="p-4 sm:ml-64">
        <Sidebar />
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <Chart
            options={this.state.options}
            series={this.state.data}
            type="bar"
            height={350}
          />
        </div>
        <br />
        <table class="text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Nama Menu
              </th>
              <th scope="col" class="px-6 py-3">
                Jumlah Transaksi
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {this.state.menus.map((item) => ( */}
            <tr
              class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              // key={item.id_menu}
            >
              <td class="px-6 py-4">{this.state.naama}</td>
              <td class="px-6 py-4">{this.state.total}</td>
            </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>
    );
  }
}
