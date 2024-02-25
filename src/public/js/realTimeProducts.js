const socket = io()
const form = document.getElementById('addProduct')
const catalogue = document.getElementById('catalogue')

//Escucho evento para renderizar lista de productos
socket.on('products', products => {
  while (catalogue.firstChild) {
    catalogue.removeChild(catalogue.firstChild)
  }
  products.forEach(product => {
    const content = `<div class='text-center card' style='width: 16rem; margin: 10px'>
    <div class='card-header'>Categoría: ${product.category}</div>
    <img class='card-img-top card-img' src='/images/products/${product.thumbnails[0]}'/>
    <div class='card-body'>
      <div class='card-title h5'>${product.title}</div>
      <div class='mb-2 text-muted card-subtitle h6'>Precio: $${product.price}</div>
      <p class='card-text'>${product.description}</p>
    </div>
    <div class='text-muted card-footer'>Stock disponible: ${product.stock} unidades</div>
  </div>`
    catalogue.innerHTML += content
  })
})