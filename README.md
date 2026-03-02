# website-full-stack

## 1) Tổng quan dự án

Đây là dự án ecommerce full-stack theo kiến trúc MERN, gồm 4 phần chính:

- **Client (User Website):** React 18 + Bootstrap + MUI
- **Admin Panel:** React (quản lý sản phẩm, banner, category, upload ảnh, stock, featured)
- **Backend API:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **Cloud Storage:** Cloudinary (upload và quản lý ảnh)

---

## 2) Kiến trúc hệ thống

### Frontend (Client)

- Hiển thị danh sách sản phẩm
- Lọc theo category/subcategory
- Lọc theo giá, rating
- Hiển thị sản phẩm nổi bật (featured)
- Recently viewed
- Banner động
- Responsive + Swiper slider
- Gọi API theo base URL:
  - `process.env.REACT_APP_BASE_URL + /api/...`

### Admin Panel

Chức năng chính:

- CRUD sản phẩm
- CRUD banner
- Quản lý category
- Quản lý stock
- Đánh dấu sản phẩm featured
- Upload ảnh

Luồng upload:

1. Admin upload file
2. Multer lưu tạm local (`uploads/`)
3. Cloudinary nhận file
4. MongoDB lưu `secure_url`

### Backend (Node.js + Express)

Các route chính:

- `/api/products`
- `/api/category`
- `/api/homeBanner`
- `/api/banners`
- `/api/homeSideBanners`
- `/api/homeBottomBanners`

Middleware/thành phần quan trọng:

- `multer` (upload local)
- `cloudinary` SDK (upload cloud)
- `mongoose` (schema + model)

---

## 3) Database (MongoDB Atlas)

Các bước chuẩn:

1. Tạo cluster
2. Tạo database user
3. Lấy connection string
4. Cấu hình `.env`

Ví dụ:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

## 4) Cloudinary

Dùng cho:

- Upload ảnh sản phẩm
- Upload ảnh banner
- Xóa ảnh khi xóa sản phẩm/banner

Luồng chuẩn:

`Multer -> cloudinary.uploader.upload -> nhận secure_url -> lưu MongoDB`

Ví dụ xử lý đúng:

```js
const result = await cloudinary.uploader.upload(path);
imagesArr.push(result.secure_url);
```

---

## 5) Các lỗi từng gặp và cách xử lý

- **React version conflict**
  - `react-swipeable-views` yêu cầu React 17
  - Hướng xử lý: cài bằng `--legacy-peer-deps`

- **`slice/map is not a function`**
  - API trả object thay vì array
  - Hướng xử lý: truy cập đúng field dữ liệu (vd: `.products`)

- **`Cannot read filter of undefined`**
  - Categories chưa load xong
  - Hướng xử lý: default `[]` trước khi filter/map

- **Cloudinary `secure_url` undefined**
  - Sai callback + `await`
  - Hướng xử lý: dùng `await cloudinary.uploader.upload(...)`

- **`Unknown API key` / `Invalid cloud_name`**
  - Sai format ENV (thừa dấu cách, dấu `=`, copy sai)
  - Hướng xử lý: kiểm tra lại biến môi trường và giá trị chính xác

---

## 6) Hiện trạng hệ thống

- ✅ MongoDB đã kết nối
- ✅ Server chạy cổng 8000
- ✅ Client/Admin đã cài dependencies
- ✅ Upload không còn crash server
- ⚠️ Thỉnh thoảng còn API 500 do cấu hình Cloudinary

---

## 7) Kiến trúc dữ liệu sản phẩm

Một product điển hình gồm:

- `name`
- `description`
- `images` (array URL)
- `brand`
- `price`
- `oldPrice`
- `category`
- `catId`
- `subCatId`
- `rating`
- `isFeatured`
- `stock`
- `location`

---

## 8) Mục tiêu tiếp theo (production-ready)

- Fix triệt để luồng upload Cloudinary
- Thêm `try/catch` cho tất cả route
- Chuẩn hóa API response (luôn trả object có cấu trúc nhất quán)
- Thêm validation middleware
- Tách upload service riêng
- Thêm `.env` validation
- Deploy (Render / Railway / VPS)

---

## Kết luận

Đây là một template ecommerce MERN đầy đủ, có:

- Frontend React hiện đại
- Backend REST API rõ ràng
- MongoDB Atlas làm data layer
- Cloudinary cho media storage
- Admin panel để quản trị nội dung và sản phẩm

Dự án đã có nền tảng tốt để phát triển thành hệ thống production nếu tiếp tục chuẩn hóa upload, validation và error handling.

---


## 9) Cài đặt nhanh sau khi pull code mới

Vì project tách thành 3 app (`client`, `admin`, `server`), bạn phải cài thư viện trong từng thư mục con:

```bash
cd client && npm install --legacy-peer-deps
cd ../admin && npm install --legacy-peer-deps
cd ../server && npm install
```

> Root hiện không có dependencies chạy app (`package.json` ở root đang rỗng), nên không cần `npm install` ở thư mục gốc.

### Sửa lỗi `Cannot find module 'express'`

Lỗi này xảy ra khi bạn chạy `npm start` trong `server` nhưng chưa cài dependencies cho `server`.

Làm theo thứ tự:

```bash
cd server
npm install
npm start
```

Nếu vẫn lỗi, xóa cache và cài lại sạch:

```bash
cd server
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

### Lưu ý phiên bản Node

Project đang dùng stack package thiên về Node LTS. Nếu bạn dùng Node quá mới (ví dụ v24), có thể gặp lỗi tương thích ở một số package native.

Khuyến nghị:

- Dùng **Node 20 LTS** (hoặc 18 LTS)
- Kiểm tra bằng: `node -v`

