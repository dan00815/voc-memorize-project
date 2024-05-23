# VOC-memorize 單字記憶工具

使用 React 及 Redux toolkit 打造的單字記憶工具，並連結 Firebase 實行單字儲存庫的功能，藉由串接 wordnik API 取得隨機推播單字及定義、例句等，google translate API 進行翻譯功能

[DEMO website](https://voc-memorize-project.onrender.com/)

## 專案功能

- 隨機推播單字
- 可調整推播單字的數量，並可更換新的一批單字
- 單字右上角書本圖示點選可看到定義、例句、及發音
- 已熟記的單字點選消除
- 未記得者點選後可收入儲存庫
- 字典功能可做查詢(包含中文翻譯、定義、例句、發音)
- BOX 單字儲存庫收集未熟記的單字，可重複背誦直到記憶後可消除
- Error 訊息及點選提示

## 專案畫面

![screen1](https://github.com/dan00815/voc-memorize-project/blob/main/public/screenshot/screen1.jpg)

![screen2](https://github.com/dan00815/voc-memorize-project/blob/main/public/screenshot/screen2.jpg)

![screen3](https://github.com/dan00815/voc-memorize-project/blob/main/public/screenshot/screen3.jpg)

![screen4](https://github.com/dan00815/voc-memorize-project/blob/main/public/screenshot/screen4.jpg)

![screen5](https://github.com/dan00815/voc-memorize-project/blob/main/public/screenshot/screen5.jpg)

![screen6](https://github.com/dan00815/voc-memorize-project/blob/main/public/screenshot/screen6.jpg)

## 元件拆分

1. 主頁部分，將上方控制單字數量的元件獨立，其內部在拆分「VocAmountController」及「ChangeVocBtn」兩個元件方便各自管理不同功能

2. 將重用性高的元件，拆分在 UI folder，提升開發效率

## 本地端安裝

1. 打開 terminal，將專案複製到本機電腦

```
git clone https://github.com/dan00815/voc-memorize-project.git
```

2. 進到專案資料夾

```
cd voc-memorize
```

3. 安裝相關套件

```
npm install
```

4. 別忘記配置環境變數

```
在.env.example檔案中查看如何配置環境變數
```

5. 啟動伺服器

```
npm start
```

現在可以在瀏覽器中輸入 http://localhost:3000 開始使用應用程式
