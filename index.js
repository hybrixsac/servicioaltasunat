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
          //await page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp');
          await page.goto('https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA==');
          await page.waitForSelector("#btnAceptar");  
          await page.type("#txtRuc",body_filtros.documento);
          await page.type("#txtUsuario",body_filtros.txtUsuario);
          await page.type("#txtContrasena",body_filtros.txtContrasena);
          await page.click("#btnAceptar");
          await page.waitForTimeout(5000); 
          //console.log(page);
          try{
            let salida = await page.evaluate(() => {
              var elemento = document.querySelectorAll('.dropdown-header'); 
              return elemento[5].innerHTML || "";
            });
            
            let respuesta;
            console.log(salida);
            if((salida || "") =="".concat("<strong>RUC: ",body_filtros.documento,"</strong>")){
              respuesta="exito";
              await page.waitForSelector("#nivel4_11_9_6_1_1");
              let altas = await page.evaluate(() => {
                var elemento = document.querySelectorAll('#nivel4_11_9_6_1_1'); 
                return elemento[0].innerHTML || "";
              });
              //console.log(page) 
              await page.waitForTimeout(3000)
              console.log(altas) 
              //const sizeLinks = await page.$('#nivel4_11_9_6_1_1');
              //const sizeLinks = await page.$('#nivel4_11_9_6_1_1');
              //console.log(sizeLinks)
              //await  altas.click();
              await page.evaluate(()=>document.querySelector('#nivel4_11_9_6_1_1').click())
              /*await page.waitForSelector(".spanNivelDescripcion");  
              await page.waitForTimeout(3000)
              await page.click(".spanNivelDescripcion"); */
              await page.waitForSelector("#iframeApplication"); 
              const sizeLinks = await page.$('#iframeApplication');
              console.log(sizeLinks[0])/*
              await page.waitForSelector(".error"); 
              const sizeLink = await page.$('.error');
              console.log(sizeLink)*/
              await page.waitForTimeout(3000)
              /*let embed = await page.evaluate(() => {
                var elemento = document.querySelectorAll('#iframeApplication'); 
                return elemento.innerHTML || "";
              });

              console.log("embed".concat(embed))*/

              /*await page.waitForSelector("#nivel4_11_9_6_1_1");   
              await page.waitForSelector(".spanNivelDescripcion");  
              await page.waitForTimeout(5000)
              await page.click("#nivel4_11_9_6_1_1");  */
              //await page.waitForSelector("#nivel4_11_9_6_1_1");  
              //const sizeLinks = await page.$$('#nivel4_11_9_6_1_1');
              //await page.waitForTimeout(3000)
              //await page.click("#nivel4_11_9_6_1_1");  
              /*console.log(sizeLinks[0])
              let sizeLink = sizeLinks[0];
              //console.log( 'Clicking on: ', await page.evaluate( el => el.ht, sizeLink ) ); 
              await sizeLink.click() ;*/

            }else{
              respuesta="error";
            }; 
            res.send(respuesta);
          }catch (err){
            console.log(err);
            res.send("error");
          }

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
    
app.listen(app.get("port"), () => 
  console.log("app running on port", app.get("port"))
);