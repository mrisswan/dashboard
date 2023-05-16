import React from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import $ from "jquery";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

export default class User extends React.Component {
  constructor() {
    super();
    this.state = {
      detail_transaksi: [],
      transaksiBelumBayar: [],
      transaksiLunas: [],
      makanan: [],
      minuman: [],
      menu: [],
      meja: [],
      menus: [],
      cart: [],
      nomor_meja: "",
      token: "",
      id_transaksi: 0,
      status: "",
      total: 0,
    };
    let user = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("token") && user.role == "kasir") {
      this.state.token = localStorage.getItem("token");
    } else {
      window.alert("Anda tidak terdaftar sebagai kasir");
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
  AddDetail = (value) => {
    axios
      .get(
        "http://localhost:4040/cafe/menu/" + value.id_menu,
        this.headerConfig()
      )
      .then((res) => {
        if (this.state.cart.length === 0) {
          const keranjang = {
            id_transaksi: this.state.id_transaksi,
            id_menu: value.id_menu,
            qty: 1,
          };
          this.state.cart.push(keranjang);
          this.state.menus.push(res.data.data);
          let harga = this.state.menus.find(
            (item) => item.id_menu === value.id_menu
          ).harga;
          this.setState({ totalBayar: harga });
        } else if (
          this.state.cart.find((item) => item.id_menu === value.id_menu)
        ) {
          this.state.cart.find((item) => item.id_menu === value.id_menu).qty++;
          let harga = this.state.menus.find(
            (item) => item.id_menu === value.id_menu
          ).harga;
          this.setState({ totalBayar: this.state.totalBayar + harga });
        } else if (
          this.state.cart.find((item) => item.id_menu !== value.id_menu)
        ) {
          const keranjang = {
            id_transaksi: this.state.id_transaksi,
            id_menu: value.id_menu,
            qty: 1,
          };
          this.state.cart.push(keranjang);
          this.state.menus.push(res.data.data);
          let harga = this.state.menus.find(
            (item) => item.id_menu === value.id_menu
          ).harga;
          this.setState({ totalBayar: this.state.totalBayar + harga });
        }
        this.setState({
          cart: this.state.cart,
          menus: this.state.menus,
        });
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
            var harga = this.state.menus.find(
              (item) => item.id_menu === value.id_menu
            ).harga;
            this.setState({ totalBayar: this.state.totalBayar - harga });
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

  getMeja = () => {
    let url = "http://localhost:4040/cafe/meja/";
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

  getMenu = () => {
    let url = "http://localhost:4040/cafe/menu/";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ menu: response.data.data });
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

  getTransaksiBelumBayar = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    let url =
      "http://localhost:4040/cafe/transaksi/riwayat/belum_bayar/" +
      user.id_user;
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ transaksiBelumBayar: response.data.data });
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

  // getNama = () => {
  //     let user = JSON.parse(localStorage.getItem('user'))
  //     if(user.nama_user !== null){
  //         return user.nama_user
  //     }else{
  //         return "tidak ada"
  //     }
  // }

  getTransaksiLunas = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    let url =
      "http://localhost:4040/cafe/transaksi/riwayat/lunas/" + user.id_user;
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ transaksiLunas: response.data.data });
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
    if (selectedItem.status === "belum_bayar") {
      $("#submit").show();
    } else {
      $("#submit").hide();
    }
  };

  getQtyModal(itemId) {
    const item = this.state.detail_transaksi.find(
      (item) => item.id_menu === itemId
    );
    return item ? item.qty : 0;
  }

  getHargaModal(itemId) {
    const item = this.state.detail_transaksi.find(
      (item) => item.id_menu === itemId
    );
    const menu = this.state.detail_transaksi.find(
      (item) => item.id_menu === itemId
    ).menu;
    return item ? menu.harga * item.qty : 0;
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

  Edit = (selectedItem) => {
    const printContents = document.getElementById("nota").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    let sendData = {
      id_transaksi: selectedItem.id_transaksi,
      status: "lunas",
    };
    let data = {
      id_meja: selectedItem.id_meja,
      status_meja: "tersedia",
    };
    axios.put(
      "http://localhost:4040/cafe/transaksi/",
      sendData,
      this.headerConfig()
    );
    axios
      .put("http://localhost:4040/cafe/meja/", data, this.headerConfig())
      .then((response) => {
        window.alert(response.data.message);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  pesanLagi = (value) => {
    $("#tambah").show();
    $("#history").hide();
    this.setState({
      id_transaksi: value.id_transaksi,
    });
  };
  batalPesan = () => {
    window.location.reload();
  };

  componentDidMount() {
    this.getMeja();
    this.getMenu();
    this.getTransaksiBelumBayar();
    this.getTransaksiLunas();
    this.getMakanan();
    this.getMinuman();
  }

  convertTime = (time) => {
    let date = new Date(time);
    return `${date.getDate()}/${
      Number(date.getMonth()) + 1
    }/${date.getFullYear()}`;
  };
  close = () => {
    $("#modal_detail").hide();
    this.state.total = 0;
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
  closeTransaksi = () => {
    $("#modal_transaksi").hide();
  };

  pesananBaru = () => {
    $("#modal_transaksi").show();
  };
  simpan = () => {
    let sendData = {
      detail_transaksi: this.state.cart,
    };
    let url = "http://localhost:4040/cafe/transaksi/detail/add";
    axios
      .post(url, sendData, this.headerConfig())
      .then((response) => {
        window.alert(response.data.message);
        window.location = "/kasir/riwayat";
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div class="p-4 sm:ml-64">
        <Sidebar />
        <div
          id="tambah"
          class="hidden relative overflow-x-auto shadow-md sm:rounded-lg m-2 mt-20"
        >
          <div className="flex justify-between items-center mb-1">
            <h2 className="dark:text-white text-xl font-sans ml-3">
              Daftar Menu
            </h2>
            <div>
              <button
                className="hover:bg-green-500 mr-3 bg-green-600 text-white font-bold uppercase text-xs py-3 px-3 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={() => this.simpan()}
              >
                Pesan
              </button>
              <button
                className="hover:bg-red-500 mr-3 bg-red-600 text-white font-bold uppercase text-xs py-3 px-3 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={() => this.batalPesan()}
              >
                Batal
              </button>
            </div>
          </div>
          <hr></hr>
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
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg m-2">
            <div className="flex justify-between items-center">
              <h2 className="dark:text-black text-xl font-sans ml-3">
                Riwayat transaksi
              </h2>
            </div>
            <br />
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                Belum Bayar
              </caption>
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Nama Pelanggan
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Alamat Pelanggan
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Nomor Meja
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Tanggal transaksi
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Jenis Pesanan
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.transaksiBelumBayar.map((item) => (
                  <tr
                    class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={item.id_transaksi}
                  >
                    <td class="px-6 py-4">{item.nama_pelanggan}</td>
                    <td class="px-6 py-4">{item.alamat_pelanggan}</td>
                    <td class="px-6 py-4">{this.getNomorMeja(item)}</td>
                    <td class="px-6 py-4">
                      {this.convertTime(item.tgl_transaksi)}
                    </td>
                    <td class="px-6 py-4">{item.jenis_pesanan}</td>
                    <td class="px-6 py-4">{item.status}</td>
                    <td class="px-2 py-4 text-center flex justify-evenly">
                      <button
                        className="hover:bg-green-500 flex justify-center bg-green-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => this.getDetail(item)}
                      >
                        <AiOutlineCheck />
                      </button>
                      <button
                        className="hover:bg-green-500 flex justify-center bg-green-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => this.pesanLagi(item)}
                      >
                        <AiOutlinePlus />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br></br>
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                Lunas
              </caption>
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Nama Pelanggan
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Alamat Pelanggan
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Nomor Meja
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Tanggal transaksi
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Jenis Pesanan
                  </th>
                  <th scope="col" class="px-6 py-3 ">
                    Status
                  </th>
                  {/* <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.transaksiLunas.map((item) => (
                  <tr
                    class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => this.getDetail(item)}
                    key={item.id_transaksi}
                  >
                    <td class="px-6 py-4">{item.nama_pelanggan}</td>
                    <td class="px-6 py-4">{item.alamat_pelanggan}</td>
                    <td class="px-6 py-4">{this.getNomorMeja(item)}</td>
                    <td class="px-6 py-4">
                      {this.convertTime(item.tgl_transaksi)}
                    </td>
                    <td class="px-6 py-4">{item.jenis_pesanan}</td>
                    <td class="px-6 py-4">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                  Detail transaksi
                </h3>
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
                    {this.state.detail_transaksi.map((item) => (
                      <tr
                        class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={item.id_detail_transaksi}
                      >
                        <td class="px-6 py-4">{item.menu.nama_menu}</td>
                        <td class="px-6 py-4">
                          {this.convertToRupiah(item.menu.harga)}
                        </td>
                        <td class="px-6 py-4">
                          {this.getQtyModal(item.id_menu)}
                        </td>
                        <td class="px-6 py-4">
                          {this.convertToRupiah(
                            this.getHargaModal(item.id_menu)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-100 p-2 border-2 mb-2 hover:bg-gray-200">
                  <p className="font-sans text-gray-700">
                    Total Bayar: {this.convertToRupiah(this.totalBayar())}
                  </p>
                </div>
                {this.state.transaksiBelumBayar.map((item) => (
                  <div className="hidden" id="submit">
                    <button
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                      onClick={() => this.Edit(item)}
                    >
                      Sudah Bayar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NOTA */}
        <div
          class="relative h-auto bg-white rounded-lg shadow dark:bg-gray-700 w-auto hidden"
          id="nota"
        >
          <a
            href="#"
            class="flex items-center justify-center m-6 text-2xl font-semibold text-gray-600"
          >
            {/* <img class="w-8 h-8 mr-2" src={logo} alt="logo" /> */}
            {/* Wiku Cafe Shop */}
          </a>
          <hr></hr>
          <div class="px-6 py-3">
            <h3 class="text-xl font-medium mb-4 text-gray-900 dark:text-white">
              Informasi Kontak
            </h3>
            <label class="block font-bold">
              Alamat:
              <p className="font-sans text-gray-700">
                Jl.Merpati No.69 Sawojajar, Kedungkandang, Kota Malang
              </p>
            </label>

            <label class="block font-bold">
              Email:
              <p className="font-sans text-gray-700">wikucafe69@gmail.com</p>
            </label>

            <label class="block font-bold">
              Telepon:
              <p className="font-sans text-gray-700">085479887665</p>
            </label>
          </div>
          <hr></hr>
          <div class="px-6 py-3">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-900 dark:text-gray-400">
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
                    Harga
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
                    <td class="px-6 py-4">
                      {this.convertToRupiah(item.menu.harga)}
                    </td>
                    <td class="px-6 py-4">{this.getQtyModal(item.id_menu)}</td>
                    <td class="px-6 py-4">
                      {this.convertToRupiah(this.getHargaModal(item.id_menu))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-gray-100 p-2 mb-2 hover:bg-gray-200">
              <p className="font-sans text-gray-700">
                Total: {this.convertToRupiah(this.totalBayar())}
              </p>
            </div>
          </div>
          <hr></hr>
          <div class="px-6 py-3 text-center">
            <h3 class="text-xl font-medium mb-4 text-gray-900 dark:text-white">
              Terima Kasih
            </h3>
            <p className="font-sans text-gray-700">
              Jangan lupa kembali ke Wiku Cafe
            </p>
            <p className="font-serif text-sm text-gray-700">
              Password Wifi: wikucafe69
            </p>
            <label class="block font-bold mt-4">
              <p className="font-sans text-gray-700">Selamat Menikmati</p>
            </label>
          </div>
        </div>
      </div>
    );
  }
}
