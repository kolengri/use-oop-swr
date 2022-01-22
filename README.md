# use-oop-swr

## OOP useSWR hook wrapper

[![NPM](https://img.shields.io/npm/v/use-oop-swr.svg)](https://www.npmjs.com/package/use-oop-swr)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Badges](https://badgen.net/npm/license/use-oop-swr)](https://www.npmjs.com/package/use-oop-swr)
[![Badges](https://badgen.net/npm/dependents/use-oop-swr)](https://www.npmjs.com/package/use-oop-swr)
[![Badges](https://badgen.net/npm/types/use-oop-swr)](https://www.npmjs.com/package/use-oop-swr)
[![Badges](https://badgen.net/github/issues/kolengri/use-oop-swr)](https://www.npmjs.com/package/use-oop-swr)
[![Badges](https://badgen.net/bundlephobia/min/use-oop-swr)](https://bundlephobia.com/result?p=use-oop-swr)
[![Badges](https://badgen.net/bundlephobia/minzip/use-oop-swr)](https://bundlephobia.com/result?p=use-oop-swr)

## Install

### 1. Install package

```bash
npm install --save use-oop-swr
```

```bash
yarn add use-oop-swr
```

### 2. Install class-transformer and reflect-metadata

1. `class-transformer` installation

   ```bash
   npm install class-transformer --save
   ```

   ```bash
   yarn add class-transformer
   ```

2. `reflect-metadata` shim is required, install it too:

   ```bash
   npm install reflect-metadata --save
   ```

   ```bash
   yarn add reflect-metadata
   ```

   add to the top of index.tsx

   ```tsx
   import 'reflect-metadata';
   ```

   or add to `<script>` `reflect-metadata` in the head of your `index.html`:

   ```html
   <html>
     <head>
       <!-- ... -->
       <script src="node_modules/reflect-metadata/Reflect.js"></script>
     </head>
     <!-- ... -->
   </html>
   ```

## Usage

The aim of this package is to end up with annoying practice of adding properties to data received from api with swr.

### In JavaScript there are two types of objects

plain (literal) objects
class (constructor) objects
Plain objects are objects that are instances of Object class. Sometimes they are called literal objects, when created via {} notation. Class objects are instances of classes with own defined constructor, properties and methods. Usually you define them via class notation.

So, what is the problem?

Sometimes you want to transform plain javascript object to the ES6 classes you have. For example, if you are loading a json from your backend, some api or from a json file, and after you JSON.parse it you have a plain javascript object, not instance of class you have.

For example you have a list of users in your users.json that you are loading:

```json
[
  {
    "id": 1,
    "firstName": "Johny",
    "lastName": "Cage",
    "age": 27
  },
  {
    "id": 2,
    "firstName": "Ismoil",
    "lastName": "Somoni",
    "age": 50
  },
  {
    "id": 3,
    "firstName": "Luke",
    "lastName": "Dacascos",
    "age": 12
  }
]
```

And you have a User class:

```jsx
export class User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;

  getName() {
    return this.firstName + ' ' + this.lastName;
  }

  isAdult() {
    return this.age > 36 && this.age < 60;
  }
}
```

You are assuming that you are downloading users of type User with swr and may want to write following code:

```tsx
import * as React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { User } from './User';

export type UsersProps = {};

export const Users: React.FC<UsersProps> = (props) => {
  const { data } = useSWR<User[]>('yourapiendpoint/users', (url) =>
    axios.get(url).then((res) => res.data)
  );

  return <div>{JSON.stringify(data)}</div>;
};
```

In this code you can use users[0].id, you can also use users[0].firstName and users[0].lastName. However you cannot use users[0].getName() or users[0].isAdult() because "users" actually is array of plain javascript objects, not instances of User object. You actually lied to compiler when you said that its users: User[].

So what to do? How to make a users array of instances of User objects instead of plain javascript objects? Solution is to create new instances of User object and manually copy all properties to new objects. But things may go wrong very fast once you have a more complex object hierarchy.

Alternatives? Yes, you can use use-oop-swr. Purpose of this library is to help you to map your plain javascript objects to the instances of classes you have.

This library also great for models exposed in your APIs, because it provides a great tooling to control what your models are exposing in your API. Here is an example how it will look like:

```tsx
import * as React from 'react';
import { useOOPSWR } from 'use-oop-swr';
import axios from 'axios';
import useSWR from 'swr';
import { User } from './User';

export type UsersProps = {};

export const Users: React.FC<UsersProps> = (props) => {
  const { data } = useOOPSWR(
    User, // <--- Cool!
    useSWR('yourapiendpoint/users', (url) =>
      axios.get(url).then((res) => res.data)
    )
  );

  return <div>{JSON.stringify(data)}</div>;
};
```

Now you can use users[0].getName() and users[0].isAdult() methods.

### Arguments

- `classInstance: InstanceType`: Class instance of needly data
- `swrData:? SWRResponse`: SWR Response object. [Docs](https://swr.vercel.app/docs/getting-started)
- `options:? ClassTransformOptions`: Options of class-transform plainToInstance function. [Docs](https://github.com/typestack/class-transformer/blob/develop/README.md#plaintoclass)

## Inspired by

- [SWR](https://swr.vercel.app)
- [class-transformer](https://github.com/typestack/class-transformer)

## License

MIT © [kolengri](https://github.com/kolengri)
