## 語法

```js
Notification.requestPermission().then(permission => { /* ... */ });
new Notification(title, options);
```

Notifications API 允許網頁向使用者顯示桌面通知。這個 API 主要包含兩個部分：
1. **權限請求**：使用 `Notification.requestPermission()` 來請求顯示通知的權限。
2. **建立通知**：使用 `new Notification(title, options)` 來建立並顯示通知。

## 權限請求

在顯示通知前，必須先取得使用者的同意。

```js
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // 可以顯示通知
  }
});
```

### 返回值

`Notification.requestPermission()` 返回一個 `Promise`，解析為權限狀態字串：
- `granted`：允許顯示通知
- `denied`：拒絕顯示通知
- `default`：使用者尚未做出選擇

## 建立通知

取得權限後，可以使用 `new Notification()` 建立通知。

```js
new Notification('標題', {
  body: '這是通知內容',
  icon: 'icon.png',
  tag: 'unique-tag',
  data: { foo: 'bar' }
});
```

### 參數

| 參數      | 描述                       | 必填 | 預設值   |
|---------|--------------------------|------|--------|
| `title` | 通知的標題                   | 是   | 無     |
| `options` | 一個物件，包含通知的選項           | 否   | `{}`   |

#### options 物件屬性

| 屬性      | 描述                                 | 預設值   |
|---------|------------------------------------|--------|
| `body`  | 通知的內容文字                            | `''`   |
| `icon`  | 通知顯示的圖示 URL                        | 無     |
| `image` | 額外顯示的大型圖片 URL                      | 無     |
| `badge` | 小型徽章圖示 URL                           | 無     |
| `tag`   | 通知的標籤（用於取代舊通知）                  | 無     |
| `data`  | 任意資料，可在事件處理器中取得                  | 無     |
| `requireInteraction` | 是否要求使用者互動才自動關閉通知         | `false`|
| `silent`| 是否靜音顯示通知                             | `false`|
| `renotify` | 若 tag 相同時是否重新提醒                  | `false`|
| `dir`   | 文字方向（'auto'、'ltr'、'rtl'）           | `'auto'`|
| `lang`  | 語言設定                                   | 無     |
| `timestamp` | 通知的時間戳記（毫秒）                   | 無     |

## 事件

`Notification` 物件支援多種事件，可用於監聽通知的互動：

- `onclick`：使用者點擊通知時觸發
- `onclose`：通知被關閉時觸發
- `onerror`：通知出現錯誤時觸發
- `onshow`：通知顯示時觸發

```js
const notification = new Notification('新訊息', { body: '你有一則新通知' });
notification.onclick = (event) => {
  window.focus();
  notification.close();
};
```

## 屬性

| 屬性         | 描述                       |
|------------|--------------------------|
| `title`    | 通知的標題                   |
| `body`     | 通知的內容                   |
| `icon`     | 通知的圖示 URL                |
| `data`     | 傳遞的自定義資料               |
| `tag`      | 通知的標籤                   |
| `requireInteraction` | 是否要求互動才自動關閉通知 |
| `silent`   | 是否靜音顯示通知               |
| `timestamp`| 通知的時間戳記                 |

## 使用範例

### 基本用法

```js
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('Hello!', {
      body: '這是一則桌面通知',
      icon: '/icon.png'
    });
  }
});
```

### 事件監聽

```js
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    const notification = new Notification('新訊息', { body: '你有一則新通知' });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    notification.onclose = () => {
      console.log('通知已關閉');
    };
  }
});
```

### 傳遞自定義資料

```js
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    const notification = new Notification('任務提醒', {
      body: '你有一個待辦事項',
      data: { taskId: 123 }
    });
    notification.onclick = (event) => {
      console.log('任務 ID:', notification.data.taskId);
    };
  }
});
```

### 取代舊通知（使用 tag）

```js
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('更新', {
      body: '這是最新的通知',
      tag: 'update'
    });
    // 再次發送相同 tag，會取代前一則通知
    new Notification('更新', {
      body: '這是更新後的通知',
      tag: 'update'
    });
  }
});
```

## 注意事項

- 通知功能僅在 HTTPS 網站或 localhost 上可用。
- 使用者必須先同意權限，否則無法顯示通知。
- 某些瀏覽器可能會限制通知的顯示頻率。
- 若需在網頁關閉後仍能推播通知，請參考 [Service Worker 與 Push API](https://developer.mozilla.org/zh-TW/docs/Web/API/Push_API)。

## 參考資源

- [MDN Web Docs: Notifications API](https://developer.mozilla.org/zh-TW/docs/Web/API/Notifications_API)
- [MDN Web Docs: Notification](https://developer.mozilla.org/zh-TW/docs/Web/API/Notification) 
