---
title: "JavaScript SDK"
description: "SDK to integrate Phase in client-side JavaScript applications."
url: https://docs.phase.dev/sdks/js
---

# JavaScript SDK

SDK to integrate Phase in client-side JavaScript applications.

The JavaScript SDK can be used with any JavaScript client-side application to encrypt data client-side, in your users' browsers.

- [@phase.dev/phase-js](https://www.npmjs.com/package/@phase.dev/phase-js)
- [github.com/phasehq/client-js-sdk](https://github.com/phasehq/client-js-sdk)

> **Note:** In order to use the JavaScript SDK you will need to create a new App and get
>   an `APP_ID` from the Phase Console. Add the `APP_ID` to your application,
>   preferably using an environment variable. [Quick start &raquo;](https://docs.phase.dev/quickstart.md)

---

## Install the SDK

The JavaScript SDK is distributed via [npm](https://www.npmjs.com/package/@phase.dev/phase-js). You can install it using the following command for your preferred package manager.

**Install**

    **npm**

    ```bash
    npm i @phase.dev/phase-js
    ```

    **yarn**

    ```bash
    yarn add @phase.dev/phase-js
    ```

    **pnpm**

    ```bash
    pnpm i @phase.dev/phase-js
    ```

---

## Import the SDK

Once installed, you can import the JavaScript SDK into your project.

```js
import Phase from '@phase.dev/phase-js'
```

---

## Initialize the SDK

In order to use the SDK, you need to initialize it with your `APP_ID`.

```js
const phase = new Phase(APP_ID)
```

---

## Usage

Now that you have initialized the SDK, you can use it to encrypt data.

### Encrypt

The `encrypt` API allows you to encrypt a string. It returns a `Promise` that resolves in an encrypted string in the Phase Ciphertext format, so you need to `await` it.

```js
const ciphertext = await phase.encrypt('hello world')
```

---
