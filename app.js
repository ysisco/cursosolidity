
let contract;
let provider;
let accountsGanache;
/**
 * ACLARACION: Aqui deben tener habilitado el live server para que funcione el fetch, esto es solo una comodidad a fines practicos ya que a medida que cambien el contrato
 * van a tener que estar actualizando el abi en el archivo que lo tengan guardado, como tenemos todo en un mismo directorio cada vez que hacemos el deploy se pisa el abi viejo con el nuevo
 * y lo podemos consular directamente. Aclaro que es solo fines practicos. Lo que se hace es tener el formato abi del contrato guardado en un archivo en el front como vimos en clases anteriores
 */
async function connectContract() {
  // Se crea una instancia de Web3Provider de la biblioteca ethers. Web3Provider
  provider = new ethers.providers.Web3Provider(window.ethereum);
  // Se realiza una solicitud HTTP para obtener el archivo JSON que contiene el ABI
  const contractABI = await fetch('build/contracts/CustomerManager.json');
  // Se utiliza el método json() para convertir la respuesta de la solicitud HTTP en un objeto JSON.
  const contractJSON = await contractABI.json();
  // Se crea una instancia de Contract de ethers utilizando la dirección del contrato, el ABI del contrato y el proveedor provider. Contract se utiliza para interactuar con el contrato inteligente en la red Ethereum
  const contractAddress = contractJSON["networks"]["5777"]["address"];
  contract = new ethers.Contract(contractAddress, contractJSON.abi, provider);
  console.log(contract);
}

async function connectToWallet(role) {

  const addressElement = document.getElementById('address');
  try {


    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    addressElement.textContent = 'BIENVENIDO. ESTAS CONECTADO A LA WEB3 CON LA BILLETERA: ' + address;

    // Runs on page load

    // Solicitar listado de cuentas conectadas
    const accounts = await provider.send("eth_requestAccounts", []);    
    alert('LA CUENTA DEL ADMINISTRADOR ES: ' + accounts[0])

    renderRoleContent(getRoles(address), roleContent,address);
    const loginButton = document.getElementById('loginButton');
    loginButton.textContent = "Disconnect Wallet"

  } catch (error) {
    console.error('Error al conectar a la billetera: ', error);
  }
}

async function disconnectWallet() {
  const addressElement = document.getElementById('address');
  try {
    // Obtener el proveedor de la billetera
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Desconectar el proveedor de la billetera asignando null
    // Desconectar la billetera utilizando MetaMask

    alert('Te vamos a descoenctar de la wallet' + addressElement.textContent);
    const address = addressElement.textContent;

    // MetaMask requires requesting permission to connect users accounts
    // await provider.send("eth_requestAccounts", []);

    window.location.reload(true);

    // Limpiar el estado o realizar otras tareas de limpieza si es necesario

    addressElement.textContent = 'PARA INTERACTUAR CON APLICACIONES WEB 3 REQUIERES UNA WALLET SI DESEAS CONECTARTE haz click en conectar';
    // Limpiar el estado o realizar otras tareas de limpieza si es necesario

    console.log('Desconexión exitosa de la billetera');
  } catch (error) {
    console.error('Error al desconectar la billetera:', error);
  }
}

