## 語法

```js
navigator.serviceWorker.register(scriptURL, options)
```

Service Worker API 允許網頁在背景執行腳本，實現離線瀏覽、快取、推播通知等功能。

## 註冊 Service Worker

使用 `navigator.serviceWorker.register()` 註冊 Service Worker 檔案。

```js
navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    console.log('Service Worker 註冊成功:', registration);
  })
  .catch(error => {
    console.error('Service Worker 註冊失敗:', error);
  });
```

### 參數

| 參數         | 描述                       | 必填 | 預設值 |
|------------|--------------------------|------|------|
| `scriptURL`| Service Worker 檔案路徑         | 是   | 無   |
| `options`  | 註冊選項物件（如 scope）         | 否   | 無   |

#### options 物件屬性

| 屬性      | 描述                   | 預設值 |
|---------|----------------------|------|
| `scope` | Service Worker 控制範圍     | `/`  |

## 生命週期

Service Worker 主要有三個階段：
- **安裝（install）**
- **啟用（activate）**
- **運作中（fetch、message 等事件）**

```js
// sw.js
self.addEventListener('install', event => {
  console.log('Service Worker 安裝');
  // 可進行快取等初始化
});

self.addEventListener('activate', event => {
  console.log('Service Worker 啟用');
  // 清理舊快取等
});

self.addEventListener('fetch', event => {
  // 攔截網路請求，可自訂快取策略
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

## 常用方法

- `registration.unregister()`：解除註冊 Service Worker
- `navigator.serviceWorker.ready`：取得啟用後的 registration
- `self.skipWaiting()`：強制新 SW 立即啟用
- `clients.claim()`：讓 SW 立即接管所有頁面

## 使用範例

### 註冊與解除註冊

```js
// 註冊
navigator.serviceWorker.register('/sw.js');

// 解除註冊
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) reg.unregister();
});
```

### 快取靜態資源

```js
// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/main.js',
        '/style.css'
      ]);
    })
  );
});
```

## 注意事項

- 只能在 HTTPS 或 localhost 下註冊。
- Service Worker 檔案必須與網頁同源。
- 註冊 scope 需在對應目錄下。
- 生命週期與頁面獨立，需注意快取更新策略。

## 參考資源

- [MDN Web Docs: Service Worker API](https://developer.mozilla.org/zh-TW/docs/Web/API/Service_Worker_API)
- [MDN Web Docs: Using Service Workers](https://developer.mozilla.org/zh-TW/docs/Web/API/Service_Worker_API/Using_Service_Workers) 
