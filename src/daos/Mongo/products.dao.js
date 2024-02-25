import Products from '../models/product.model.js'

class ProductsDao {

  //Funcion para validar el ID
  static async validateId(pid) {
    // Compruebo que el ID sea válido (El ID de mongo tiene siempre 24 caracteres)
    if (pid.length == 24) {
      //Compruebo que exista el producto con ese ID
      if (!await Products.findById(pid)) {
        throw new Error('404', { cause: `No existe el producto con ID = ${pid}` })
      }
    } else {
      throw new Error('400', { cause: `Ingresaste el ID de producto '${pid}' que es inválido.` })
    }
  }

  static async getProducts({limit, page, sort, category, stock}) {
    //Armo las query, si existen, de filtro por categoria y por stock
    const filter = {}
    if(category) filter.category = category
    if(stock == 'true') filter.stock = {$gt: 0}
    //Si no se pasa un limite o una pagina le coloco los valores por default
    if(!parseInt(limit)) limit = 10
    if(!parseInt(page)) page = 1
    //Armo el ordenamiento, si existe, por precio ascendente o descendente
    const order =  sort == 'asc' || sort == 'desc' ? {price: sort} : {}

    try {
      const response = await Products.paginate(filter, {limit, page, sort: order, lean: true})
      const queryCategory = category ? `&category=${category}` : ''
      const queryStock = stock ? `&stock=${stock}` : ''
      const querySort = sort ? `&sort=${sort}` : ''
      return {
        status: 'success',
        payload: response.docs,
        totalPages: response.totalPages,
        prevPage: response.prevPage,
        nextPage: response.nextPage,
        page: response.page,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: response.hasPrevPage ? `/products?limit=${limit}&page=${response.prevPage}${queryCategory}${queryStock}${querySort}`: null,
        nextLink: response.hasNextPage ? `/products?limit=${limit}&page=${response.nextPage}${queryCategory}${queryStock}${querySort}`: null,
        isValid: !(page > response.totalPages)
      }
    } catch {
      throw new Error('500', { cause: 'Error al leer base de datos' })
    }
  }

  static async getProductById(pid) {
    await this.validateId(pid)
    try {
      return await Products.findById(pid).lean()
    } catch {
      throw new Error('500', { cause: 'Error al leer base de datos' })
    }
  }

  static async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    }
    //Verifico que estén todos los campos obligatorios y lanzo un error si falta alguno
    const missingFields = []
    Object.entries(newProduct).forEach(([key, value]) => !value && missingFields.push(key))
    if (missingFields.length) {
      throw new Error('400', { cause: missingFields.length == 1 ? `Falta el campo ${missingFields.join(', ')}`: `Faltan los campos ${missingFields.join(', ')}`})
    }
    //Verifico que no se repita el codigo de producto
    if (await Products.countDocuments({ code })) {
      throw new Error('400', { cause: `Ya existe un producto con el código ${code}` })
    } else {
      try {
        await new Products({ ...newProduct, thumbnails }).save()
      } catch {
        throw new Error('500', { cause: 'No se pudo agregar el producto, intentar nuevamente.' })
      }
    }
  }

  static async updateProduct(pid, newProduct) {
    await this.validateId(pid)
    try {
      await Products.findByIdAndUpdate(pid, newProduct)
    } catch {
      throw new Error('500', { cause: 'Error al leer base de datos.' })
    }
  }

  static async deleteProduct(pid) {
    await this.validateId(pid)
    try {
      await Products.findByIdAndDelete(pid)
    } catch {
      throw new Error('500', { cause: 'No se pudo eliminar el producto, intentar nuevamente.' })
    }
  }
}

export default ProductsDao