async function connectToWalletOnStart() {

  //
  //addressElement.textContent = 'TE ESTAS CONECTANDO A AUN APLICACION WEB3 , REQUERIMOS UNA CONECCION A UNA WALLET';
  try {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    //const addressElement = document.getElementById('mensajeField');
    //addressElement.textContent = 'BIENVENIDO. ESTAS CONECTADO A LA WEB3 CON LA BILLETERA: ' + address;
    
    renderRoleContent(getRoles(address), roleContent,address);

    if (getRoles()=="administrador")
    {

      const registrarAdministradorButton = document.getElementById('registrarAdministradorButton');
      registrarAdministradorButton.addEventListener('click', () => {
           
       window.location.href = "registro_administrador.html";
    
      });
    
      const registrarTransportistaButton = document.getElementById('registrarTransportistaButton');
      registrarTransportistaButton.addEventListener('click', () => {
    
       alert("registrarTransportistaButton")
       window.location.href = "registro_transportista.html";
    
      });
    
      const registrarDepositoButton = document.getElementById('registrarDepositoButton');
      registrarDepositoButton.addEventListener('click', () => {
    
        window.location.href = "registro_deposito.html";
    
      });


      const registrarClientesButton = document.getElementById('registrarClientesButton');
      registrarClientesButton.addEventListener('click', () => {
    
        window.location.href = "registro_cliente.html";
    
      });


      const registroPedidosButton = document.getElementById('registroPedidosButton');
      registroPedidosButton.addEventListener('click', () => {
    
        window.location.href = "registro_pedido.html";
    
      });

      

    }

  } catch (error) {
    console.error('Error al conectar a la billetera: ', error);
    //addressElement.textContent = 'PARA INTERACTUAR CON APLICACIONES WEB 3 REQUIERES UNA WALLET';
  }
}


/**
 * Registra a un candidato en el contrato.
 * 
 * Esta función obtiene el signatario del proveedor y lo conecta al contrato.
 * Luego, recupera la dirección del candidato desde un elemento de entrada en el documento.
 * Realiza una transacción para registrar al candidato en el contrato y devuelve la transacción.
 * 
 * Devuelve Error si ocurre algún error durante el proceso.
 */
async function registerCustomer(){

  try {
    // Se crea una instancia de Web3Provider de la biblioteca ethers. Web3Provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    // Se realiza una solicitud HTTP para obtener el archivo JSON que contiene el ABI
    const contractABI = await fetch('build/contracts/CustomerManager.json');
    // Se utiliza el método json() para convertir la respuesta de la solicitud HTTP en un objeto JSON.
    const contractJSON = await contractABI.json();
    // Se crea una instancia de Contract de ethers utilizando la dirección del contrato, el ABI del contrato y el proveedor provider. Contract se utiliza para interactuar con el contrato inteligente en la red Ethereum
    const contractAddress = contractJSON["networks"]["5777"]["address"];
    contract = new ethers.Contract(contractAddress, contractJSON.abi, provider);
    contract.on("NewCustomer", (eventArgs) => {
      console.log(eventArgs);
    })
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    console.log(contractWithSigner);
    const transaction = await contractWithSigner.createCustomer();
    console.log(transaction)
  } catch (error) {
    console.error(error)
  }
}


/*document.addEventListener('DOMContentLoaded', () => {

  connectToWalletOnStart();

  const loginButton = document.getElementById('loginButton');
  loginButton.addEventListener('click', () => {

    if (loginButton.textContent == 'Connect to Wallet') {

      connectToWallet();

    }
    else {


      disconnectWallet()

    }

  });
});*/

/*document.addEventListener('DOMContentLoaded', () => {

  

  const registrarButton = document.getElementById('registrarButton');
  registrarButton.addEventListener('click', () => {

    registerCustomer();

  });
});*/


