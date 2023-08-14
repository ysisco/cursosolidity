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
    const contractABI = await fetch('build/contracts/EmployeeManager.json');
    // Se utiliza el método json() para convertir la respuesta de la solicitud HTTP en un objeto JSON.
    const contractJSON = await contractABI.json();
    // Se crea una instancia de Contract de ethers utilizando la dirección del contrato, el ABI del contrato y el proveedor provider. Contract se utiliza para interactuar con el contrato inteligente en la red Ethereum
    const contractAddress = contractJSON["networks"]["5777"]["address"];
    contract = new ethers.Contract(contractAddress, contractJSON.abi, provider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    addressElement.textContent =  address;
    return contract;
  }
  
  contract = connectContract();

async function guardarContract(dni,nombre,wallet) {
    try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        console.log(contractWithSigner);
        const transaction = await contractWithSigner.createWarehouseman(dni,nombre,wallet)
        console.log(transaction)
    } catch (error) {
        console.error('Error al conectar a la billetera: ', error);
        alert(error.data.data.reason);
        window.location="index.html"
    }
}

document.getElementById("acceptButton").addEventListener("click", function() {   
    dni = document.getElementById("dni");
    nombre = document.getElementById("nombre");
    wallet = document.getElementById("wallet");
    guardarContract(parseInt(dni.value),nombre.value,wallet.value);
   
});

document.getElementById("cancelButton").addEventListener("click", function() {
    window.location="index.html"
});