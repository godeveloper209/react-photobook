function printHtml(html) {
    return `
<html>
  <head>
      <style type="text/css">
        .pageTable {
            width: 100%;
            height: 100%;
            border-collapse: collapse;
            padding: 0;
            margin: 0;
        }

        .textBox {
            padding-left: 20px;
            padding-right: 10px;
            padding-top: 20px;
            font-size: 25px;
            font-family: Ubuntu;
            overflow: hidden;
        }
        </style>
    </head>
  <body style="margin: 0">${html}</body>
</html>`
}

export default printHtml;
