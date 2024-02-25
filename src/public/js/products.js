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


document.querySelectorAll('.delete').forEach(element => {
  element.addEventListener('click', ev => {
    const target = ev.target.tagName === 'IMG' ? ev.target.parentNode : ev.target
    Swal.fire({
      title: 'Eliminar producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/products/${target.dataset.id}`)
          .then(response => {
            target.parentNode.parentNode.remove()
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
      }
    })
  })
})


document.querySelectorAll('.add').forEach(element => {
  element.addEventListener('click', ev => {
    axios.post(`api/carts/65d120e48d47167429465f50/product/${ev.target.dataset.id}`)
      .then(response => {
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

  })
})