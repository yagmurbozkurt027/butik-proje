'use client';
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useChat } from './hooks/useChat';
import { toast } from 'react-toastify';

export default function Home() {
  const canvasRef = useRef(null);
  const [username, setUsername] = useState("Ziyaretçi");
  const [showQR, setShowQR] = useState(false);
  const [customIP, setCustomIP] = useState("192.168.1.100");
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('user');

  // Chat hook'u
  const {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    sendTypingStatus,
    startChat
  } = useChat(userId, userRole);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("username");
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("role");
      
      setUsername(name || "Ziyaretçi");
      if (storedUserId) setUserId(storedUserId);
      if (storedRole) setUserRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = 400;

    // 1. Yazıyı canvas'a çiz
    ctx.clearRect(0, 0, width, height);
    ctx.font = "bold 64px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#3b82f6";
    const text = `Hoş geldin, ${username}!`;
    ctx.fillText(text, width / 2, height / 2);

    // 2. Yazının piksellerini al
    const imageData = ctx.getImageData(0, 0, width, height);
    const particles = [];
    for (let y = 0; y < height; y += 6) {
      for (let x = 0; x < width; x += 6) {
        const i = (y * width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
            color: `hsl(${200 + Math.random() * 100}, 80%, 60%)`
          });
        }
      }
    }

    // 3. Etrafta dolaşan ekstra ışıklar
    const floatingParticles = [];
    const floatingCount = Math.max(40, Math.floor(width / 30));
    for (let i = 0; i < floatingCount; i++) {
      floatingParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: 2 + Math.random() * 2,
        color: `hsl(${200 + Math.random() * 100}, 80%, 70%)`
      });
    }

    // 4. Animasyon fonksiyonu
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Etrafta dolaşan ışıklar
      for (let p of floatingParticles) {
        p.x += p.vx;
        p.y += p.vy;
        // Kenarlardan sekme
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Yazıyı oluşturan ışıklar
      for (let p of particles) {
        p.vx += (p.tx - p.x) * 0.02;
        p.vy += (p.ty - p.y) * 0.02;
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(animate);
    }
    animate();

    // Temizlik
    return () => {
      ctx.clearRect(0, 0, width, height);
    };
  }, [username]);

  // QR kod için URL - Telefon erişimi için IP adresi kullan
  const getQRValue = () => {
    if (typeof window !== 'undefined') {
      // Geliştirme ortamında IP adresi kullan
      if (window.location.hostname === 'localhost') {
        return `http://${customIP}:3000`;
      }
      return window.location.href;
    }
    return 'https://butik-proje.com';
  };

  const qrValue = getQRValue();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
    toast.success('Mesaj gönderildi!');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] py-16 w-full">
      {/* Sağ Taraf Chat Widget */}
      <div className="fixed right-4 bottom-4 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            title="Chat'i Aç"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-80 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="bg-green-500 text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-semibold">Canlı Destek</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">
                  {isConnected ? '🟢' : '🔴'}
                </span>
                <button
                  onClick={() => setShowChat(false)}
                  className="hover:bg-green-600 p-1 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p className="text-sm">Hoş geldiniz! Size nasıl yardımcı olabilirim?</p>
                  <button
                    onClick={startChat}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Destek Başlat
                  </button>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.senderId === userId
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    sendTypingStatus(true);
                  }}
                  onKeyPress={handleKeyPress}
                  onBlur={() => sendTypingStatus(false)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded text-sm font-medium transition-colors"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 400, display: "block", pointerEvents: "none" }}
      />
      <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 text-center font-semibold mt-8 mb-4 relative z-10">
        Butik Proje'ye göz atın.
      </p>
      
      {/* QR Kod Bölümü */}
      <div className="relative z-10 flex flex-col items-center">
        <button
          onClick={() => setShowQR(!showQR)}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
          </svg>
          {showQR ? 'QR Kodu Gizle' : 'QR Kodu Göster'}
        </button>
        
        {showQR && (
          <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              📱 Mobil Erişim QR Kodu
            </h3>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-lg shadow-inner">
                <QRCodeSVG 
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center max-w-xs">
                Bu QR kodu telefonunuzla tarayarak projeye hızlıca erişebilirsiniz
              </p>
              
              {/* IP Adresi Bilgisi */}
              {qrValue.includes('192.168') && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center mb-3">
                    <strong>Önemli:</strong> Telefonunuz ve bilgisayarınız aynı Wi-Fi ağında olmalıdır.
                  </p>
                  
                  {/* IP Adresi Input */}
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      IP Adresi:
                    </label>
                    <input
                      type="text"
                      value={customIP}
                      onChange={(e) => setCustomIP(e.target.value)}
                      className="text-xs px-2 py-1 border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="192.168.1.100"
                    />
                  </div>
                  
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                    <strong>Tam URL:</strong> {qrValue}
                  </p>
                </div>
              )}
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(qrValue);
                    alert('Link kopyalandı!');
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  📋 Linki Kopyala
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrValue;
                    link.download = 'butik-proje-qr.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  💾 QR Kodu İndir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}