function renderRoleContent(role, container,address) {



  container.innerHTML = ''; // Limpiar el contenido actual
  const content = document.createElement('section');
  content.id = 'userDashboard';

  if (role === 'cliente') {
    content.innerHTML = `
    <div class="icon">
        <img src="administrador.png" alt="Warning Icon">        
        <p>`+address+`</p>    
    </div>
    <div class="admin-form">
    <h2>Opciones del Cliente</h2>
      <ul>
          <button id="registrarPedidoButton" class="green-button">Registrar Pedido</button></BR></BR>
          <button id="acceptButton" class="green-button">Cancelar Pedido</button></BR></BR>
          <button id="acceptButton" class="green-button">Consultar Pedido</button></BR></BR>
          <button id="acceptButton" class="green-button">Consultar Pedido</button></BR></BR>  
          <button id="acceptButton" class="green-button">Verificar Pedido</button></BR></BR>          
      </ul>
    </div>
      `;
  } else if (role === 'deposito') {
    content.innerHTML = `
    <div class="icon">
        <img src="administrador.png" alt="Warning Icon">
    </div>
    <div class="admin-form">
    <h2>Opciones del Deposito</h2>
      <ul>
          <li><a href="#">Registrar Administrador</a></li></BR>
          <li><a href="#">Registrar Transportista</a></li></BR>
          <li><a href="#">Registrar personal de deposito</a></li></BR>
          <li><a href="#">Actualizar Pedidos</a></li></BR>
      </ul>
    </div>
      `;
  } else if (role === 'transportista') {
    content.innerHTML = `
          <div class="icon">
              <img src="administrador.png" alt="Warning Icon">
          </div>
          <div class="admin-form">
          <h2>Opciones del Tranportista</h2>
            <ul>
                <li><a href="#">Registrar Administrador</a></li></BR>
                <li><a href="#">Registrar Transportista</a></li></BR>
                <li><a href="#">Registrar personal de deposito</a></li></BR>
                <li><a href="#">Actualizar Pedidos</a></li></BR>
            </ul>
          </div>
            `;
  } else if(role== "administrador") {

    content.innerHTML = `
          <div class="icon">
              <img src="administrador.png" alt="Warning Icon">
          </div>
          <div class="admin-form">
          <h2>Opciones del Administrador</h2>

          <ul>
            <button id="registrarAdministradorButton" class="green-button">Registrar Administrador</button></BR></BR>
            <button id="registrarTransportistaButton" class="green-button">Registrar Transportista</button></BR></BR>
            <button id="registrarDepositoButton" class="green-button">Registrar personal de deposito</button></BR></BR>
            <button id="registrarClientesButton" class="green-button">Registrar Cliente</button></BR></BR>
            <button id="registroPedidosButton" class="green-button">Registrar Pedido</button></BR></BR>                 
          </ul>
          </div>
            `;
  }

  container.appendChild(content);
}


function getRoles(address) {
  var role = "administrador";

  /*switch (address) {
    case "0x0E38E19317Db92723b9793F57Fb19163caa0356D":
      role = "deposito"
      break;

    case "0x02C35B665ccC1BfE2045680E55cD05D2D60a47b7":
      role = "transportista"
      break;

    case "0x23e5e5cAd03BDdf35206CeB3F06Bc8E7F2c8debc":
      role = "cliente"
      break;

    default: role = "cliente"
  }*/

  return role;

}

/** 
 * Se define un manejador de eventos para para cada evento. Cuando se emite este evento desde el contrato inteligente, se ejecuta la función de flecha proporcionada
 * Cuando utilizas contract.on(), el método establece una conexión con el contrato inteligente y comienza a escuchar los eventos especificados. 
 * Cuando se emite un evento coincidente, la función de callback se ejecuta con los datos asociados al evento.
 */
function subscribeToEvents() {
  window.ethereum.on('accountsChanged', (accounts) => {
    // 'accounts' es un array de las cuentas conectadas después del cambio
    console.log('ALGO CAMBIO EN METAMASK');
    connectToWalletOnStart();
  
});

// Runs whenever the user changes account state
    window.ethereum.on('disconnect', async () => {
      console.log("DESCONECTADO 1");
      
    });


}

// A: Verificar que existe una wallet conectada

// A.1: Si hay wallet conectada

        //B: Verificar si hay un administrador
            
            //B.1 Si existe un administrador

                // C.1 Verificar si la direccion que se intenta conectar es de la wallet del administrador

                      //D: Si la wallet esta registrada como administrador

                            //Mostrar menu de administrador 

            // B.2 No existe administrador

// A.2: No hay Wallet conectada

document.addEventListener('DOMContentLoaded', () => {
  
  connectToWalletOnStart();

  

 

  });
    


  