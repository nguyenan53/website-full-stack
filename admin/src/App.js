import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import React, { createContext, useEffect, useState, useRef } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Products from "./pages/Products";
import Category from "./pages/Category/categoryList";
import ProductDetails from "./pages/ProductDetails";
import ProductUpload from "./pages/Products/addProduct";
import EditProduct from "./pages/Products/editProduct";
import CategoryAdd from "./pages/Category/addCategory";
import EditCategory from "./pages/Category/editCategory";
import SubCatAdd from "./pages/Category/addSubCat";
import SubCatList from "./pages/Category/subCategoryList";
import AddProductRAMS from "./pages/Products/addProductRAMS";
import ProductWeight from "./pages/Products/addProductWeight";
import ProductSize from "./pages/Products/addProductSize";
import Orders from "./pages/Orders";
import AddHomeBannerSlide from "./pages/HomeBanner/addHomeSlide";
import HomeBannerSlideList from "./pages/HomeBanner/homeSlideList";
import EditHomeBannerSlide from "./pages/HomeBanner/editSlide";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import LoadingBar from "react-top-loading-bar";
import { fetchDataFromApi } from "./utils/api";

import axios from "axios";
import BannersList from "./pages/Banners/bannerList";
import AddBanner from "./pages/Banners/addHomeBanner";
import EditBanner from "./pages/Banners/editHomeBanner";

import HomeSideBannersList from "./pages/HomeSideBanners/bannerList";
import AddHomeSideBanner from "./pages/HomeSideBanners/addHomeSideBanner";
import EditHomeSideBanner from "./pages/HomeSideBanners/editHomeSideBanner";

import HomeBottomBannersList from "./pages/HomeBottomBanners/bannerList";
import AddHomeBottomBanner from "./pages/HomeBottomBanners/addHomeBottomBanner";
import EditHomeBottomBanner from "./pages/HomeBottomBanners/editHomeBottomBanner";
import MyAccount from "./pages/MyAccount";
import VerifyAccount from "./pages/OtpVerify";

const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [catData, setCatData] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });
  const [categoryData, setCategoryData] = useState([]);
  const [isOpenNav, setIsOpenNav] = useState(false);

  const [baseUrl, setBaseUrl] = useState("http://localhost:4000");

  const [progress, setProgress] = useState(0);
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });

  const [selectedLocation, setSelectedLocation] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState("");

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);


//   useEffect(() => {
//     const handleContextmenu = e => {
//         e.preventDefault()
//     }
//     document.addEventListener('contextmenu', handleContextmenu)
//     return function cleanup() {
//         document.removeEventListener('contextmenu', handleContextmenu)
//     }
// }, [ ])

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);

      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }, [isLogin, localStorage.getItem("user")]);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

  const countryListArr = [];
  
  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      
      if (res !== null) {
        //console.log(res.data.data);
        res.data.data.map((item, index) => {
          countryListArr.push({
            value:item?.iso2,
            label:item?.country,
          });
          //console.log(item.country)
        });


       
        setCountryList(countryListArr);

        //console.log(res.data.data[0].country)
      }

    });
  };


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  useEffect(() => {
    setProgress(20);
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res);
      setProgress(100);
    });
  };

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    setUser,
    user,
    countryList,
    selectedCountry,
    setselectedCountry,
    windowWidth,
    openNav,
    setIsOpenNav
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
        />

        <Snackbar
          open={alertBox.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            autoHideDuration={6000}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>

        {isHideSidebarAndHeader !== true && <Header />}
        <div className="main d-flex">
          {isHideSidebarAndHeader !== true && (
            <>
              <div
                className={`sidebarOverlay d-none ${
                  isOpenNav === true && "show"
                }`}
                onClick={() => setIsOpenNav(false)}
              ></div>
              <div
                className={`sidebarWrapper ${
                  isToggleSidebar === true ? "toggle" : ""
                } ${isOpenNav === true ? "open" : ""}`}
              >
                <Sidebar />
              </div>
            </>
          )}

          <div
            className={`content ${isHideSidebarAndHeader === true && "full"} ${
              isToggleSidebar === true ? "toggle" : ""
            }`}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/product/details/:id"
               
                element={<ProductDetails />}
              />
              <Route
                path="/product/upload"
               
                element={<ProductUpload />}
              />
              <Route
                path="/product/edit/:id"
               
                element={<EditProduct />}
              />
              <Route path="/category" element={<Category />} />
              <Route
                path="/category/add"
               
                element={<CategoryAdd />}
              />
              <Route
                path="/category/edit/:id"
               
                element={<EditCategory />}
              />
              <Route
                path="/subCategory/"
               
                element={<SubCatList />}
              />
              <Route
                path="/subCategory/add"
               
                element={<SubCatAdd />}
              />
              <Route
                path="/productRAMS/add"
               
                element={<AddProductRAMS />}
              />
              <Route
                path="/productWEIGHT/add"
               
                element={<ProductWeight />}
              />
              <Route
                path="/productSIZE/add"
               
                element={<ProductSize />}
              />
              <Route path="/orders/" element={<Orders />} />
              <Route
                path="/homeBannerSlide/add"
               
                element={<AddHomeBannerSlide />}
              />
              <Route
                path="/homeBannerSlide/list"
               
                element={<HomeBannerSlideList />}
              />
              <Route
                path="/homeBannerSlide/edit/:id"
               
                element={<EditHomeBannerSlide />}
              />

              <Route path="/banners" element={<BannersList />} />
              <Route path="/banners/add" element={<AddBanner />} />
              <Route
                path="/banners/edit/:id"
               
                element={<EditBanner />}
              />

              <Route path="/homeSideBanners" element={<HomeSideBannersList />} />
              <Route path="/homeSideBanners/add" element={<AddHomeSideBanner />} />
              <Route
                path="/homeSideBanners/edit/:id"
               
                element={<EditHomeSideBanner />}
              />

              <Route path="/homeBottomBanners" element={<HomeBottomBannersList />} />
              <Route path="/homeBottomBanners/add" element={<AddHomeBottomBanner />} />
              <Route
                path="/homeBottomBanners/edit/:id"
               
                element={<EditHomeBottomBanner />}
              />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/verify-account" element={<VerifyAccount />} />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
