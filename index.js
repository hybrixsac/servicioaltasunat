const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.set("port", 9101);
app.use(express.json())

const browserP = puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],headless: true
});
  
app.post("/sunat", (req, res) => {
  let page;
  let body_filtros = req.body;
  console.log(body_filtros);
  (async () => {
    page = await (await browserP).newPage();
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    await page.goto('https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA==');
    await page.waitForSelector("#btnAceptar");  
    await page.type("#txtRuc",body_filtros.documento);
    await page.type("#txtUsuario",body_filtros.txtUsuario);
    await page.type("#txtContrasena",body_filtros.txtContrasena);
    await page.click("#btnAceptar");
    await page.waitForTimeout(3000); 
    //console.log(page);
    let api="";
    let msg="";
    try{
      let salida;
      try{
        salida = await page.evaluate(async () => {
          var elemento = document.querySelectorAll('.dropdown-header'); 
          return elemento[5].innerHTML || "";
        });
      }catch (err){
        api="500";
        msg="Error en Login"
        salida ={api:api,msg:msg};
        res.send(salida);
      };
      if(api==""){
        console.log(salida);
        page = await (await browserP).newPage();
        await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
        await page.goto('https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm?action=execute&code=11.9.6.1.1&s=ww1');
        await page.waitForTimeout(3000)
        await page.waitForSelector(".error");
        let error = await page.evaluate(() => {
          var elemento = document.querySelectorAll('.error'); 
          return elemento[0].innerHTML || "";
        });
        console.log(error) 
        if(error=="Usted no está habilitado para emitir comprobantes de pago. Para mayor información comuníquese con nuestra Central de Consultas."){
          api="500";
          msg=error
          salida ={api:api,msg:msg};
          res.send(salida);
        }else{
          await page.waitForSelector("#btnNuevoCert_label");
          await page.evaluate(()=>document.querySelector('#btnNuevoCert_label').click())
          await page.waitForTimeout(3000)
          await page.waitForSelector("#txt_ruc");
          await page.type("#txt_ruc",body_filtros.rucDigiflow);
          await page.waitForSelector("#btnListarPSE2_label");
          await page.evaluate(()=>document.querySelector('#btnListarPSE2_label').click())
          await page.waitForSelector("#txtFechaIni");
          await page.type("#txtFechaIni",body_filtros.txtFechaIni);
          await page.waitForSelector("#txtFechaIni");
          await page.waitForTimeout(3000)
          let txtFechaIni = await page.evaluate(() => {
            var elemento = document.querySelectorAll('#txtFechaIni'); 
            return elemento[0].innerHTML || "txtFechaIni";
          });
          console.log(txtFechaIni) 
          await page.waitForTimeout(3000)
          await page.click("#btnNuevoCert1_label");
          let response = await page.screenshot({ encoding: "base64", fullPage: true });
          console.log(response);
          api="200";
          msg="Alta SUNAT se realizo correctamente"
          salida ={api:api,msg:msg};
          res.send(salida);
        }
      }
    }catch (err){
      console.log(err);
      res.send("error");
    };
  })()
      .catch(err => res.sendStatus(500))
      .finally(async () => await page.close())
    ;
    
});

app.post("/sunarp", (req, res) => {
  let page;
  let body_filtros = req.body;
  console.log(body_filtros);
  (async () => {
    page = await (await browserP).newPage();
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto('https://www.sunarp.gob.pe/seccion/servicios/detalles/0/c3.html');
      await page.click(".jcrm-botondetalle a");
      await page.waitForSelector("#MainContent_btnSearch");  
      await page.waitForTimeout(3000);
      await page.waitForSelector("#g-recaptcha-response");  
      await page.type("#MainContent_txtNoPlaca",body_filtros.documento);
      const captha = body_filtros.captcha;
      await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${captha}";`);
      await page.click("#MainContent_btnSearch");
      await page.waitForTimeout(3000);
      let response = await page.screenshot({ encoding: "base64", fullPage: true });
      let salida ={base64:response};
      res.send(salida);
    
        })()
        .catch(err => res.sendStatus(500))
        .finally(async () => await page.close())
      ;
});
  
  
app.post("/minsa", (req, res) => {
    let page;
    let body_filtros = req.body;
    console.log(body_filtros);
    (async () => {
    
      page = await (await browserP).newPage();
      await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      await page.goto('https://carnetvacunacion.minsa.gob.pe');
      await page.waitForTimeout(2000);
      await page.waitForSelector("#g-recaptcha-response");  
      await page.type("#txtFechaEmision",body_filtros.fechaemision);
      await page.type("#txtFechaNacimiento",body_filtros.fechanacimiento);
      await page.type("#jaFrmRegVacLstTipoDoc","1");// DNI
      await page.type("#jaFrmRegVacTxtNumDoc",body_filtros.documento);
      await page.click("#chkPolitica");
      const response = body_filtros.captcha;
      await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`);
      await page.waitForSelector("#btnCerrar");
      await page.click("#btnCerrar");
      await page.click("#btnEntrar");
      var apellido =body_filtros.apellido;
      await page.waitForTimeout(3000);
      let salida = await page.evaluate(({apellido}) =>{
          var elemento = document.querySelector('div.col-9').innerHTML|| 'Error'; 
        if(elemento.includes(apellido)){
          return "OK";
        }else {
          return "Error";
        } 
      },{apellido});
      console.log(salida);
      let resultado ="";
      if(salida=="OK"){   
        await page.waitForSelector(".jOptVacuna");
        await page.click(".jOptVacuna");
        await page.waitForTimeout(1000);
        await page.waitForSelector("#jaBntCertificado");
        await page.click("#jaBntCertificado");
        await page.waitForTimeout(2000);
        const pages = await (await browserP).pages();
        resultado = await pages[2].screenshot({ encoding: "base64", fullPage: true })
        await pages[2].close();
      }  else{
          resultado="Error";
      }
      res.send(resultado);
    
    })()
      .catch(err => res.sendStatus(500))
      .finally(async () => await page.close())
    ;
  });

  
app.post("/", (req, res) => {
  res.send("tu documento es : "+req.body.documento);
});

app.listen(app.get("port"), function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", app.get("port"));
});