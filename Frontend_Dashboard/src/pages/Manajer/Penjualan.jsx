import React from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import $ from "jquery";

export default class User extends React.Component {
  constructor() {
    super();
    this.state = {
      token: "",
      nama_user: "",
      alamat_pelanggan: "",
      data: [],
      total: 0,
      pendapatan: 0,
      transaksi: [],
      detail_transaksi: [],
      detail: [],
      awal: "",
      akhir: "",
    };
    let user = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("token") && user.role === "manajer") {
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

  getTransaksi = () => {
    let url = "http://localhost:4040/cafe/transaksi/";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ transaksi: response.data.data });
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

  getTransaksiUser = (event) => {
    event.preventDefault();
    if (this.state.nama_user === "") {
      let url = "http://localhost:4040/cafe/transaksi/";
      axios
        .get(url, this.headerConfig())
        .then((response) => {
          this.setState({ transaksi: response.data.data });
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
    } else {
      let url =
        "http://localhost:4040/cafe/transaksi/user/" + this.state.nama_user;
      axios
        .get(url, this.headerConfig())
        .then((response) => {
          this.setState({ transaksi: response.data.data });
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
    }
  };

  getUserWilayah = (event) => {
    event.preventDefault();
    if (this.state.alamat_pelanggan === "") {
      let url = "http://localhost:4040/cafe/transaksi/";
      axios
        .get(url, this.headerConfig())
        .then((response) => {
          this.setState({ transaksi: response.data.data });
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
    } else {
      let url =
        "http://localhost:4040/cafe/transaksi/wilayah/" + this.state.alamat_pelanggan;
      axios
        .get(url, this.headerConfig())
        .then((response) => {
          this.setState({ transaksi: response.data.data });
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
    }
  };

  getTransaksiTanggal = (event) => {
    event.preventDefault();
    if (this.state.awal === "" || this.state.akhir === "") {
      let url = "http://localhost:4040/cafe/transaksi/";
      axios
        .get(url, this.headerConfig())
        .then((response) => {
          this.setState({ transaksi: response.data.data });
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
    } else {
      let url = `http://localhost:4040/cafe/transaksi/tanggal/${this.timeAwal(
        this.state.awal
      )}/${this.timeAkhir(this.state.akhir)}`;
      axios
        .get(url, this.headerConfig())
        .then((response) => {
          this.setState({ transaksi: response.data.data });
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
    }
  };

  getDetail = (selectedItem) => {
    $("#modal_detail").show();
    let url =
      "http://localhost:4040/cafe/transaksi/detail/" +
      selectedItem.id_transaksi;
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ detail_transaksi: response.data.data });
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

  convertToRupiah(number) {
    if (number) {
      var rupiah = "";

      var numberrev = number

        .toString()

        .split("")

        .reverse()

        .join("");

      for (var i = 0; i < numberrev.length; i++)
        if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";

      return (
        "Rp. " +
        rupiah

          .split("", rupiah.length - 1)

          .reverse()

          .join("")
      );
    } else {
      return number;
    }
  }

  totalBayar = () => {
    for (let i = 0; i < this.state.detail_transaksi.length; i++) {
      var harga = this.state.detail_transaksi[i].menu.harga;
      var qty = this.state.detail_transaksi[i].qty;
      var subTotal = harga * qty;
      this.state.total = this.state.total + subTotal;
    }
    let totalBayar = this.state.total;
    return totalBayar;
  };

  pendapatan = () => {
    $("#pendapatan").show();
    $("#btn").hide();
    axios
      .get("http://localhost:4040/cafe/transaksi/detail/", this.headerConfig())
      .then((response) => {
        this.setState({ detail: response.data.data });
        for (let i = 0; i < response.data.data.length; i++) {
          var harga = response.data.data[i].menu.harga;
          var qty = response.data.data[i].qty;
          var subTotal = harga * qty;
          this.state.pendapatan = this.state.pendapatan + subTotal;
        }
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

  getNomorMeja = (value) => {
    if (value.id_meja !== null) {
      return value.meja.nomor_meja;
    } else {
      return "tidak ada";
    }
  };

  laporan = () => {
    $("#refresh").hide();
    const printContents = document.getElementById("laporan").innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  };

  componentDidMount() {
    this.getTransaksi();
  }

  timeAwal = (time) => {
    let date = new Date(time);
    return `${date.getFullYear()}-${
      Number(date.getMonth()) + 1
    }-${date.getDate()}`;
  };
  timeAkhir = (time) => {
    let date = new Date(time);
    return `${date.getFullYear()}-${Number(date.getMonth()) + 1}-${
      date.getDate() + 1
    }`;
  };

  convertTime = (time) => {
    let date = new Date(time);
    return `${date.getDate()}-${
      Number(date.getMonth()) + 1
    }-${date.getFullYear()}`;
  };

  bind = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  close = () => {
    $("#modal_detail").hide();
    this.state.total = 0;
  };

  render() {
    return (
      <div class="p-4 sm:ml-64">
        <Sidebar />
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <br />
          <div className="flex justify-between items-center m-4">
            <h2 className="dark:text-black text-lg font-sans">
              Riwayat Penjualan
            </h2>
            <form
              className="sm:w-1/2"
              onSubmit={(event) => this.getTransaksiUser(event)}
            >
              <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Cari
              </label>
              <div className="relative w-96">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Cari dengan nama petugas"
                  name="nama_user"
                  onChange={this.bind}
                />
                <button
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cari
                </button>
              </div>
            </form>
            <form
              className="sm:w-1/2"
              onSubmit={(event) => this.getUserWilayah(event)}
            >
              <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Cari
              </label>
              <div className="relative w-96">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Cari dengan nama petugas"
                  name="nama_user"
                  onChange={this.bind}
                />
                <button
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cari
                </button>
              </div>
            </form>
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                <input
                  onChange={this.bind}
                  name="awal"
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date start"
                />
              </div>
              <span className="mx-4 text-gray-500">Sampai</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                <input
                  onChange={this.bind}
                  name="akhir"
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date end"
                />
              </div>
              <button
                className="ml-2 hover:bg-blue-800 mr-3 bg-blue-700 text-white text-sm py-2 px-4 rounded-lg shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={(event) => this.getTransaksiTanggal(event)}
              >
                Cari
              </button>
            </div>
            <button
              className="float-right mr-3 hover:bg-green-800 bg-green-700 text-white text-sm py-2 px-4 rounded-lg shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={() => this.laporan()}
            >
              Unduh Laporan
            </button>
            <button
              id="btn"
              className="float-right mr-3 hover:bg-green-800 bg-green-700 text-white text-sm py-2 px-4 rounded-lg shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={() => this.pendapatan()}
            >
              Tampilkan Pendapatan
            </button>
          </div>
          {/* </div> */}
          <div id="laporan">
            <h2
              className="dark:text-white text-lg font-sans flex m-2"
              id="refresh"
              onClick={() => window.location.reload()}
            >
              {/* // className="mt-1.5 ml-1.5 hover:cursor-pointer"> */}
              Riwayat Penjualan
              {/* <SlRefresh
                id="refresh"
                onClick={() => window.location.reload()}
                className="mt-1.5 ml-1.5 hover:cursor-pointer"
              ></SlRefresh> */}
            </h2>
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Nama Pelanggan
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Alamat Pelanggan
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Nomor Meja
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Petugas
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Tanggal Pemesanan
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Jenis Pesanan
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.transaksi.map((item) => (
                  <tr
                    class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => this.getDetail(item)}
                    key={item.id_transaksi}
                  >
                    <td class="px-6 py-4">{item.nama_pelanggan}</td>
                    <td class="px-6 py-4">{item.alamat_pelanggan}</td>
                    <td class="px-6 py-4">{this.getNomorMeja(item)}</td>
                    <td class="px-6 py-4">{item.user.nama_user}</td>
                    <td class="px-6 py-4">
                      {this.convertTime(item.tgl_transaksi)}
                    </td>
                    <td class="px-6 py-4">{item.jenis_pesanan}</td>
                    <td class="px-6 py-4">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="bg-gray-100 p-2 border-2 mb-2 justify-between hover:bg-gray-200 items-center hidden"
              id="pendapatan"
            >
              <p className="font-sans text-gray-700">
                Total Pendapatan: {this.convertToRupiah(this.state.pendapatan)}
              </p>
            </div>
            <br></br>
          </div>
        </div>
        {/* Modal */}
        <div
          id="modal_detail"
          tabindex="-1"
          aria-hidden="true"
          class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div class="flex md:h-auto w-auto justify-center ">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-1/3">
              <button
                type="button"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => this.close()}
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Tutup modal</span>
              </button>
              <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                  Detail
                </h3>
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Nama Menu
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.detail_transaksi.map((item) => (
                      <tr
                        class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={item.id_detail_transaksi}
                      >
                        <td class="px-6 py-4">{item.menu.nama_menu}</td>
                        <td class="px-6 py-4">{item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-100 p-2 border-2 mb-2 hover:bg-gray-200">
                  <p className="font-sans text-gray-700">
                    Total Bayar: {this.convertToRupiah(this.totalBayar())}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
