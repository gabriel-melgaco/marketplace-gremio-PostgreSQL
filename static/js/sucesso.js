// Extrai o parâmetro "id" da URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
    console.log(`ID do comprador: ${id}`);
    
}
