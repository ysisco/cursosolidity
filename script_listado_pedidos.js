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

  const addressElement = document.getElementById('address');
  provider = new ethers.providers.Web3Provider(window.ethereum);
  // Se realiza una solicitud HTTP para obtener el archivo JSON que contiene el ABI
  const contractABI = await fetch('build/contracts/OrderManager.json');
  // Se utiliza el método json() para convertir la respuesta de la solicitud HTTP en un objeto JSON.
  const contractJSON = await contractABI.json();
  // Se crea una instancia de Contract de ethers utilizando la dirección del contrato, el ABI del contrato y el proveedor provider. Contract se utiliza para interactuar con el contrato inteligente en la red Ethereum
  const contractAddress = contractJSON["networks"]["5777"]["address"];
  contract = new ethers.Contract(contractAddress, contractJSON.abi, provider);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  addressElement.textContent =  address;

  try {
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    console.log(contractWithSigner);
    const transaction = await contractWithSigner.getOrders()
    console.log(transaction)

    transaction.forEach(order => {

      
            const orderDiv = document.createElement('div');
            orderDiv.className = "container_order";

            const orderNumberInfoTitle = document.createElement('p');
            orderNumberInfoTitle.textContent = "ORDER NUMBER";
            const orderNumberInfo = document.createElement('p');
            orderNumberInfo.textContent = order[0];

            const walletInfoTitle = document.createElement('p');
            walletInfoTitle.textContent = "ORDER WALLET";
            const walletrInfo = document.createElement('p');
            walletrInfo.textContent = order[1];

            const productosInfo = document.createElement('p');
            productosInfo.textContent = "PRODUCTOS";

            const listaProductos = document.createElement('ul');
           
           
           var mapeo_productos = {
            "01500": "Tropical Blends (SKU: 01500)",
            "02500": "Fresh Tea (SKU: 02500)",
            "03150": "Garden Lemonade (SKU: 03150)"
          };


          var mapeo_status = {
            0: "NEW",
            1: "PREPARED",
            2: "WAITING",
            3: "SENDED",
            4: "RECEIVED"            
          };


          
            var lista = JSON.parse(order[2]);

            lista.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.textContent = mapeo_productos[item];
                listaProductos.appendChild(itemElement);
            });


            const ordertEstatus = document.createElement('p');
            ordertEstatus.textContent = `Orden #${order.id} - Estado: ${mapeo_status[order[4]]}`;

            
            const receivedButton = document.createElement('button');
            receivedButton.textContent = 'Recibido';
            receivedButton.className="green-button";
            receivedButton.addEventListener('click', () => {
                // Lógica para cancelar la orden aquí
                alert(`Orden #${order[0]} recibida.`);
            });

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancelar';
            cancelButton.className="green-button";
            cancelButton.addEventListener('click', () => {
                // Lógica para cancelar la orden aquí
                alert(`Orden #${order[0]} cancelada.`);
            });


            orderDiv.appendChild(orderNumberInfoTitle);
            orderDiv.appendChild(orderNumberInfo);
            orderDiv.appendChild(walletInfoTitle);
            orderDiv.appendChild(walletrInfo);
            orderDiv.appendChild(productosInfo);
            orderDiv.appendChild(listaProductos);
            orderDiv.appendChild(ordertEstatus);
            orderDiv.appendChild(cancelButton);
            orderDiv.appendChild(receivedButton);
            
            orderListElement.appendChild(orderDiv);
     //   }
    });

} catch (error) {
    console.error('Error al conectar a la billetera: ', error);
    alert(error.data.data.reason);
}

}


connectContract();




