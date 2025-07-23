## 語法

```js
navigator.clipboard.readText()
navigator.clipboard.writeText(text)
navigator.clipboard.read()
navigator.clipboard.write(data)
```

Clipboard API 允許網頁程式安全地讀寫剪貼簿內容，支援文字與多媒體資料。

## 方法

### 讀取文字

```js
navigator.clipboard.readText()
  .then(text => console.log('剪貼簿內容:', text))
  .catch(err => console.error('讀取失敗', err));
```

### 寫入文字

```js
navigator.clipboard.writeText('Hello, world!')
  .then(() => console.log('寫入成功'))
  .catch(err => console.error('寫入失敗', err));
```

### 讀取複雜資料（如圖片、HTML）

```js
navigator.clipboard.read()
  .then(items => {
    for (const item of items) {
      // 可處理 item.types 與 item.getType(type)
    }
  })
  .catch(err => console.error('讀取失敗', err));
```

### 寫入複雜資料

```js
const blob = new Blob(['<b>Hello</b>'], { type: 'text/html' });
const item = new ClipboardItem({ 'text/html': blob });
navigator.clipboard.write([item])
  .then(() => console.log('寫入成功'))
  .catch(err => console.error('寫入失敗', err));
```

## 權限

- 需 HTTPS 或 localhost。
- 需使用者互動（如點擊事件）才能呼叫。
- 可用 Permissions API 檢查權限：

```js
navigator.permissions.query({ name: 'clipboard-read' })
  .then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      // 可安全呼叫 clipboard API
    }
  });
```

## 注意事項

- 剪貼簿操作需在使用者互動下觸發。
- 讀寫複雜資料（如圖片、HTML）支援度有限，請先檢查 `navigator.clipboard.read`/`write` 是否存在。
- 某些瀏覽器可能限制可存取的資料型態。

## 使用範例

### 複製文字到剪貼簿

```js
document.getElementById('copyBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('複製這段文字');
    alert('已複製！');
  } catch (err) {
    alert('複製失敗');
  }
});
```

### 貼上文字

```js
document.getElementById('pasteBtn').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    alert('貼上內容：' + text);
  } catch (err) {
    alert('貼上失敗');
  }
});
```

## 參考資源

- [MDN Web Docs: Clipboard API](https://developer.mozilla.org/zh-TW/docs/Web/API/Clipboard_API)
- [MDN Web Docs: navigator.clipboard](https://developer.mozilla.org/zh-TW/docs/Web/API/Navigator/clipboard) 
