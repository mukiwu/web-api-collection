## 語法

```js
navigator.share(data)
```

Web Share API 允許網頁呼叫原生分享面板，讓使用者能將內容直接分享到其他應用程式（如 LINE、Messenger、Email 等）。

## 參數

`navigator.share()` 接受一個物件參數 `data`，包含要分享的內容。

| 屬性         | 描述                   | 必填 | 預設值 |
|------------|----------------------|------|------|
| `title`    | 分享的標題               | 否   | 無   |
| `text`     | 分享的文字內容             | 否   | 無   |
| `url`      | 分享的網址               | 否   | 無   |
| `files`    | 要分享的檔案（File 物件陣列） | 否   | 無   |

> **注意**
> 並非所有平台都支援 `files` 屬性，僅部分瀏覽器與作業系統支援檔案分享。

## 返回值

`navigator.share()` 返回一個 `Promise`：
- 成功時 `Promise` 解析為 `undefined`（代表分享面板已開啟且使用者完成分享或取消）。
- 失敗時 `Promise` 被拒絕，通常是因為使用者取消或瀏覽器不支援。

## 支援性

- 僅在 HTTPS 網站或 localhost 上可用。
- 僅支援行動裝置或部分桌面瀏覽器。
- 可用性可用 `navigator.canShare()` 檢查。

## 使用範例

### 基本分享

```js
if (navigator.share) {
  navigator.share({
    title: '我的網站',
    text: '快來看看這個網站！',
    url: 'https://example.com'
  })
    .then(() => console.log('分享成功'))
    .catch(error => console.error('分享失敗', error));
} else {
  console.log('瀏覽器不支援 Web Share API');
}
```

### 分享檔案

```js
if (navigator.canShare && navigator.canShare({ files: [file] })) {
  navigator.share({
    files: [file],
    title: '分享檔案',
    text: '這是你要的檔案'
  })
    .then(() => console.log('檔案分享成功'))
    .catch(error => console.error('檔案分享失敗', error));
} else {
  console.log('瀏覽器不支援檔案分享');
}
```

## 錯誤處理

- 若使用者取消分享，`Promise` 會被拒絕。
- 若瀏覽器不支援，呼叫會丟出錯誤。

## 注意事項

- 請務必檢查 `navigator.share` 是否存在再呼叫。
- 分享檔案時，建議先用 `navigator.canShare` 檢查支援性。
- 桌面瀏覽器支援度有限，主要以行動裝置為主。

## 參考資源

- [MDN Web Docs: Web Share API](https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Share_API) 
