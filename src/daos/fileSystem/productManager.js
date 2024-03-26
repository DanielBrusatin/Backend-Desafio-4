import fs from 'fs'
import __dirname from '../../utils.js'

class ProductManager {
  constructor(path) {
    this.path = __dirname + path
    this.products = this.getProducts()
    this.id = this.products.reduce((idMax, product) => idMax > product.id ? idMax : product.id, 0)
  }

  readFile = () => {
    try {
      const res =  fs.readFileSync(this.path, 'utf-8')
      return JSON.parse(res)
    }
    catch {
      throw new Error('404', { cause: `Can't find the file '${this.path}'` })
    }
  }
  
  getProducts = () => {
    const response = this.readFile()
    return response
  }

  getProductById = (id) => {
    //Verifico que se haya pasado un ID válido
    if (Number.isInteger(Number(id)) && Number(id) > 0) {
      const response = this.readFile()
      //Compruebo que exista el producto con ese ID
      if (response.find( product => product.id == id )) {
        return response.find( product => product.id == id )  
      } else {
        throw new Error('404', { cause: `No existe el producto con ID = ${id}` })
      }
    } else {
      throw new Error('400', { cause: `Ingresaste el ID de producto '${id}' que es inválido. El ID debe ser un numero entero mayor 0.` })
    }
  }
  
  addProduct = async ({ title, description, code, price, status, stock, category, thumbnails }) => {
    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    }
    //Verifico que estén todos los campos y lanzo un error si falta alguno
    const missingFields = []
    Object.entries(newProduct).forEach( ([key, value]) => !value && missingFields.push(key))
    if(missingFields.length) {
      throw new Error('400', { cause: `Falta/n el/los campo/s ${missingFields.join(', ')}` })
    }
    //Verifico que no se repita el codigo de producto
    if(!this.products.some( product => product.code == code )) {
      this.id++
      this.products.push({ ...newProduct, thumbnails, id: this.id })
      try {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
      } catch {
        throw new Error('500', { cause: 'No se pudo agregar el producto, intentar nuevamente.' })
      }
    } else {
      throw new Error('400', { cause: `Ya existe un producto con el código ${code}` })
    }
  }

  updateProduct = async (id, newProduct) => {
    //Verifico que se haya pasado un ID válido
    if (Number.isInteger(Number(id)) && Number(id) > 0) {
      const index = this.products.findIndex( product => product.id == id)
      //Compruebo que exista el producto con ese ID
      if (index !== -1) {
        //Actualizo las keys pasadas en 'newProduct' que tenga el producto excepto el ID
        for (const key in newProduct) {
          if (this.products[index].hasOwnProperty(key) && key != 'id') {
            this.products[index][key] = newProduct[key]
          }
        }
        try {
          await fs.promises.writeFile(this.path, JSON.stringify(this.products))
        } catch {
          throw new Error('500', { cause: 'No se pudo agregar el producto, intentar nuevamente.' })
        }
      } else {
        throw new Error('404', { cause: `No existe el producto con ID = ${id}` })
      }
    } else {
      throw new Error('400', { cause: `Ingresaste el ID '${id}' que es inválido. El ID debe ser un numero entero mayor 0.` })
    }
  }

  deleteProduct = async (id) => {
    //Verifico que se haya pasado un ID válido
    if (Number.isInteger(Number(id)) && Number(id) > 0) {
      //Compruebo que exista el producto con ese ID
      if (this.products.find( product => product.id == id)) {
        this.products = this.products.filter( product => product.id != id)
        try {
          await fs.promises.writeFile(this.path, JSON.stringify(this.products))
        } catch {
          throw new Error('500', { cause: 'No se pudo eliminar el producto, intentar nuevamente.' })
        }
      } else {
        throw new Error('404', { cause: `No existe el producto con ID = ${id}` })
      }
    } else {
      throw new Error('400', { cause: `Ingresaste el ID '${id}' que es inválido. El ID debe ser un numero entero mayor 0.` })
    }
  }
}

export default new ProductManager('/products.json')

