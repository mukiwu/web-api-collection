## 語法

```js
fetch(resource, options)
```

## 參數

| 參數      | 型別    | 說明                         |
|-----------|---------|------------------------------|
| resource  | string  | 要獲取的資源 URL 或 Request  |
| options   | object  | 請求的自訂設置（可選）        |

## 返回值

- 回傳一個 Promise，解析為 Response 物件。
- 即使 HTTP 狀態碼為 404/500 也不會 reject，僅網路錯誤才會 reject。

> **注意**：Response 物件的主體只能被讀取一次。如果需要多次讀取，應該使用 `response.clone()` 方法創建一個副本。

## 方法

- `json()`：解析為 JSON 物件
- `text()`：解析為純文字
- `blob()`：解析為二進位資料
- `formData()`：解析為表單資料
- `arrayBuffer()`：解析為 ArrayBuffer

## 屬性

- `headers`：響應標頭
- `ok`：是否成功（狀態碼 200-299）
- `status`：狀態碼
- `statusText`：狀態訊息
- `url`：響應的 URL

## 進階使用

### 上傳檔案

```js
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return await response.json();
}
```

### 串聯請求

```js
async function fetchUserAndPosts(userId) {
  const userResponse = await fetch(`https://api.example.com/users/${userId}`);
  if (!userResponse.ok) throw new Error('Failed to fetch user');
  const user = await userResponse.json();
  const postsResponse = await fetch(`https://api.example.com/users/${userId}/posts`);
  if (!postsResponse.ok) throw new Error('Failed to fetch posts');
  const posts = await postsResponse.json();
  return { user, posts };
}
```

### 並行請求

```js
async function fetchMultipleResources() {
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
}
```

### 流式處理響應

```js
async function streamResponse() {
  const response = await fetch('https://api.example.com/large-data');
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  let receivedLength = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedLength += value.length;
  }
  const allChunks = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }
  const result = new TextDecoder('utf-8').decode(allChunks);
  return JSON.parse(result);
}
``` 
