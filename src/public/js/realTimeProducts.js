const socket = io()
const form = document.getElementById('addProduct')
const catalogue = document.getElementById('catalogue')

//Template de alert
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }
})

//Evento de envío de formulario
form.addEventListener('submit', ev => {
  ev.preventDefault()
  axios.post('/api/products/', form)
    .then(response => {
      Toast.fire({
        icon: "success",
        title: response.data.message
      })
      form.reset()
    })
    .catch(error => {
      Toast.fire({
        icon: "error",
        title: error.response.data.error
      })
    })
})

//Escucho evento para renderizar lista de productos
socket.on('products', products => {
  while (catalogue.firstChild) {
    catalogue.removeChild(catalogue.firstChild)
  }
  products.forEach(product => {
    const content = `
  <div class="text-center card" style="width: 18rem">
    <div class="card-header d-flex align-items-center justify-content-between">
      Categoría: ${product.category}
      <button class="btn btn-primary delete" data-id=${product._id}>
        <img src="/images/tacho.png">
      </button>
    </div>
    <img class="card-img-top card-img" src='/images/products/${product.thumbnails[0] || 'undefined.jpg'}'/>
    <div class="card-body">
      <div class="card-title h5">${product.title}</div>
      <div class="mb-2 text-muted card-subtitle h6">Precio: $${product.price}</div>
      <p class="card-text">${product.description}</p>
    </div>
    <div class="text-muted card-footer">Stock disponible: ${product.stock} unidades</div>
  </div>
  `
    catalogue.innerHTML += content
  })

  //Luego de renderizar todos los productos agrego evento para eliminar producto 
  document.querySelectorAll('.delete').forEach(element => {
    element.addEventListener('click', ev => {
      const target = ev.target.tagName === 'IMG' ? ev.target.parentNode : ev.target
      Swal.fire({
        title: "Eliminar producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/api/products/${target.dataset.id}`)
            .then(response => {
              target.parentNode.parentNode.remove()
              Toast.fire({
                icon: "success",
                title: response.data.message
              })
            })
            .catch(error => {
              Toast.fire({
                icon: "error",
                title: error.response.data.error
              })
            })
        }
      })
    })
  })
})