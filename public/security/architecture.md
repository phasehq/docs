---
title: "Architecture"
description: "Learn about the cryptographic architecture used to generate encryption keys, secure keys for storage / transmission over the network and perform encryption or decryption operations."
url: https://docs.phase.dev/security/architecture
---

# Architecture

Phase is built on an end-to-end encryption architecture used to derive encryption keys, provision access, and securely store and transmit data across the platform.

Here we provide a detailed description of all the pieces of this architecture, including the processes used to generate root secrets, derive encryption keys, encrypt data, and cryptographically grant or revoke access to secrets.

Phase uses [libsodium](https://doc.libsodium.org/) for all primitive cryptographic operations including encryption, decryption, signatures, hashing and more.

---

## Generic operations

The following standardized processes are used across the platform to generate random numbers, compute session keys, and perform encryption and decryption operations.

### Random number generation

Phase uses the [ChaCha20 stream cipher](https://cr.yp.to/chacha/chacha-20080128.pdf) via libsodium's `crypto_kdf_keygen` utility for cryptographically secure random number generation (CSPRNG). A reliable entropy source such as `/dev/urandom` in server environments, or Web Crypto's `crypto.getRandomValues()` in browser environments is used to seed the CSPRNG.

### Key exchange

Phase uses elliptic-curve cryptography based on [Curve25519](https://en.wikipedia.org/wiki/Curve25519). Entities such as Users and Environments are initiated with Curve25519 public/private key-pairs, denoted as (K, k).

To securely encrypt data for transmission between entities *A* and *B*, a symmetric session key is computed via the [X25519](https://x25519.xargs.org/) key exchange protocol. This process allows *A* to compute a session key K<sub>session</sub> using their private key k<sub>A</sub> and *B*'s public key k<sub>B</sub>.

X25519(k<sub>A</sub>, K<sub>B</sub>) → K<sub>session</sub>

*B* can independently compute this session key using their private key k<sub>B</sub> and *A*'s public key K<sub>A</sub>.

X25519(k<sub>B</sub>, K<sub>A</sub>) → K<sub>session</sub>

This allows data that is encrypted with the session key to be securely stored or transmitted over the network, as only the intended recipient *B* can re-compute the session key and decrypt the ciphertext.

In most cases Phase uses an ephemeral Curve25519 keypair (K<sub>eph</sub>, k<sub>eph</sub>) for one side of this operation, along with the recipient's public key K<sub>recipient</sub> to derive the symmetric session key K<sub>session</sub>.

### Encryption

All encryption operations are done asymmetrically. Each operation uses an ephemeral keypair (K<sub>eph</sub>, k<sub>eph</sub>) in combination with the public key K<sub>recipient</sub> of the 'recipient' or 'target' to derive a symmetric session key K<sub>session</sub>.

The plaintext data D is then encrypted with K<sub>session</sub> using the [XChaCha-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305#XChaCha20-Poly1305_%E2%80%93_extended_nonce_variant) algorithm with a random IV to compute the ciphertext C. The ephemeral public key K<sub>eph</sub> is prepended to the ciphertext, and the corresponding private key is discarded.

The output of the encryption operation is a string that can be safely stored or transmitted over the network, and contains  K<sub>eph</sub> || C || IV

![phase encryption](https://docs.phase.dev/assets/images/security/phase-encryption.png)

### Decryption

All decryption operations are performed asymmetrically. Each operation uses the recipient's private key k<sub>recipient</sub> in combination with the ephemeral public key K<sub>eph</sub> prepended to the ciphertext to recreate the session key K<sub>session</sub>. The ciphertext C is decrypted using the appended IV.

![phase decryption](https://docs.phase.dev/assets/images/security/phase-decryption.png)

---

## Key Derivation

There are two primary classes of keys that must be derived to facilitate Phase's end-to-end encryption architecture:
- **User keys**: used for granular cryptographic access control
- **Environment keys**: used to encrypt and decrypt Secrets

### User Keys

Each Phase user account has a unique set of keys associated with it. Primarily, this consists of an Ed25519 signing key pair (K<sub>user</sub><sup>sign</sup>, k<sub>user</sub><sup>sign</sup>), derived deterministically from a high-entropy seed. This signing key pair is also used to derive an X25519 key-exchange keypair (K<sub>user</sub><sup>kx</sup>, k<sub>user</sub><sup>kx</sup>) for asymmetric encryption operations.

User keys are derived in two stages:
1) An *Account Seed* is derived deterministically from a combination of a high-entropy seed and the user's organization id.
2) The *Account Seed* is used to derive a set of keys used for encryption and decryption operations.

#### Account Seed Derivation

When setting up a new Phase account, a random high-entropy 32-byte seed is encoded as a 24-word mnemonic using the BIP39 wordlist. This mnemonic serves as the account recovery phrase. The mnemonic is hashed with Argon2ID with the following parameters:

- Input: Mnemonic with spaces replaced by `-` hyphens.
- Salt: 16-byte Blake2b hash of organization UUID.
- Memory: 1GB
- Iterations: 4

The output of this hash is used as the *Account Seed*.

#### Account Key Derivation from Seed

The *Account Seed* is then used to derive the following keys:

1) **PublicKey/PrivateKey Ed25519 keypair**:

A 32 byte Signing Key Seed is derived using libsodium `crypto_kdf_derive_from_key` (implemented using Blake2B) with constants:
  - KEY_ID = `1`
  - CONTEXT = `__sign__`

The Ed25519 signing key pair (K<sub>user</sub><sup>sign</sup>, k<sub>user</sub><sup>sign</sup>)  is then derived from the Signing Key Seed using libsodium `crypto_sign_seed_keypair(SigningKeySeed)`.

2) **Curve25519 key-exchange Keys** (K<sub>user</sub><sup>kx</sup>, k<sub>user</sub><sup>kx</sup>) are derived from the Ed25519 PublicKey/PrivateKey pair using libsodium utils `crypto_sign_ed25519_pk_to_curve25519` and `crypto_sign_ed25519_sk_to_curve25519` respectively.

3) A **Symmetric Key** is also derived from the *Account Seed*, although this is currently not used to encrypt or decrypt any data.
This symmetric key is computed using libsodium `crypto_kdf_derive_from_key` with constants:
      - KEY_ID = `0`
      - CONTEXT = `_secret_`

![user key derivation](https://docs.phase.dev/assets/images/security/user-key-derivation.png)

#### Device Key and Sudo Password

The account keys derived above are encrypted using a *Device Key* for secure storage on the device as well as the backend. This allows the user keyring to be decrypted by entering a single password, and held in memory for the duration of the session.

The *Device Key* is computed as an Argon2ID hash with the following parameters:
    - Input: User "sudo" password.
    - Salt: Blake2b hash of user email (16 bytes).
    - Memory: 64MB
    - Iterations: 2

The following data is encrypted using the *Device Key* and stored on the backend:

- **Encrypted Keyring**: account keys comprising Signing Key Pair and Symmetric Key.
- **Encrypted Mnemonic**: mnemonic recovery phrase.

![sudo password setup](https://docs.phase.dev/assets/images/security/sudo-password-setup.png)

When a user begins a session on the Phase Console, the encrypted keyring is retrieved from the server. The sudo password is used to compute the *Device Key*, which decrypts the keyring and makes the user's keys available in memory for the duration of the session.

![sudo password login](https://docs.phase.dev/assets/images/security/sudo-password-login.png)

### Environment Keys

Each Environment in a Phase App has a unique encryption key pair to allow secrets to be asymmetrically encrypted and decrypted.

A 32-byte high entropy seed Seed<sub>env</sub> is used to derive an X25519 keypair (K<sub>env</sub>, k<sub>env</sub>).

A 32-byte random salt Salt<sub>env</sub> is used to compute hashes of secret keys client-side, which in turn are used for server-side key lookups.

![environment keys](https://docs.phase.dev/assets/images/security/environment-keys.png)

### Key digests

Secret keys are hashed client-side using Blake2B with the corresponding Environments' salt. These hashes are stored alongside encrypted keys on the backend as a `key_digest` field. To perform a server-side key lookup, the client computes the hash and sends it to the backend as a query. The backend attempts to match the queried hash against the `key_digest` field across all secrets in the environment, and returns the matched secret if one is found.

Blake2B(input=secret.key, salt=Salt<sub>env</sub>, length=32bytes)

---

## Environment Access Provisioning

Users are granted access to environments cryptographically, by encrypting the environments' seed Seed<sub>env</sub> and salt Salt<sub>env</sub> with the user account's public key K<sub>user</sub><sup>kx</sup> to compute a *wrapped seed* and *wrapped salt* respectively. These are stored on the backend as an EnvironmentKey object.

![environment key wrapping for user](https://docs.phase.dev/assets/images/security/user-env-key-wrapping.png)

These "wrapped" keys are fetched from the server and decrypted client-side with the user's private key k<sub>user</sub><sup>kx</sup> to retrieve the environment seed and salt. The seed can then be used to re-derive (K<sub>env</sub>, k<sub>env</sub>) for secret encryption and decryption.

![environment key unwrapping for user](https://docs.phase.dev/assets/images/security/user-env-key-unwrapping.png)

---

## Secret Encryption / Decryption

Secret properties `key`, `value`, and `comment` are encrypted asymmetrically with XChaChaPoly1305 using the environment's public key K<sub>env</sub>. Each field encryption operation uses an ephemeral keypair and a random IV, as described in the [generic encryption](#encryption) description.

![secret encryption](https://docs.phase.dev/assets/images/security/secret-encryption.png)

Each field is decrypted using the environment's private key k<sub>env</sub>, the ephemeral public key and the IV that are appended to the ciphertext string as described in the [generic decryption](#decryption) description.

![secret decryption](https://docs.phase.dev/assets/images/security/secret-decryption.png)

Putting together the understanding of environment keys, access provisioning and secret encryption gives us a complete picture of how a user may encrypt and decrypt a single secret:

![e2e secret encryption](https://docs.phase.dev/assets/images/security/e2e-secret-encryption.png)
*User encrypting a single secret*

![e2e secret decryption](https://docs.phase.dev/assets/images/security/e2e-secret-decryption.png)
*User decrypting a single secret*

---

## Tokens

Tokens allow programmatic access to resources such as environments and secrets via the [Phase CLI](https://docs.phase.dev/cli.md), [API](https://docs.phase.dev/public-api.md), [SDKs](https://docs.phase.dev/sdks.md) or [Kubernetes Operator](https://docs.phase.dev/integrations/platforms/kubernetes.md). Tokens facilitate authentication to these resources, and some additionally contain the keys required to encrypt and decrypt secrets.

### User Tokens (PATs)

User tokens are used to programmatically access secrets stored in Phase as a User. The scope of the user token depends on the Apps and Environments the user has access to, and the role associated with their account.

User tokens are generated by securely splitting the user's private key and distributing these shares between the server and client token string:

  - A random 32-byte *Wrapping key* K<sub>wrapping</sub> is generated.
  - The User's private key k<sub>user</sub> is split into 2 shares, K<sub>user</sub> and s<sub>1</sub>.
  - The token string is assembled using s<sub>0</sub>, K<sub>wrapping</sub> and the user's public key K<sub>user</sub>.
  - s<sub>1</sub> is encrypted with K<sub>wrapping</sub> to compute a wrapped share s<sub>1</sub><sup>wrapped</sup> and stored on the backend.
  - The token string has the format: K<sub>user</sub>||s<sub>0</sub>||K<sub>wrapping</sub>

![user token construction](https://docs.phase.dev/assets/images/security/user-token-construction.png)

When the user token is invoked, the private key is reassembled by fetching the wrapped share from the server, decrypting it client-side and combining it with the share embedded in the client token:

  - Fetch s<sub>1</sub><sup>wrapped</sup> from the server
  - Decrypt s<sub>1</sub><sup>wrapped</sup> with K<sub>wrapping</sub> to retrieve s<sub>1</sub>
  - Reconstruct the User's private key k<sub>user</sub> from s<sub>0</sub> and s<sub>1</sub>

![user token usage](https://docs.phase.dev/assets/images/security/user-token-use.png)

Once reconstructed, the user's private key can be used to unwrap the *Wrapped Seed* from an EnvironmentToken object, derive a given environment's keypair and decrypt secrets. See [environment access provisioning](#environment-access-provisioning) for details.

### Service Account Tokens

Service account tokens are used to programmatically access secrets stored in Phase as a [Service Account](https://docs.phase.dev/access-control/service-accounts.md). The scope of the token depends on the Apps and Environments the service account has access to, and the role associated with the account.

Each service account has its own set of keys. When a service account is created in the Console, its keys are generated client-side: a random 24-word mnemonic is used to derive an *Account Seed* and an Ed25519 signing key pair, from which an X25519 key-exchange keypair (K<sub>sa</sub><sup>kx</sup>, k<sub>sa</sub><sup>kx</sup>) is derived, exactly as described in [user keys](#user-keys). The account keyring and mnemonic are encrypted asymmetrically (wrapped) with the public key K<sub>user</sub><sup>kx</sup> of each organization member whose role has access to Service Accounts, and stored on the backend. If server-side key management is enabled for the account, the keyring and mnemonic are additionally wrapped with the server's public key. Service accounts created via the [API](https://docs.phase.dev/public-api/service-accounts.md) always use server-side key management: the server generates a random Ed25519 key pair and wraps the keyring with its own public key.

Service account tokens work analogously to User tokens: they are generated by securely splitting the service account's private key and distributing these shares between the server and client token string:

- A random 32-byte *Token ID* and a random 32-byte *Wrapping key* K<sub>wrapping</sub> are generated
- The service account's private key k<sub>sa</sub><sup>kx</sup> is split into 2 shares: s<sub>0</sub> and s<sub>1</sub>
- The token string is assembled using the *Token ID*, the service account's public key K<sub>sa</sub><sup>kx</sup>, s<sub>0</sub> and K<sub>wrapping</sub>
- s<sub>1</sub> is encrypted with K<sub>wrapping</sub> to compute a wrapped share s<sub>1</sub><sup>wrapped</sup> and stored on the backend along with the *Token ID*
- The token string has the format: `pss_service:v2:`TokenId:K<sub>sa</sub><sup>kx</sup>:s<sub>0</sub>:K<sub>wrapping</sub>

These steps are performed in the browser by a user who can unwrap the service account keyring with their own private key. If server-side key management is enabled, the server can instead unwrap the keyring with its own private key, perform the same steps and return the token string once. In both cases the server stores the *Token ID*, the public key K<sub>sa</sub><sup>kx</sup> and s<sub>1</sub><sup>wrapped</sup>; s<sub>0</sub> and K<sub>wrapping</sub> exist only in the token string.

A service account is granted access to an environment in the same way as a user: the *Environment Seed* and *Environment Salt* are wrapped with the service account's public key K<sub>sa</sub><sup>kx</sup> and stored on the backend as an EnvironmentKey object. Access is provisioned to the account and not to individual tokens, so every token of a service account can access the same environments across any number of Apps, and creating or deleting a token does not require environment keys to be re-wrapped.

When a service account token is invoked, the service account's private key is re-assembled client-side:
  - Fetch s<sub>1</sub><sup>wrapped</sup> from the server
  - Decrypt s<sub>1</sub><sup>wrapped</sup> with K<sub>wrapping</sub> to retrieve s<sub>1</sub>
  - Reconstruct the service account's private key k<sub>sa</sub><sup>kx</sup> from s<sub>0</sub> and s<sub>1</sub>

The private key is used to unwrap the *Environment Seed*, which in turn can be used to derive the Environment keys and decrypt secrets. See [environment access provisioning](#environment-access-provisioning) for details.

## Lockbox
Lockbox allows secrets to be shared via a single link with a zero-trust encryption scheme.

To create a new lockbox link with some plaintext data P:
- A random 32-byte *Box Seed* is generated and used to derive a Curve25519 key pair (K<sub>box</sub>, k<sub>box</sub>)
- P is encrypted with the public key K<sub>box</sub> to compute ciphertext C, and the corresponding private key is discarded
- The ciphertext C is stored on the backend along with metadata such as the number of allowed views, link expiry etc and given a unique *Box ID*
- The *Box ID* and *Box Seed* are used to generate the link: `/lockbox/${boxId}#${boxSeed}`. Note that the *Box Seed* is added as a URL fragment prepended with `#`, and thus is only parsed by the browser, and never sent to the server.

![create lockbox](https://docs.phase.dev/assets/images/security/lockbox-create-box.png)

To retrieve and decrypt a secret shared via Lockbox:
- The *Box ID* is used to retrieve the ciphertext C from the server
- The *Box Seed* in the link URL fragment is used to compute the keypair (K<sub>box</sub>, k<sub>box</sub>) client-side
- Ciphertext C is decrypted with the box private key k<sub>box</sub> to get the original secret P

![open lockbox](https://docs.phase.dev/assets/images/security/lockbox-open-box.png)

---
