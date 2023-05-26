class Product {
  constructor(
    id = "",
    title = "",
    description = "",
    price = 0,
    thumbnail = "",
    stock = 0
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._price = price;
    this._thumbnail = thumbnail;
    this._stock = stock;
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

  toString() {
    console.log(
      `Product: ${this._title}, Description: ${this._description}, Price: ${this._price}`
    );
    return `Product: ${this._title}, Description: ${this._description}, Price: ${this._price}`;
  }
}
export default Product;
