import fs from 'fs/promises';

class ProductManager {
    constructor(path){
        this.path = path;
        this.products;
    };

    async addProduct(title, description, price, thumbnail, code, stock){
        const json = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(json);

        //valida que no haya campos vacíos
        if(title === '' || description === '' || price === '' || thumbnail === '' || code === '' || stock === ''){
            console.error('Missing fields.');
            return false;
        };

        //valida que no se repita el código de producto
        const repeatedCode = this.products.some(item => item.code === code);
        if(repeatedCode){
            console.error('Code already exists.');
            return false;
        }else{
            const product = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
            };
        //le asigna un id al producto
        this.products.length === 0 ? product.id = 1 : product.id = this.products[this.products.length - 1].id + 1;

        //push
        this.products.push(product);

        console.log("Product added.")

        const json = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, json);
        };
    };

    async getProducts(){
        //recupera todos los productos
        const json = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(json);
        console.log("Products retrieved.")
        return this.products;
    };

    async getProductById(productId){
        //recupera productos por id
        const json = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(json);

        const product = this.products.find(e => e.id === productId);
        if(!product){
            throw new Error('Not found.')
        }else{
            console.log("Product found.")
            return product
        };
    };

    async updateProduct(productId, title, description, price, thumbnail, code, stock){
        //modifica un objeto que se encuentra por id, sin modificar la misma
        const json = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(json);

        const productFound = this.products.findIndex(e => e.id === productId)
        if(productFound === -1){
            throw new Error('Not found.')
        }else{
            const updatedProduct = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                id: this.products[productFound].id
            }
            

            this.products.splice(productFound, 1, updatedProduct);
            console.log("Product updated.")
            const jsonProducts = JSON.stringify(this.products, null, 2)
            await fs.writeFile(this.path, jsonProducts)
        };
    };

    async deleteProduct(productId){
        //elimina producto seleccionado por id
        const json = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(json);

        const productFound = this.products.findIndex(e => e.id === productId)
        if(productFound === -1){
            throw new Error('Not found.')
        }else{
            this.products.splice(productFound, 1);
            console.log('Product deleted.')
            const jsonProducts = JSON.stringify(this.products, null, 2)
            await fs.writeFile(this.path, jsonProducts)
        };
    };
};


//se instancia la clase ProductManager
const manager = new ProductManager('./index.txt');

//se obtiene array vacío
console.log(await manager.getProducts());

//se agregan objetos al array
await manager.addProduct( 'producto prueba1', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
await manager.addProduct( 'producto prueba2', 'Este es un producto prueba', 200, 'Sin imagen', 'abc456', 25);
await manager.addProduct( 'producto prueba3', 'Este es un producto prueba', 200, 'Sin imagen', 'abc789', 25);
console.log(await manager.getProducts());

//se obtienen objetos por id, uno existente y otro no
/* console.log(await manager.getProductById(2));
console.log(await manager.getProductById(5)); */

//se cambia producto
/* console.log(await manager.updateProduct(1, "producto 1 modificado", "description 1 modificado", 50, "imagen modificada", "codigo modificado", 10)); 

console.log(await manager.getProducts()); */

 //se elimina producto por id
/* console.log(await manager.deleteProduct(3));
console.log(await manager.deleteProduct(5)); */
