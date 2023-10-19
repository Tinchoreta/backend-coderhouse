
import assert from 'assert';
import { ProductService } from '../productService.js';

async function runTests() {
    console.log('Running tests...');

    await testThrowErrorForMissingFields();
    await testCreateProductWithValidData();

    console.log('All tests completed.');
}

async function testThrowErrorForMissingFields() {
    const invalidProductData = {
        // Missing 'title' and 'price'
        description: 'Some description',
        thumbnail: 'thumbnail-url',
        stock: 10,
        category: 'electronics',
    };

    try {
        await ProductService.createProduct(invalidProductData);
    } catch (error) {
        assert.strictEqual(error.name, 'ValidationError');
        assert.strictEqual(error.message, 'products validation failed: price: Path `price` is required., title: Path `title` is required.');
        assert.strictEqual(Object.keys(error.errors).length, 2);
        assert.strictEqual(error.errors['title'].kind, 'required');
        assert.strictEqual(error.errors['price'].kind, 'required');

        console.log('Test "testThrowErrorForMissingFields" passed');
    }
}

async function testCreateProductWithValidData() {
    const validProductData = {
        title: 'Product Title',
        price: 100,
        description: 'Some description',
        thumbnail: 'thumbnail-url',
        stock: 10,
        category: 'electronics',
    };

    const createdProduct = await ProductService.createProduct(validProductData);

    assert.ok(createdProduct._id);
    assert.strictEqual(createdProduct.title, validProductData.title);
    assert.strictEqual(createdProduct.price, validProductData.price);

    console.log('Test "testCreateProductWithValidData" passed');
}

export default runTests;
