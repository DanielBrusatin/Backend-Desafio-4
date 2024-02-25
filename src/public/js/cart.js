const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }
})
const cart = document.querySelector('#cart')
const cartContainer = document.querySelector('#cart-container')
const cid = cart.dataset.cid

document.querySelector('.clear').addEventListener('click', ev => {
  Swal.fire({
    title: 'Vaciar carrito?',
    text: 'Se borrarán todos los productos de tu carrito',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Vaciar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`/api/carts/${cid}`)
        .then(response => {
          cartContainer.innerHTML = 'No hay productos en el carrito'
          Toast.fire({
            icon: 'success',
            title: response.data.message
          })
        })
        .catch(error => {
          Toast.fire({
            icon: 'error',
            title: error.response.data.error
          })
        })
        .finally(() => {
          if (!cart.firstElementChild) cart.innerHTML = 'No hay productos en el carrito'
        })

    }
  })
})


document.querySelectorAll('.delete').forEach(element => {
  element.addEventListener('click', ev => {
    Swal.fire({
      title: 'Eliminar producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/carts/${cid}/product/${ev.target.dataset.pid}`)
          .then(response => {
            ev.target.parentNode.remove()
            Toast.fire({
              icon: 'success',
              title: response.data.message
            })
          })
          .catch(error => {
            Toast.fire({
              icon: 'error',
              title: error.response.data.error
            })
          })
          .finally(() => {
            if (!cart.firstElementChild) cartContainer.innerHTML = 'No hay productos en el carrito'
          })

      }
    })
  })
})

