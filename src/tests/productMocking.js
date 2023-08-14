import { faker } from '@faker-js/faker';

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        stock: faker.number.int({ min: 1 }),
        description: faker.commerce.productDescription(),
        created_at: faker.date.past(),
        thumbnail: faker.image.url(),
        code: faker.string.alphanumeric({length: 10})
    };
};

export const generateOneHundredProducts = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct());
    }
    return products;
};

export const generateUser = () => {
    const numOfProducts = parseInt(faker.int({ min: 1, max: 9 }));
    const products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProducts());
    }

    return {
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.gender(),
        birthDate: faker.date.between({from: '1950-01-01', to: '2003-12-31'}),
        phone: faker.phone.phoneNumber(),
        imagen: faker.image.avatar(),
        id: faker.string.uuid(),
        email: faker.internet.email(),
        role: faker.string.fromCharacters(['cliente', 'vendedor']),
        isPremium: faker.datatype.boolean(),
        occupation: faker.person.jobTitle(),
        products
    };
};
