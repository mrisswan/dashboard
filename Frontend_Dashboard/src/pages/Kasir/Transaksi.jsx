import React from "react";
import $ from "jquery";
import axios from "axios";
import Sidebar from "./Sidebar";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

export default class Transaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      makanan: [],
      minuman: [],
      // menu: [],
      meja: [],
      menus: [],
      action: "",
      token: "",
      id_transaksi: 0,
      tgl_transaksi: "",
      id_user: 0,
      id_meja: 0,
      nama_pelanggan: "",
      alamat_pelanggan: "",
      status: "",
      jenis_pesanan: "",
      cart: [],
      totalBayar: 0,
    };
    let user = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("token") && user.role == "kasir") {
      this.state.token = localStorage.getItem("token");
    } else {
      window.alert("Maaf, anda tiddak terdaftar sebagai kasir:(");
      window.location = "/";
    }
  }

  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    return header;
  };

  getMakanan = () => {
    let url = "http://localhost:4040/cafe/menu/jenis/makanan";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ makanan: response.data.data });
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

  getMinuman = () => {
    let url = "http://localhost:4040/cafe/menu/jenis/minuman";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ minuman: response.data.data });
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

  getMeja = () => {
    let url = "http://localhost:4040/cafe/meja/status/tersedia";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ meja: response.data.data });
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

  Add = () => {
    $("#modal_transaksi").show();
    let user = JSON.parse(localStorage.getItem("user"));
    this.setState({
      id_transaksi: 0,
      tgl_transaksi: "",
      id_meja: 0,
      id_user: user.id_user,
      nama_pelanggan: "",
      alamat_pelanggan: "",
      status: "belum_bayar",
      jenis_pesanan: "",
    });
  };
  AddDetail = (value) => {
    axios
      .get(
        "http://localhost:4040/cafe/menu/" + value.id_menu,
        this.headerConfig()
      )
      .then((res) => {
        if (this.state.cart.length === 0) {
          const keranjang = {
            id_menu: value.id_menu,
            qty: 1,
          };
          this.state.cart.push(keranjang);
          this.state.menus.push(res.data.data);
          var harga1 = this.state.menus.find(
            (item) => item.id_menu === value.id_menu
          ).harga;
          this.setState({ totalBayar: harga1 });
        } else if (
          this.state.cart.find((item) => item.id_menu === value.id_menu)
        ) {
          this.state.cart.find((item) => item.id_menu === value.id_menu).qty++;
          var harga2 = this.state.menus.find(
            (item) => item.id_menu === value.id_menu
          ).harga;
          this.setState({ totalBayar: this.state.totalBayar + harga2 });
        } else if (
          this.state.cart.find((item) => item.id_menu !== value.id_menu)
        ) {
          const keranjang = {
            id_menu: value.id_menu,
            qty: 1,
          };
          this.state.cart.push(keranjang);
          this.state.menus.push(res.data.data);
          var harga = this.state.menus.find(
            (item) => item.id_menu === value.id_menu
          ).harga;
          this.setState({ totalBayar: this.state.totalBayar + harga });
        }
        this.setState({
          cart: this.state.cart,
          menus: this.state.menus,
        });
        console.log(this.state.menus);
      })
      .catch((error) => console.log(error));
  };

  handleMinus = (value) => {
    axios
      .get(
        "http://localhost:4040/cafe/menu/" + value.id_menu,
        this.headerConfig()
      )

      .then((res) => {
        let i = this.state.cart.indexOf();
        let a = this.state.menus.indexOf();
        if (this.state.cart.length === 0) {
          window.alert("Belum ada yang dipesan");
        } else if (
          this.state.cart.find((item) => item.id_menu === value.id_menu)
        ) {
          if (this.state.cart.find((item) => item.qty > 0)) {
            this.state.cart.find((item) => item.id_menu === value.id_menu)
              .qty--;
          } else {
            window.alert("Belum ada yang dipesan");
          }
        } else if (
          this.state.cart.find((item) => item.id_menu !== value.id_menu)
        ) {
          window.alert("Belum ada yang dipesan");
        }
        this.state.cart.find((item) => item.qty === 0)
          ? this.state.cart.splice(i) && this.state.menus.splice(a)
          : console.log("lanjut");
        console.log(this.state.cart);
        this.setState({
          cart: this.state.cart,
          menus: this.state.menus,
        });
      })
      .catch((error) => console.log(error));
  };

  getQty(itemId) {
    const item = this.state.cart.find((item) => item.id_menu === itemId);
    return item ? item.qty : 0;
  }
  getHarga(itemId) {
    const item = this.state.cart.find((item) => item.id_menu === itemId);
    const menu = this.state.menus.find((item) => item.id_menu === itemId);
    return item ? menu.harga * item.qty : 0;
  }

  saveTransaksi = (event) => {
    event.preventDefault();
    $("#modal_transaksi").show();
    let sendDataDitempat = {
      id_transaksi: this.state.id_transaksi,
      tgl_transaksi: this.state.tgl_transaksi,
      id_user: this.state.id_user,
      id_meja: this.state.id_meja,
      nama_pelanggan: this.state.nama_pelanggan,
      alamat_pelanggan: this.state.alamat_pelanggan,
      status: this.state.status,
      jenis_pesanan: this.state.jenis_pesanan,
      detail_transaksi: this.state.cart,
    };
    let sendDataBungkus = {
      id_transaksi: this.state.id_transaksi,
      tgl_transaksi: this.state.tgl_transaksi,
      id_user: this.state.id_user,
      id_meja: null,
      nama_pelanggan: this.state.nama_pelanggan,
      alamat_pelanggan: this.state.alamat_pelanggan,
      status: this.state.status,
      jenis_pesanan: this.state.jenis_pesanan,
      detail_transaksi: this.state.cart,
    };
    let data = {
      id_meja: this.state.id_meja,
      status_meja: "tidak_tersedia",
    };
    let url = "http://localhost:4040/cafe/transaksi";
    if (this.state.jenis_pesanan === "ditempat") {
      axios
        .post(url, sendDataDitempat, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          axios.put(
            "http://localhost:4040/cafe/meja/",
            data,
            this.headerConfig()
          );
          window.location = "/kasir/riwayat";
          this.getMenu();
        })
        .catch((error) => console.log(error));
    } else if (this.state.jenis_pesanan === "bungkus") {
      axios
        .post(url, sendDataBungkus, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          window.location = "/kasir/riwayat";
          this.getMenu();
        })
        .catch((error) => console.log(error));
    }
    $("#modal_transaksi").hide();
  };
  dropTransaksi = (selectedItem) => {
    if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
      let url =
        "http://localhost:4040/cafe/transaksi/" + selectedItem.id_transaksi;
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getMenu();
        })
        .catch((error) => console.log(error));
    }
  };
  bind = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.getMakanan();
    this.getMinuman();
    this.getMeja();
  }
  close = () => {
    $("#modal_transaksi").hide();
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
  //mengedit adar nomor meja tidak tampil saat customer "dibungkus"
  nomorMejaShow = () => {
    if (this.state.jenis_pesanan === "ditempat") {
      $("#meja").show();
    } else {
      $("#meja").hide();
    }
  };

  render() {
    return (
      <div class="p-4 sm:ml-64">
        <Sidebar />
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div class=" relative overflow-x-auto shadow-md sm:rounded-lg m-2 ">
            <h2 className="dark:text-black mb-6 text-xl font-sans ml-3 mt-1">
              Daftar Menu
              <button
                className="hover:bg-green-500 float-right mr-3 bg-green-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={() => this.Add()}
              >
                Pesan
              </button>
            </h2>
            <h2 className="dark:text-white mt-2 text-xl font-serif ml-3">
              Daftar Minuman
            </h2>
            <div className="grid grid-cols-4">
              {this.state.minuman.map((item) => (
                <div
                  class="max-w-sm bg-white border m-3 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  key={item.id_menu}
                >
                  <img
                    class="rounded-t-lg"
                    src={`http://localhost:4040/img/${item.gambar}`}
                    alt="gambar"
                  />
                  <div class="p-5">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.nama_menu}
                    </h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      Jenis: {item.jenis}
                    </p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      Deskripsi: {item.deskripsi}
                    </p>
                    <p class="mb-6 font-normal text-gray-700 dark:text-gray-400">
                      Harga: {this.convertToRupiah(item.harga)}
                    </p>

                    <button
                      type="button"
                      onClick={() => this.handleMinus(item)}
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <HiOutlineMinus>
                        <span class="sr-only">Kurang</span>
                      </HiOutlineMinus>
                    </button>
                    <button
                      type="button"
                      onClick={() => this.AddDetail(item)}
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <HiOutlinePlus>
                        <span class="sr-only">Tambah</span>
                      </HiOutlinePlus>
                    </button>
                    <div class="relative float-right inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-700">
                      <span class="font-medium text-gray-200 ">
                        {this.getQty(item.id_menu)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="dark:text-white mt-2 text-xl font-serif ml-3">
              Daftar Makanan
            </h2>
            <div className="grid grid-cols-4">
              {this.state.makanan.map((item) => (
                <div
                  class="max-w-sm bg-white border m-3 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  key={item.id_menu}
                >
                  <img
                    class="rounded-t-lg"
                    src={`http://localhost:4040/img/${item.gambar}`}
                    alt="gambar"
                  />
                  <div class="p-5">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.nama_menu}
                    </h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      Jenis: {item.jenis}
                    </p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      Deskripsi: {item.deskripsi}
                    </p>
                    <p class="mb-6 font-normal text-gray-700 dark:text-gray-400">
                      Harga: {this.convertToRupiah(item.harga)}
                    </p>

                    <button
                      type="button"
                      onClick={() => this.handleMinus(item)}
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <HiOutlineMinus>
                        <span class="sr-only">Kurang</span>
                      </HiOutlineMinus>
                    </button>
                    <button
                      type="button"
                      onClick={() => this.AddDetail(item)}
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <HiOutlinePlus>
                        <span class="sr-only">Tambah</span>
                      </HiOutlinePlus>
                    </button>
                    <div class="relative float-right inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-700">
                      <span class="font-medium text-gray-200 ">
                        {this.getQty(item.id_menu)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Modal */}
        <div
          id="modal_transaksi"
          tabindex="-1"
          aria-hidden="true"
          class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div class="flex lg:h-auto w-auto justify-center ">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-auto">
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
                <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                  transaksi
                </h3>
                <div class="space-y-6">
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          Nama Menu
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Harga
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Jumlah
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Total Harga
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.menus.map((item) => (
                        <tr
                          class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          key={item.id_menu}
                        >
                          <td class="px-6 py-4">{item.nama_menu}</td>
                          <td class="px-6 py-4">
                            {this.convertToRupiah(item.harga)}
                          </td>
                          <td class="px-6 py-4">{this.getQty(item.id_menu)}</td>
                          <td class="px-6 py-4">
                            {this.convertToRupiah(this.getHarga(item.id_menu))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-gray-100 p-2 border-2 hover:bg-gray-200">
                    <p className="font-sans text-gray-700">
                      Total Bayar: {this.convertToRupiah(this.state.totalBayar)}
                    </p>
                  </div>
                </div>
                <form
                  class="space-y-6 mt-6"
                  onSubmit={(event) => this.saveTransaksi(event)}
                >
                  <div>
                    <label
                      for="nama_pelanggan"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nama Pelanggan
                    </label>
                    <input
                      type="text"
                      name="nama_pelanggan"
                      id="nama_pelanggan"
                      value={this.state.nama_pelanggan}
                      onChange={this.bind}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Masukkan nama pelanggan"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="alamat_pelanggan"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Alamat Pelanggan
                    </label>
                    <input
                      type="text"
                      name="alamat_pelanggan"
                      id="alamat_pelanggan"
                      value={this.state.alamat_pelanggan}
                      onChange={this.bind}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Masukkan kota pelanggan"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="jenis"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Jenis Pesanan
                    </label>
                    <select
                      onClick={() => this.nomorMejaShow()}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Jenis Pesanan"
                      name="jenis_pesanan"
                      value={this.state.jenis_pesanan}
                      onChange={this.bind}
                      required
                    >
                      <option value="">Pilih Jenis Pesanan</option>
                      <option value="ditempat">Makan Ditempat</option>
                      <option value="bungkus">Dibungkus</option>
                    </select>
                  </div>

                  <div className="hidden modal" aria-hidden="true" id="meja">
                    <label
                      for="jenis"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Meja
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Jenis Pesanan"
                      name="id_meja"
                      value={this.state.id_meja}
                      onChange={this.bind}
                    >
                      <option value="">Pilih Meja</option>
                      {this.state.meja.map((item) => (
                        <option value={item.id_meja}>
                          {item.nomor_meja}: {item.status_meja}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
