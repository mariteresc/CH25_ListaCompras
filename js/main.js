// El código va aquí -> 
let txtNombre = document.getElementById("Name");
let txtNumber = document.getElementById("Number");

let btnAgregar = document.getElementById("btnAgregar");
let btnClear = document.getElementById("btnClear");

let alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
let alertValidaciones = document.getElementById("alertValidaciones");

let tabla = document.getElementById("tablaListaCompras"); // Primero seleccionar la tabla con su id
let cuerpoTabla = tabla.getElementsByTagName("tbody"); // Ya que tengo la tabla definida solo voy por el tbody de esa tabla (debo tener el de arriba para hacer este)

let contadorProductos = document.getElementById("contadorProductos");
let productosTotal = document.getElementById("productosTotal");
let precioTotal = document.getElementById("precioTotal");

let isValid = true; // Defino mi variable para que si no agrego nada en los campos, no me lo agregue a la lista 
let idTimeout;
let precio = 0;
let contador = 0;
let totalEnProductos =0;
let costoTotal = 0;

let datos = []; // aqui se almacenaran los datos de la tabla

// Limpiar campos
btnClear.addEventListener("click", function(event){
    event.preventDefault();
    txtNombre.value="";
    txtNumber.value="";
    cuerpoTabla[0].innerHTML="";

    contador = 0;
    totalEnProductos =0;
    costoTotal = 0;
    contadorProductos.innerText="0";
    productosTotal.innerText="0";
    precioTotal.innerText="$ 0";

    localStorage.setItem("contadorProductos", contador);
    localStorage.setItem("totalEnProductos", totalEnProductos);
    localStorage.setItem("costoTotal", costoTotal.toFixed(2));

});// click btnClear

function validarCantidad(){
    if(txtNumber.value.length==0){
        return false;
}
if (isNaN(txtNumber.value)){
        return false;
}
if(parseFloat(txtNumber.value)<=0){
        return false;
}

return true;
} // validarCantidad

function getPrecio(){
    return Math.floor(Math.random() * 50 * 100 )/ 100; // Mathrandom me da un numero entre el 0 y 1 y el 100 de afuera es para que solo me quede en dos decimales. Mathfloor baja el numero .
}

btnAgregar.addEventListener("click", function(event){
    event.preventDefault();
    isValid = true; 
    clearTimeout(idTimeout);
    alertValidacionesTexto.innerHTML="";
    alertValidaciones.style.display="none";
    let lista = "Los siguientes campos deben ser llenados correctamente:<ul>";
    // txtNombre.value = txtNombre.value.trim(); //Si hay espacios en el nombre, el trim los borra.
    if(txtNombre.value.length<2){
       txtNombre.style.border="solid thin red";
       lista+= "<li> Se debe escribir un nombre válido</li>";
    //    alertValidacionesTexto.innerHTML="Se debe escribir un nombre válido";
       alertValidaciones.style.display="block";
       isValid = false;
    } else {
        txtNombre.style.border=""
    }

    if(! validarCantidad()){   // para que si mi funcion es falsa me arroje la advertencia
        txtNumber.style.border="solid thin red";
        lista+= "<li> Se debe escribir una cantidad válida</li>";
        alertValidaciones.style.display="block";
        isValid = false;
        // alertValidacionesTexto.innerHTML+="Se debe escribir una cantidad válida";
     } else {
         txtNumber.style.border=""
     }
     lista += "</ul>";
     alertValidacionesTexto.insertAdjacentHTML("beforeend", lista);
     idTimeout=setTimeout (function(){
        alertValidaciones.style.display="none";
        }, 5000);
        if(isValid){ // si la variable es true se ejecutara lo siguiente, si es false no se ejecutara
        precio = getPrecio();
        contador++;
        let row = `<tr>
                     <th>${contador}</th> 
                     <td>${txtNombre.value}</td>
                     <td>${txtNumber.value}</td>
                     <td> $ ${precio}</td>
                  </tr>`;

        let elemento =   `{
                         "id" : ${contador},
                          "nombre" : "${txtNombre.value}",
                          "cantidad" : "${txtNumber.value}",
                          "precio" : "${precio}"
                           }`;      
                           
        datos.push(JSON.parse(elemento));

        localStorage.setItem("datos",JSON.stringify(datos) );

        cuerpoTabla[0].insertAdjacentHTML("beforeend", row); //Se pone 0 porque en getElementsByTagName me trae todos los elementos por eso tengo que definir cual quiero, osea la primera.
        contadorProductos.innerText=contador;
        totalEnProductos += parseFloat(txtNumber.value);
        productosTotal.innerText=totalEnProductos;
        costoTotal += precio * parseFloat(txtNumber.value);
        precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`; // el toFixed(2) hace que solo nos ponga 2 decimales en el total
        let resumen = `{"contadorProductos" : ${contador},
                         "totalEnProductos" : ${totalEnProductos},
                         "costoTotal"        : ${costoTotal.toFixed(2)} }`;
        localStorage.setItem("resumen", resumen);
        
        // localStorage.setItem("contadorProductos", contador);
        // localStorage.setItem("totalEnProductos", totalEnProductos);
        // localStorage.setItem("costoTotal", costoTotal.toFixed(2));

       
        txtNombre.value="";
        txtNumber.value=""; // Limpia mis campos de nombre y cantidad para seguir escribiendo
        txtNombre.focus(); // Me regresa el cursor a nombre despues de ingresar mi cantidad
        }
}); // btnAgregar click


txtNumber.addEventListener("blur", function(event){
    event.preventDefault();
    txtNumber.value = txtNumber.value.trim();
}); // txtNumber.blur


txtNombre.addEventListener("blur", function(event){
    event.preventDefault();
    txtNombre.value = txtNombre.value.trim();
});

window.addEventListener("load", function(event){
   if(localStorage.getItem("resumen")== null) {
    let resumen = `{"contadorProductos" : ${contador},
    "totalEnProductos"  : ${totalEnProductos},
    "costoTotal"        : ${costoTotal.toFixed(2)}}`;
    localStorage.setItem("resumen", resumen);

   }// if

   let res = JSON.parse(localStorage.getItem("resumen"));


    // if (localStorage.getItem("contadorProductos")==null){
    //     localStorage.setItem("contadorProductos","0");
    // }
    // if (localStorage.getItem("totalEnProductos")==null){
    //     localStorage.setItem("totalEnProductos","0");
    // }
    // if (localStorage.getItem("costoTotal")==null){
    //     localStorage.setItem("costoTotal","0.0");
    // }

    contador = res.contadorProductos; // parseInt(localStorage.getItem("contadorProductos"));
    totalEnProductos = res.totalEnProductos; //parseInt(localStorage.getItem("totalEnProductos"));
    costoTotal = res.costoTotal; //parseFloat(localStorage.getItem("costoTotal"));

    contadorProductos.innerText= contador;
    productosTotal.innerText=totalEnProductos;
    precioTotal.innerText=`$ ${costoTotal}`;
});