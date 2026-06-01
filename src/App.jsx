import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link, Type, Mail, Phone, MessageSquare, Wifi, Contact, MapPin, Calendar, Upload, RefreshCw, Download, Image as ImageIcon, Copy } from 'lucide-react';

export default function App() {
  // --- STATE QUẢN LÝ TAB ---
  const [activeTab, setActiveTab] = useState('URL');

  // --- STATE QUẢN LÝ TOÀN BỘ DỮ LIỆU NHẬP ---
  const [formData, setFormData] = useState({
    url: 'https://example.com',
    text: '',
    email: '',
    phone: '',
    smsPhone: '',
    smsMsg: '',
    wifiSsid: '',
    wifiPass: '',
    wifiType: 'WPA',
    wifiHidden: false,
    vcardFirst: '',
    vcardLast: '',
    vcardOrg: '',
    vcardPhone: '',
    vcardEmail: '',
    vcardUrl: '',
    vcardAddress: '',
    locLat: '',
    locLng: '',
    eventName: '',
    eventLocation: '',
    eventDesc: ''
  });

  // --- TÙY CHỈNH GIAO DIỆN QR ---
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(4);
  const [errorLevel, setErrorLevel] = useState('M');
  const [logo, setLogo] = useState(null);

  // --- HÀM XỬ LÝ ---
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const downloadQR = (format) => {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const imgUrl = canvas.toDataURL(`image/${format}`).replace(`image/${format}`, "image/octet-stream");
    let link = document.createElement("a");
    link.href = imgUrl;
    link.download = `my-qr-code.${format}`;
    link.click();
  };

  // --- HÀM TẠO CHUỖI DỮ LIỆU CHUẨN CHO QR CODE ---
  const generateQRValue = () => {
    switch (activeTab) {
      case 'URL': return formData.url || ' ';
      case 'Text': return formData.text || ' ';
      case 'Email': return formData.email ? `mailto:${formData.email}` : ' ';
      case 'Phone': return formData.phone ? `tel:${formData.phone}` : ' ';
      case 'SMS': return formData.smsPhone ? `smsto:${formData.smsPhone}:${formData.smsMsg}` : ' ';
      case 'WiFi': 
        return `WIFI:T:${formData.wifiType};S:${formData.wifiSsid};P:${formData.wifiPass};H:${formData.wifiHidden};;`;
      case 'VCard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${formData.vcardLast};${formData.vcardFirst};;;\nFN:${formData.vcardFirst} ${formData.vcardLast}\nORG:${formData.vcardOrg}\nTEL:${formData.vcardPhone}\nEMAIL:${formData.vcardEmail}\nURL:${formData.vcardUrl}\nADR:;;${formData.vcardAddress};;;;\nEND:VCARD`;
      case 'Location': 
        return formData.locLat && formData.locLng ? `geo:${formData.locLat},${formData.locLng}` : ' ';
      case 'Event':
        return `BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:${formData.eventName}\nLOCATION:${formData.eventLocation}\nDESCRIPTION:${formData.eventDesc}\nEND:VEVENT\nEND:VCALENDAR`;
      default: return ' ';
    }
  };

  const qrValue = generateQRValue();

  // --- DANH SÁCH MENU ---
  const qrTypes = [
    { id: 'URL', icon: <Link size={16} />, label: 'URL' },
    { id: 'Text', icon: <Type size={16} />, label: 'Văn bản' },
    { id: 'Email', icon: <Mail size={16} />, label: 'Email' },
    { id: 'Phone', icon: <Phone size={16} />, label: 'Điện Thoại' },
    { id: 'SMS', icon: <MessageSquare size={16} />, label: 'Tin Nhắn' },
    { id: 'WiFi', icon: <Wifi size={16} />, label: 'WiFi' },
    { id: 'VCard', icon: <Contact size={16} />, label: 'Danh Thiếp' },
    { id: 'Location', icon: <MapPin size={16} />, label: 'Vị Trí' },
    { id: 'Event', icon: <Calendar size={16} />, label: 'Sự Kiện' },
  ];

  // --- COMPONENT TẠO FORM DÙNG CHUNG ---
  const InputField = ({ label, type = "text", field, placeholder, isTextarea }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
      {isTextarea ? (
        <textarea rows="4" value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} placeholder={placeholder} className="w-full bg-[#18181b] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 transition-colors" />
      ) : (
        <input type={type} value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} placeholder={placeholder} className="w-full bg-[#18181b] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 transition-colors" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-gray-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* === CỘT TRÁI: ĐIỀU KHIỂN === */}
        <div className="w-full lg:w-3/5 space-y-6">
          
          {/* 1. Menu Loại Mã QR */}
          <div className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <RefreshCw size={20} className="text-green-500" /> Chọn Loại Mã QR
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {qrTypes.map((type) => (
                <button key={type.id} onClick={() => setActiveTab(type.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                    activeTab === type.id ? 'bg-green-500 text-black border-green-500' : 'bg-transparent text-gray-300 border-gray-700 hover:border-gray-500 hover:bg-[#2a2a2a]'
                  }`}>
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Nhập Dữ Liệu (Đổi linh hoạt theo Tab) */}
          <div className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Type size={20} className="text-green-500" /> Nhập Dữ Liệu
            </h2>
            
            <div className="space-y-4">
              {activeTab === 'URL' && <InputField label="URL" field="url" type="url" placeholder="https://example.com" />}
              {activeTab === 'Text' && <InputField label="Văn bản" field="text" isTextarea placeholder="Nhập nội dung văn bản..." />}
              {activeTab === 'Email' && <InputField label="Email" field="email" type="email" placeholder="example@gmail.com" />}
              {activeTab === 'Phone' && <InputField label="Số điện thoại" field="phone" type="tel" placeholder="+84 123 456 789" />}
              
              {activeTab === 'SMS' && (
                <>
                  <InputField label="Số điện thoại" field="smsPhone" type="tel" placeholder="+84..." />
                  <InputField label="Tin nhắn" field="smsMsg" isTextarea placeholder="Nội dung tin nhắn..." />
                </>
              )}

              {activeTab === 'WiFi' && (
                <>
                  <InputField label="Tên mạng (SSID)" field="wifiSsid" placeholder="MyWiFiNetwork" />
                  <InputField label="Mật khẩu" field="wifiPass" type="password" placeholder="password123" />
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Loại bảo mật</label>
                    <select value={formData.wifiType} onChange={(e) => handleInputChange('wifiType', e.target.value)} className="w-full bg-[#18181b] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500">
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Không có mật khẩu</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-300">
                    <input type="checkbox" checked={formData.wifiHidden} onChange={(e) => handleInputChange('wifiHidden', e.target.checked)} className="w-4 h-4 accent-green-500" /> Mạng ẩn
                  </label>
                </>
              )}

              {activeTab === 'VCard' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Tên" field="vcardFirst" placeholder="John" />
                    <InputField label="Họ" field="vcardLast" placeholder="Doe" />
                  </div>
                  <InputField label="Tổ chức" field="vcardOrg" placeholder="Company Name" />
                  <InputField label="Số điện thoại" field="vcardPhone" type="tel" placeholder="+1234567890" />
                  <InputField label="Email" field="vcardEmail" type="email" placeholder="email@example.com" />
                  <InputField label="Website" field="vcardUrl" type="url" placeholder="https://example.com" />
                  <InputField label="Địa chỉ" field="vcardAddress" placeholder="123 Main St, City, Country" />
                </>
              )}

              {activeTab === 'Location' && (
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Vĩ độ (Latitude)" field="locLat" placeholder="21.028511" />
                  <InputField label="Kinh độ (Longitude)" field="locLng" placeholder="105.804817" />
                </div>
              )}

              {activeTab === 'Event' && (
                <>
                  <InputField label="Tên sự kiện" field="eventName" placeholder="Meeting" />
                  <InputField label="Địa điểm" field="eventLocation" placeholder="Office" />
                  <InputField label="Mô tả sự kiện" field="eventDesc" isTextarea placeholder="Team meeting description" />
                </>
              )}
            </div>
          </div>

          {/* 3. Tùy Chỉnh (Giữ nguyên) */}
          <div className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Type size={20} className="text-green-500" /> Tùy Chỉnh
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Màu chính</label>
                  <div className="flex border border-gray-700 rounded-lg overflow-hidden bg-[#18181b]">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 cursor-pointer bg-transparent border-none" />
                    <input type="text" value={fgColor.toUpperCase()} readOnly className="w-full bg-transparent px-3 text-sm focus:outline-none uppercase" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Màu nền</label>
                  <div className="flex border border-gray-700 rounded-lg overflow-hidden bg-[#18181b]">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 cursor-pointer bg-transparent border-none" />
                    <input type="text" value={bgColor.toUpperCase()} readOnly className="w-full bg-transparent px-3 text-sm focus:outline-none uppercase" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Logo</label>
                <label className="flex items-center gap-2 w-max px-4 py-2 border border-gray-700 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                  <Upload size={16} /> Tải Logo Lên
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: PREVIEW === */}
        <div className="w-full lg:w-2/5 space-y-6">
          <div className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center min-h-[400px]">
             <h2 className="text-lg font-semibold text-white mb-6 w-full flex items-center gap-2">
              <ImageIcon size={20} className="text-green-500" /> Xem Trước
            </h2>
            <div className="p-4 bg-white rounded-lg shadow-inner">
              <QRCodeCanvas 
                id="qr-canvas"
                value={qrValue} 
                size={size > 350 ? 350 : size} 
                bgColor={bgColor}
                fgColor={fgColor}
                level={errorLevel}
                includeMargin={true}
                marginSize={margin}
                imageSettings={logo ? { src: logo, height: size * 0.2, width: size * 0.2, excavate: true } : undefined}
              />
            </div>
          </div>

          <div className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-5 shadow-lg">
             <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Download size={20} className="text-green-500" /> Tải Xuống
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => downloadQR('png')} className="flex items-center justify-center gap-2 py-2.5 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors font-medium">
                <ImageIcon size={16} /> Tải PNG
              </button>
              <button onClick={() => downloadQR('jpeg')} className="flex items-center justify-center gap-2 py-2.5 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors font-medium">
                <ImageIcon size={16} /> Tải JPEG
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}