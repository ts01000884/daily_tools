# 實用工具網站 (Utility Tools Website)

這是一個集合各種實用小工具的網站，旨在解決日常生活中遇到的一些瑣碎問題。

## 🌐 網站連結 (Live Demo)

您可以直接透過以下連結使用本網站：

**[https://ts01000884.github.io/daily_tools/](https://ts01000884.github.io/daily_tools/)**

## ✨ 現有工具

### 1. 微波時間換算機

輕鬆換算超商（7-ELEVEN、全家）與家用微波爐（1000W, 800W, 700W, 600W）的加熱時間。

這個工具的計算模型基於「總能量守恆」，您可以提供特定超商按鈕在 700W 家用微波爐的等效加熱秒數，來建立精準的能量模型，從而獲得準確的換算結果。

## 🚀 如何使用

本專案為純前端網頁，無需安裝任何伺服器或編譯環境。

1.  複製 (Clone) 本專案到您的電腦：
    ```bash
    git clone <repository-url>
    ```
2.  直接在瀏覽器中打開根目錄下的 `index.html` 檔案即可開始使用。

## 📂 專案結構

專案的結構設計旨在方便擴充，每個工具都存放在獨立的資料夾中。

```
.
├── css/
│   └── style.css         # 首頁和共用樣式
├── js/                   # 首頁專用的 JavaScript
├── tools/
│   └── microwave-converter/
│       ├── index.html    # 微波工具的 HTML
│       ├── script.js     # 微波工具的 JavaScript
│       └── style.css     # 微波工具的 CSS
├── index.html            # 網站首頁
└── README.md             # 專案說明文件
```

## 💡 如何新增工具

1.  在 `tools/` 資料夾下，為您的新工具建立一個新的資料夾（例如 `tools/my-new-tool/`）。
2.  在該資料夾中，建立對應的 `index.html`, `style.css`, 和 `script.js` 檔案。
3.  回到根目錄的 `index.html`，複製一個現有的工具卡片，並修改以下內容：
    *   `<h5>`：新工具的標題。
    *   `<p>`：新工具的簡短描述。
    *   `<a>` 的 `href` 屬性：指向您新工具的 `index.html` 路徑（例如 `tools/my-new-tool/index.html`）。

## 📄 授權 (License)

本專案採用 [MIT License](https://opensource.org/licenses/MIT) 授權。
