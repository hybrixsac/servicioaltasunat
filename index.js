const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;
  //console.log(event);
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    await page.goto('https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA==');
    await page.waitForSelector("#btnAceptar");  
    await page.type("#txtRuc",event.documento);
    await page.type("#txtUsuario",event.txtUsuario);
    await page.type("#txtContrasena",event.txtContrasena);
    await page.click("#btnAceptar");
    await page.waitForTimeout(3000); 
    ////console.log(page);
    let api="";
    let msg="";
    let salida;
    try{
      try{
        salida = await page.evaluate(async () => {
          var elemento = document.querySelectorAll('.dropdown-header'); 
          return elemento[5].innerHTML || "";
        });
        //console.log(salida);
      }catch (err){
        api="500";
        msg="Error en Login"
        salida ={api:api,msg:msg};
        result=salida;
      };
      if(api==""){ 
        page = await browser.newPage();
        await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
        await page.goto('https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm?action=execute&code=11.9.6.1.1&s=ww1');
        await page.waitForTimeout(3000)
        await page.waitForSelector(".error");
        let error = await page.evaluate(() => {
          var elemento = document.querySelectorAll('.error'); 
          return elemento[0].innerHTML || "";
        });
        //console.log(error) 
        if(error=="Usted no está habilitado para emitir comprobantes de pago. Para mayor información comuníquese con nuestra Central de Consultas."){
          api="500";
          msg=error
          salida ={api:api,msg:msg};
          result=salida;
        }else{
          await page.waitForSelector("#btnNuevoCert_label");
          await page.evaluate(()=>document.querySelector('#btnNuevoCert_label').click())
          await page.waitForTimeout(3000)
          await page.waitForSelector("#txt_ruc");
          await page.type("#txt_ruc",event.rucDigiflow);
          await page.waitForSelector("#btnListarPSE2_label");
          await page.evaluate(()=>document.querySelector('#btnListarPSE2_label').click())
          await page.waitForSelector("#txtFechaIni");
          await page.type("#txtFechaIni",event.txtFechaIni);
          await page.waitForSelector("#txtFechaIni");
          await page.waitForTimeout(3000)
          let txtFechaIni = await page.evaluate(() => {
            var elemento = document.querySelectorAll('#txtFechaIni'); 
            return elemento[0].innerHTML || "txtFechaIni";
          });
          //console.log(txtFechaIni) 
          await page.waitForTimeout(3000)
          await page.click("#btnNuevoCert1_label");
          //let response = await page.screenshot({ encoding: "base64", fullPage: true });
          //console.log(response);
          api="200";
          msg="Alta SUNAT se realizo correctamente"
          salida ={api:api,msg:msg};
        }
      }
    }catch (err){
      //console.log(err);
      salida ={api:"500",msg:err};
    };

    result = JSON.stringify(salida);
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};