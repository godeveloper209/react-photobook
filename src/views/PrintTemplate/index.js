function printTemplate(html) {
    return `
<html>
  <head>
      <style>

          @page {
            size: A4 landscape;
          }
* {
    margin: 0;
    padding: 0;
}

body {
    margin: 0;
    background-color: #fff;
}

.product {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
            flex-wrap: wrap;
    -webkit-justify-content: center;
            justify-content: center;
    -webkit-align-items: center;
            align-items: center;
}

.product-card {
    background-color: #fff;
    margin-bottom: 12px;
    margin-right: 12px;
    margin-top: 12px;
    width: 100%;
    height: 20cm;
}
.page_title{
padding: 20px;
}
.product-image {
    padding: 3%;
}

.product-image img {
    max-width: 100%;
    object-fit: cover;
}

.product-info {
    text-align: center;
    padding: 2%;
}

.img-input {
    height: 20px;
    width: 25px;
    -webkit-align-self: center;
            align-self: center;
    margin-left: 5px;
}
/* ****************************** Layout 1 ************************* */
.layout1 {
    display: -webkit-flex;
    display: flex;
    padding-top: 50px;
}

.layout1-input {
    width: 100%;
    -webkit-flex: 25% 1;
            flex: 25% 1;
    margin-right: 8px;
    border-style: dotted;
    word-wrap: break-word !important;
}

.layout1-image {
    width: 100%;
    object-fit: cover;
    padding: 0;
    -webkit-flex: 80% 1;
            flex: 80% 1;
}

/* ****************************** Layout 2 ************************* */
.layout2 {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
            flex-direction: column;
   padding-top: 40px;
}

.layout2-image {
    -webkit-flex: 80% 1;
            flex: 80% 1;
    width: 100%;
    padding: 0;
    object-fit: cover;
}
.layout2-input {
    width: 100%;
    -webkit-flex: 15% 1;
            flex: 15% 1;
    margin-right: 8px;
    border-style: dotted;
    word-wrap: break-word !important;
}
.img-container{
    position: relative;
    width: 100%;
}

/* ****************************** Layout 3 ************************* */
.layout3 {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
            justify-content: center;
    padding: 50px 4px 8px 8px;
}

.layout3-container1,
.layout3-container2 {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
            flex-direction: column;
    width: 100%;
}

.layout3-image1 {
    width: 100%;
    padding: 0 4px 8px 1px;
    object-fit: cover;
}

.layout3-input1 {
    width: 100%;
    border-style: dotted;
    padding: 0 4px 8px 1px;
    word-wrap: break-word !important;
}

.layout3-image2 {
    width: 100%;
    padding: 0 4px 8px 4px;
    object-fit: cover;
}

.layout3-input2 {
    width: 100%;
    border-style: dotted;
    padding: 0 4px 8px 4px;
    word-wrap: break-word !important;
}

.img-container {
    position: relative;
    width: 100%;
}
/* ****************************** Layout 4 ************************* */
.layout4 {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
            justify-content: center;
    padding-top: 50px;
}

.layout4-image-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
            flex-direction: column;
    width: 100%;
    padding-left: 5px;
}

.layout4-two-image-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex: 100% 1;
            flex: 100% 1;
}
.layout4-two-image-container1{
    display: -webkit-flex;
    display: flex;
    width: 100%;

}
.layout4-two-image-container2{
    display: -webkit-flex;
    display: flex;
    width: 100%;
    margin-right: 8px;
}
.layout4-one-image-container{
margin-right: 10px;
}
.layout4-one-image-container-image {
    margin-bottom: 8px;
    padding: 0 8px 0 8px;
    margin-right: 8px;
    object-fit: cover;
    width: 100%;
}
.layout4-two-image-container1{
margin-right: 10px;
}
.layout4-two-image-container1-image {
    padding: 0 4px 0 8px;
    object-fit: cover;
    width: 100%;
}

.layout4-two-image-container2-image {
    padding: 0 0 0 4px;
    margin-right: 8px;
    object-fit: cover;
    width: 100%;
}
.layout4-input-container{
    -webkit-flex: 25% 1;
            flex: 25% 1;
}
.layout4-input {
    width: 90%;
    border-style: dotted;
    word-wrap: break-word !important;
}
/* ****************************** Layout 5 ************************* */
.layout5 {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
            flex-direction: column;
    -webkit-justify-content: center;
            justify-content: center;
    padding-top: 50px;
}

.layout5-image-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
            flex-direction: row;
    width: 100%;
    padding-right: 10px;
    padding-left: 10px;
    padding-bottom: 10px;
}

.layout5-one-image-container {
    display: -webkit-flex;
    display: flex;
    width: 100%;
    margin-right: 8px;
}

.layout5-one-image-container-image {
    width: 100%;
    padding: 8px 8px 0 8px;
    object-fit: cover;
}

.layout5-two-image-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
            flex-direction: column;
    width: 100%;
}
.layout5-two-image-container1{
margin-bottom: 8px;
}
.layout5-two-image-container1-image {
    padding: 0 8px 0 0;
    width: 100%;
    object-fit: cover;
}

.layout5-two-image-container2-image {
    padding: 0 8px 0 0;
    width: 100%;
    object-fit: cover;
}

.layout5-input {
    width: 100%;
    border-style: dotted;
    word-wrap: break-word !important;
}

.layout5-input-container {
    width: 100%;
    padding-right: 10px;
    padding-left: 10px;
}


/*********************** Layout1 ****************************/
.layout1 img {
    height: 18cm;
}

.layout1-input {
    height: 18cm;
}

/*********************** Layout2 ****************************/
.layout2 img {
    height: 16cm;
}

.layout2-input {
    height: 1cm;
}

/*********************** Layout3 ****************************/

.layout3-container1 img {
    height: 16cm;
}

.layout3-container2 img {
    height: 16cm;
}

.layout3-input1 {
    height: 2cm;
}

.layout3-input2 {
    height: 2cm;
}

/*********************** Layout4 ****************************/

.layout4-image-container {
    height: 100%;
}

.layout4-one-image-container .img-container img {
    height: 9cm;
}
.layout4-two-image-container .layout4-two-image-container1 img {
    height: 9cm;
}

.layout4-two-image-container .layout4-two-image-container2 img {
    height: 9cm;
}

.layout4-input {
    height: 18.2cm;
}

/*********************** Layout5 ****************************/
.layout5-one-image-container img {
    height: 16cm;
    padding: 0;
}

.layout5-two-image-container .layout5-two-image-container1 img {
    height: 8cm;
}

.layout5-two-image-container .layout5-two-image-container2 img {
    height: 7.8cm;
}

.layout5-input {
    height: 2cm;
}


/*****************************File Uploader*********************************/

/*********************** Layout1 ****************************/
.layout1-image-uploader {
    height: 18cm;
    margin-bottom: 10px;
}

/*********************** Layout2 ****************************/
.layout2-image-uploader {
    height: 16cm;
    margin-bottom: 10px;
}

/*********************** Layout3 ****************************/
.layout3-image1-uploader {
    height: 16cm;
}

.layout3-image2-uploader {
    height: 16cm;
}

/*********************** Layout4 ****************************/
.layout4-image1-uploader {
    height: 9cm;
}

.layout4-image2-uploader {
    height: 9cm;
}

.layout4-image3-uploader {
    height: 9cm;
}

/*********************** Layout5 ****************************/
.layout5-image1-uploader {
    height: 16.2cm;
}

.layout5-image2-uploader {
    height: 8cm;
}

.layout5-image3-uploader {
    height: 8cm;
}

/*Horizontally and vertically center element*/
.content {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
body {
    overflow: hidden;
}

.bg-red {
    margin: 0 !important;
    padding: 0 !important;
}
@media (max-width: 768px) {
    .bg-red {
        display: none;
    }
}

.form-container{
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
            align-items: center;
    -webkit-justify-content: center;
            justify-content: center;
}

/*Overwrite all the css for designing pdf*/

</style>
</head>
  <body>${html}</body>
</html>
      `
}

export default printTemplate
