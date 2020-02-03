function printHtml(html) {
    return `
<html>
  <head>
      <style type="text/css">
        .pageTable {
            width: 49%;
            height: 100%;
            border-collapse: collapse;
            padding: 0;
            margin: 0;
        }

        .textBox {
            font-size: 9px;
            font-family: Ubuntu;
            overflow: hidden;
        }
        </style>
    </head>
  <body style="margin: 3%">${html}</body>
</html>`
}


export default printHtml;
