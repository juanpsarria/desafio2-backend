import fs from 'fs/promises';

export class ProductManager {
    constructor(path){
        this.path = path
        this.products
    }

    async readProductsFile(){
        const json = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(json)
    }

    async writeProductsFile(){
        const json = JSON.stringify(this.products, null, 2)
        await fs.writeFile(this.path, json)
    }


    async addProduct(product) {
        await this.readProductsFile()

        //validar que no haya campos vacíos
        if(product.title === '' || product.description === '' || product.price === '' || product.thumbnail === '' || product.code === '' || product.stock === ''){
            throw new Error('Missing fields.')
        };

        //validar que no se repita el código de producto
        const repeatedCode = this.products.some(item => item.code === product.code);
        if(repeatedCode){
            throw new Error('Code already exists.');
        };

        //asignarle un id al producto
        this.products.length === 0 ? product.id = 1 : product.id = this.products[this.products.length - 1].id + 1;

        //push
        this.products.push(product)
        await this.writeProductsFile()
    };

    async getProducts(){
        //recupera todos los productos
        await this.readProductsFile()
        return this.products;
    };

    async getProductById(productId){
        //recupera productos por id
        await this.readProductsFile()

        const product = this.products.find(e => e.id === productId);
        if(!product){
            throw new Error('ID not found.')
        }

        return product
    };

    async updateProduct(productId, fields){
        //recupera productos por id
        await this.readProductsFile()
        //modifica un objeto que se encuentra por id, sin modificar la misma
        const product = this.products.find(e => e.id === productId);
        if(!product){
            throw new Error('ID not found.')
        }

        const updatedProduct = new Product({...product, ...fields})
        const index = this.products.findIndex(p => p.id === productId)
        this.products[index] = updatedProduct
        this.products[index].id = productId
        await this.writeProductsFile()
    };

    async deleteProduct(productId){
        //elimina producto seleccionado por id
        await this.readProductsFile()

        const productFound = this.products.findIndex(e => e.id === productId)
        if(productFound === -1){
            throw new Error('ID not found.')
        }

        this.products.splice(productFound, 1);
        
        await this.writeProductsFile()
    };
};

class Product {
    constructor({title, description, price, thumbnail, code, stock}) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    };
};

//se instancia la clase ProductManager
const manager = new ProductManager('../database/data.json');

//se obtiene array vacío
console.log(await manager.getProducts());


//se crean objetos
const product1 = new Product({title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25})

const product2 = new Product({title: 'producto prueba 2', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc456', stock: 25})

const product3 = new Product({title: 'producto prueba 3', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc789', stock: 25})

 //se agregan objetos al array
/* await manager.addProduct(product1);
await manager.addProduct(product2);
await manager.addProduct(product3); */

console.log(await manager.getProducts()); 

//se obtienen objetos por id, uno existente y otro no
/* console.log(await manager.getProductById(2));
console.log(await manager.getProductById(5)); */

//se cambia producto
/* console.log(await manager.updateProduct(1, {title: 'Objeto 1 modificado', description: 'Este es un producto modificado'})); 
console.log(await manager.updateProduct(4, {title: 'Objeto 1 modificado', description: 'Este es un producto modificado'})); 

console.log(await manager.getProducts());  */

 //se elimina producto por id
console.log(await manager.deleteProduct(3));
console.log(await manager.deleteProduct(5));