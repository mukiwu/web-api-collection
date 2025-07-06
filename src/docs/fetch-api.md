## 語法

```js
fetch(resource, options)
````

`fetch()` 方法接受兩個參數：

* **resource**：要獲取的資源路徑。可以是一個 URL 字串或 `Request` 物件。
* **options**（可選）：一個包含自定義設置的物件，用於控制請求行為。

`fetch()` 返回一個 `Promise`，該 `Promise` 解析為 `Response` 物件，無論 HTTP 響應的狀態碼如何。

## 參數

### resource

定義要獲取的資源。可以是：

* 一個直接指向資源的 URL 字串
* 一個 `Request` 物件

### options（可選）

一個包含自定義設置的物件，可以包含以下屬性：

| 屬性               | 描述                                                                                             | 預設值                          |
| ---------------- | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| `method`         | 請求的方法，如 GET、POST、PUT、DELETE 等                                                                  | `GET`                        |
| `headers`        | 請求的標頭，可以是 `Headers` 物件或包含標頭名稱和值的物件                                                             | `{}`                         |
| `body`           | 請求的主體，可以是 `Blob`、`BufferSource`、`FormData`、`URLSearchParams`、`USVString` 或 `ReadableStream` 物件 | `null`                       |
| `mode`           | 請求的模式，如 `cors`、`no-cors` 或 `same-origin`                                                       | `cors`                       |
| `credentials`    | 是否應該發送 cookies，可以是 `omit`、`same-origin` 或 `include`                                            | `same-origin`                |
| `cache`          | 請求的緩存模式，如 `default`、`no-store`、`reload`、`no-cache`、`force-cache` 或 `only-if-cached`            | `default`                    |
| `redirect`       | 如何處理重定向，可以是 `follow`、`error` 或 `manual`                                                        | `follow`                     |
| `referrer`       | 請求的 referrer，可以是 `no-referrer`、`client` 或 URL                                                  | `client`                     |
| `referrerPolicy` | 請求的 referrer 策略                                                                                | `no-referrer-when-downgrade` |
| `integrity`      | 包含請求的子資源完整性值                                                                                   | `''`                         |
| `keepalive`      | 請求是否應該在頁面卸載後繼續存在                                                                               | `false`                      |
| `signal`         | `AbortSignal` 物件實例，用於中止請求                                                                      | `null`                       |


## 返回值

`fetch()` 返回一個 `Promise`，該 `Promise` 解析為 `Response` 物件。`Response` 物件包含了對請求的響應資訊，如狀態、標頭和主體。

即使伺服器返回了錯誤狀態碼（如 404 或 500），`Promise` 也會正常解析。只有在網路故障或請求被阻止時，`Promise` 才會被拒絕。

> **注意**
> `Response` 物件的主體只能被讀取一次。如果需要多次讀取，應該使用 `response.clone()` 方法創建一個副本。

## 方法

`Response` 物件提供了多種方法來處理響應主體，每種方法返回一個 `Promise`，該 `Promise` 解析為相應格式的資料。

### json()

將響應主體解析為 JSON 物件。

```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

如果響應不包含有效的 JSON，則 `Promise` 會被拒絕。

### text()

將響應主體解析為文字。

```js
fetch('https://api.example.com/data')
  .then(response => response.text())
  .then(text => console.log(text));
```

### blob()

將響應主體解析為 `Blob` 物件，適用於處理二進制資料（如圖像）。

```js
fetch('https://example.com/image.jpg')
  .then(response => response.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = url;
    document.body.appendChild(img);
  });
```

### formData()

將響應主體解析為 `FormData` 物件，適用於處理表單資料。

```js
fetch('https://example.com/form')
  .then(response => response.formData())
  .then(formData => {
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  });
```

### arrayBuffer()

將響應主體解析為 `ArrayBuffer` 物件，適用於處理原始二進制資料。

```js
fetch('https://example.com/binary-data')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    const view = new Uint8Array(buffer);
    console.log(view);
  });
```

## 屬性

`Response` 物件提供了多個屬性來訪問響應的各個部分。

### headers

包含響應標頭的 `Headers` 物件。

```js
fetch('https://api.example.com/data')
  .then(response => {
    for (const [key, value] of response.headers) {
      console.log(`${key}: ${value}`);
    }
    return response.json();
  });
```

### ok

布林值，表示響應是否成功（狀態碼在 200–299 範圍內）。

```js
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
```

### status

響應的狀態碼（如 200 表示成功，404 表示未找到）。

```js
fetch('https://api.example.com/data')
  .then(response => {
    console.log(`Status: ${response.status}`);
    return response.json();
  });
```

### statusText

與狀態碼對應的狀態訊息（如 "OK" 表示 200，"Not Found" 表示 404）。

```js
fetch('https://api.example.com/data')
  .then(response => {
    console.log(`Status: ${response.status} ${response.statusText}`);
    return response.json();
  });
```

### url

響應的完整 URL。

```js
fetch('https://api.example.com/data')
  .then(response => {
    console.log(`URL: ${response.url}`);
    return response.json();
  });
```

## 使用範例

### 基本用法

最簡單的 Fetch 請求只需要一個參數 — 要獲取的資源的路徑：

```js
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## POST 請求

發送 POST 請求需要指定 `method` 和 `body`：

```js
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '張小明',
    email: 'zhang@example.com'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## 設置請求標頭

可以透過 `headers` 選項設置請求標頭：

```js
fetch('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer your-token-here',
    'Accept': 'application/json',
    'X-Custom-Header': 'custom-value'
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  });
```

## 使用 async/await

使用 async/await 讓程式碼更易讀：

```js
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();
```

## 請求中止

使用 `AbortController` 來中止進行中的 Fetch 請求：

```js
const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Error:', error);
    }
  });

// 在某個時間點中止請求
setTimeout(() => {
  controller.abort();
  console.log('Fetch aborted after timeout');
}, 5000);
```



## 進階使用

### 上傳檔案

使用 `FormData` 上傳檔案：

```js
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);

  try {
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
```



### 串聯請求

依序發送多個相互依賴的請求：

```js
async function fetchUserAndPosts(userId) {
  try {
    const userResponse = await fetch(`https://api.example.com/users/${userId}`);
    if (!userResponse.ok) throw new Error('Failed to fetch user');
    const user = await userResponse.json();

    const postsResponse = await fetch(`https://api.example.com/users/${userId}/posts`);
    if (!postsResponse.ok) throw new Error('Failed to fetch posts');
    const posts = await postsResponse.json();

    return { user, posts };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```



### 並行請求

同時發送多個獨立請求：

```js
async function fetchMultipleResources() {
  try {
    const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
      fetch('https://api.example.com/users'),
      fetch('https://api.example.com/posts'),
      fetch('https://api.example.com/comments')
    ]);

    if (!usersResponse.ok || !postsResponse.ok || !commentsResponse.ok) {
      throw new Error('One or more requests failed');
    }

    const [users, posts, comments] = await Promise.all([
      usersResponse.json(),
      postsResponse.json(),
      commentsResponse.json()
    ]);

    return { users, posts, comments };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```



### 流式處理響應

處理大型響應或流式資料：

```js
async function streamResponse() {
  try {
    const response = await fetch('https://api.example.com/large-data');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');

    let receivedLength = 0;
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
      console.log(`Received ${receivedLength} of ${contentLength} bytes`);
    }

    const allChunks = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }

    const result = new TextDecoder('utf-8').decode(allChunks);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```
