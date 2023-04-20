class Product {
    constructor(id, title, description, price, thumbnail, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.stock = stock;
    }


    get id() {
        return this._id;
    }


    set id(value) {
        this._id = value;
    }


    get title() {
        return this._title;
    }


    set title(value) {
        this._title = value;
    }


    get description() {
        return this._description;
    }


    set description(value) {
        this._description = value;
    }


    get price() {
        return this._price;
    }


    set price(value) {
        this._price = value;
    }


    get thumbnail() {
        return this._thumbnail;
    }


    set thumbnail(value) {
        this._thumbnail = value;
    }


    get stock() {
        return this._stock;
    }


    set stock(value) {
        this._stock = value;
    }
}

module.exports = Product;