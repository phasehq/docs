import { Tag } from '@/components/Tag'

export const description =
  'Learn about the cryptographic architecture used to generate encryption keys, secure keys for storage / transmission over the network and perform encryption or decryption operations.'

<Tag variant="small">SECURITY</Tag>

# Architecture

Phase is built on an end-to-end encryption architecture used to derive encryption keys, provision access, and securely store and transmit data across the platform. {{ className: 'lead' }}

Here we provide a detailed description of all the pieces of this architecture, including the processes used to generate root secrets, derive encryption keys, encrypt data, and cryptographically grant or revoke access to secrets. {{ className: 'lead' }}

Phase uses [libsodium](https://doc.libsodium.org/) for all primitive cryptographic operations including encryption, decryption, signatures, hashing and more. {{ className: 'lead' }}

---

## Generic operations

The following standardized processes are used across the platform to generate random numbers, compute session keys, and perform encryption and decryption operations. {{ className: 'lead' }}

### Random number generation

Phase uses the [ChaCha20 stream cipher](https://cr.yp.to/chacha/chacha-20080128.pdf) via libsodium's `crypto_kdf_keygen` utility for cryptographically secure random number generation (CSPRNG). A reliable entropy source such as `/dev/urandom` in server environments, or Web Crypto's `crypto.getRandomValues()` in browser environments is used to seed the CSPRNG.

### Key exchange

Phase uses elliptic-curve cryptography based on [Curve25519](https://en.wikipedia.org/wiki/Curve25519). Entities such as Users and Environments are initiated with Curve25519 public/private key-pairs, denoted as <MathSymbol>(K, k)</MathSymbol>. 

To securely encrypt data for transmission between entities *A* and *B*, a symmetric session key is computed via the [X25519](https://x25519.xargs.org/) key exchange protocol. This process allows *A* to compute a session key <MathSymbol>K<sub>session</sub></MathSymbol> using their private key <MathSymbol>k<sub>A</sub></MathSymbol> and *B*'s public key <MathSymbol>k<sub>B</sub></MathSymbol>. 

<MathSymbol>X25519(k<sub>A</sub>, K<sub>B</sub>) → K<sub>session</sub></MathSymbol>

*B* can independently compute this session key using their private key <MathSymbol>k<sub>B</sub></MathSymbol> and *A*'s public key <MathSymbol>K<sub>A</sub></MathSymbol>. 

<MathSymbol>X25519(k<sub>B</sub>, K<sub>A</sub>) → K<sub>session</sub></MathSymbol>

This allows data that is encrypted with the session key to be securely stored or transmitted over the network, as only the intended recipient *B* can re-compute the session key and decrypt the ciphertext.     

In most cases Phase uses an ephemeral Curve25519 keypair <MathSymbol>(K<sub>eph</sub>, k<sub>eph</sub>)</MathSymbol> for one side of this operation, along with the recipient's public key <MathSymbol>K<sub>recipient</sub></MathSymbol> to derive the symmetric session key <MathSymbol>K<sub>session</sub></MathSymbol>.

### Encryption

All encryption operations are done asymmetrically. Each operation uses an ephemeral keypair <MathSymbol>(K<sub>eph</sub>, k<sub>eph</sub>)</MathSymbol> in combination with the public key <MathSymbol>K<sub>recipient</sub></MathSymbol> of the 'recipient' or 'target' to derive a symmetric session key <MathSymbol>K<sub>session</sub></MathSymbol>. 

The plaintext data <MathSymbol>D</MathSymbol> is then encrypted with <MathSymbol>K<sub>session</sub></MathSymbol> using the [XChaCha-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305#XChaCha20-Poly1305_%E2%80%93_extended_nonce_variant) algorithm with a random <MathSymbol>IV</MathSymbol> to compute the ciphertext <MathSymbol>C</MathSymbol>. The ephemeral public key <MathSymbol>K<sub>eph</sub></MathSymbol> is prepended to the ciphertext, and the corresponding private key is discarded.

The output of the encryption operation is a string that can be safely stored or transmitted over the network, and contains  <MathSymbol>K<sub>eph</sub> || C || IV</MathSymbol>

![phase encryption](/assets/images/security/phase-encryption.png)

### Decryption

All decryption operations are performed asymmetrically. Each operation uses the recipient's private key <MathSymbol>k<sub>recipient</sub></MathSymbol> in combination with the ephemeral public key <MathSymbol>K<sub>eph</sub></MathSymbol> prepended to the ciphertext to recreate the session key <MathSymbol>K<sub>session</sub></MathSymbol>. The ciphertext <MathSymbol>C</MathSymbol> is decrypted using the appended <MathSymbol>IV</MathSymbol>. 

![phase decryption](/assets/images/security/phase-decryption.png)

---

## Key Derivation

There are two primary classes of keys that must be derived to facilitate Phase's end-to-end encryption architecture:
- **User keys**: used for granular cryptographic access control
- **Environment keys**: used to encrypt and decrypt Secrets

### User Keys

Each Phase user account has a unique set of keys associated with it. Primarily, this consists of an Ed25519 signing key pair (<MathSymbol>K<sub>user</sub><sup>sign</sup></MathSymbol>, <MathSymbol>k<sub>user</sub><sup>sign</sup></MathSymbol>), derived deterministically from a high-entropy seed. This signing key pair is also used to derive an X25519 key-exchange keypair (<MathSymbol>K<sub>user</sub><sup>kx</sup></MathSymbol>, <MathSymbol>k<sub>user</sub><sup>kx</sup></MathSymbol>) for asymmetric encryption operations.

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

The Ed25519 signing key pair (<MathSymbol>K<sub>user</sub><sup>sign</sup></MathSymbol>, <MathSymbol>k<sub>user</sub><sup>sign</sup></MathSymbol>)  is then derived from the Signing Key Seed using libsodium `crypto_sign_seed_keypair(SigningKeySeed)`.

2) **Curve25519 key-exchange Keys** (<MathSymbol>K<sub>user</sub><sup>kx</sup></MathSymbol>, <MathSymbol>k<sub>user</sub><sup>kx</sup></MathSymbol>) are derived from the Ed25519 PublicKey/PrivateKey pair using libsodium utils `crypto_sign_ed25519_pk_to_curve25519` and `crypto_sign_ed25519_sk_to_curve25519` respectively.

3) A **Symmetric Key** is also derived from the *Account Seed*, although this is currently not used to encrypt or decrypt any data.
This symmetric key is computed used libsodium `crypto_kdf_derive_from_key` with constants:
      - KEY_ID = `0`
      - CONTEXT = `_secret_`

![user key derivation](/assets/images/security/user-key-derivation.png)

#### Device Key and Sudo Password

The account keys derived above are encrypted using a *Device Key* for secure storage on the device as well as the backend. This allows the user keyring to be decrypted by entering a single password, and held in memory for the duration of the session. 

The *Device Key* is computed as a Argon2ID hash with the following parameters:
    - Input: User "sudo" password.
    - Salt: Blake2b hash of user email (16 bytes).
    - Memory: 64MB
    - Iterations: 2

The following data is encrypted using the *Device Key* and stored on the backend:

- **Encrypted Keyring**: account keys comprising Signing Key Pair and Symmetric Key.
- **Encrypted Mnemonic**: mnemonic recovery phrase.

![sudo password setup](/assets/images/security/sudo-password-setup.png)


When a user begins a session on the Phase Console, the encrypted keyring is retrieved from the server. The sudo password is used to compute the *Device Key*, which decrypts the keyring and makes the user's keys available in memory for the duration of the session.

![sudo password login](/assets/images/security/sudo-password-login.png)


### Environment Keys

Each Environment in a Phase App has a unique encryption key pair to allow secrets to be asymmetrically encrypted and decrypted. 

A 32-byte high entropy seed <MathSymbol>Seed<sub>env</sub></MathSymbol> is used to derive an X25519 keypair (<MathSymbol>K<sub>env</sub></MathSymbol>, <MathSymbol>k<sub>env</sub></MathSymbol>).

A 32-byte random salt <MathSymbol>Salt<sub>env</sub></MathSymbol> is used to compute hashes of secret keys client-side, which in turn are used for server-side key lookups.  

![environment keys](/assets/images/security/environment-keys.png)


### Key digests

Secret keys are hashed client-side using Blake2B with the corresponding Environments' salt. These hashes are stored along side encrypted keys on the backend as a `key_digest` field. To perform a server-side key lookups, the client computes the hash and sends it to the backend as a query. The backend attempts to match the queried hash against the `key_digest` field across all secrets in the environment, and returns the matched secret if one is found. 

<MathSymbol>Blake2B(input=secret.key, salt=Salt<sub>env</sub>, length=32bytes)</MathSymbol>

---

## Environment Access Provisioning

Users are granted access to environments cryptographically, by encrypting the environments' seed <MathSymbol>Seed<sub>env</sub></MathSymbol> and salt <MathSymbol>Salt<sub>env</sub></MathSymbol> with the user account's public key <MathSymbol>K<sub>user</sub><sup>kx</sup></MathSymbol> to compute a *wrapped seed* and *wrapped salt* respectively. These are stored on the backend as an EnvironmentKey object. 

![environment key wrapping for user](/assets/images/security/user-env-key-wrapping.png)

These "wrapped" keys are fetched from the server and decrypted client-side with the user's private key <MathSymbol>k<sub>user</sub><sup>kx</sup></MathSymbol> to retrieve the environment seed and salt. The seed can then be used to re-derive (<MathSymbol>K<sub>env</sub></MathSymbol>, <MathSymbol>k<sub>env</sub></MathSymbol>) for secret encryption and decryption.

![environment key unwrapping for user](/assets/images/security/user-env-key-unwrapping.png)

---

## Secret Encryption / Decryption

Secret properties `key`, `value`, and `comment` are encrypted asymmetrically with XChaChaPoly1305 using the environment's public key <MathSymbol>K<sub>env</sub></MathSymbol>. Each field encryption operation uses an ephemeral keypair and a random IV, as described in the [generic encryption](#encryption) description.

![secret encryption](/assets/images/security/secret-encryption.png)

Each field is decrypted using the environment's private key <MathSymbol>k<sub>env</sub></MathSymbol>, the ephemeral public key and the IV that are appended to the ciphertext string as described in the [generic decryption](#decryption) description.

![secret decryption](/assets/images/security/secret-decryption.png)

Putting together the understanding of environment keys, access provisioning and secret encryption gives us a complete picture of how a user may encrypt and decrypt a single secret:

![e2e secret encryption](/assets/images/security/e2e-secret-encryption.png)
*User encrypting a single secret* {{ className: 'text-sm text-center' }}

![e2e secret decryption](/assets/images/security/e2e-secret-decryption.png)
*User decrypting a single secret* {{ className: 'text-sm text-center' }}

---

## Tokens

Tokens allow programmatic access to resources such as environments and secrets via the [Phase CLI](/cli), [API](/public-api), [SDKs](/sdks) or [Kubernetes Operator](/integrations/platforms/kubernetes). Tokens facilitate authentication to these resources, and some additionally contain the keys required to encrypt and decrypt secrets.

### User Tokens (PATs)

User tokens are are used to programmatically access secrets stored in Phase as a User. The scope of the user token depends on the Apps and Environments the user has access to, and the role associated with their account.

User tokens are generated be securely splitting the user's private key and distributing these shares between the server and client token string:

  - A random 32-byte *Wrapping key* <MathSymbol>K<sub>wrapping</sub></MathSymbol> is generated.
  - The User's private key <MathSymbol>k<sub>user</sub></MathSymbol> is split into 2 shares, <MathSymbol>K<sub>user</sub></MathSymbol> and <MathSymbol>s<sub>1</sub></MathSymbol>.
  - The token string is assembled using <MathSymbol>s<sub>0</sub></MathSymbol>, <MathSymbol>K<sub>wrapping</sub></MathSymbol> and the user's public key <MathSymbol>K<sub>user</sub></MathSymbol>.
  - <MathSymbol>s<sub>1</sub></MathSymbol> is encrypted with <MathSymbol>K<sub>wrapping</sub></MathSymbol> to compute a wrapped share <MathSymbol>s<sub>1</sub><sup>wrapped</sup></MathSymbol> and stored on the backend.
  - The token string has the format: <MathSymbol>K<sub>user</sub></MathSymbol>||<MathSymbol>s<sub>0</sub></MathSymbol>||<MathSymbol>K<sub>wrapping</sub></MathSymbol>

![user token construction](/assets/images/security/user-token-construction.png)

When the user token is invoked, the private key is reassembled by fetching the wrapped share from the server, decrypting it client-side and combining it with the share embedded in the client token:

  - Fetch <MathSymbol>s<sub>1</sub><sup>wrapped</sup></MathSymbol> from the server
  - Decrypt <MathSymbol>s<sub>1</sub><sup>wrapped</sup></MathSymbol> with <MathSymbol>K<sub>wrapping</sub></MathSymbol> to retrieve <MathSymbol>s<sub>1</sub></MathSymbol>
  - Reconstruct the User's private key <MathSymbol>k<sub>user</sub></MathSymbol> from <MathSymbol>s<sub>0</sub></MathSymbol> and <MathSymbol>s<sub>1</sub></MathSymbol>

![user token usage](/assets/images/security/user-token-use.png)

Once reconstructed, the user's private key can be used to unwrap the *Wrapped Seed* from an EnvironmentToken object, derive a given environment's keypair and decrypt secrets. See [environment access provisioning](#environment-access-provisioning) for details.



### Service Tokens

Service tokens are are used to programmatically access secrets stored in Phase. They can be scoped to one or more environments of an application. Service tokens work analogously to User tokens, but instead of using a pre-existing asymmetric keypair, a new random key pair is generated.

- A random public/private Curve25519 keypair (<MathSymbol>K<sub>token</sub></MathSymbol>, <MathSymbol>k<sub>token</sub></MathSymbol>) is generated
- Additionally, a 32-byte *Token ID* and a random *Wrapping Key* <MathSymbol>K<sub>wrapping</sub></MathSymbol> are generated
- The token private key <MathSymbol>k<sub>token</sub></MathSymbol> is split into 2 shares: <MathSymbol>s<sub>0</sub></MathSymbol> and <MathSymbol>s<sub>1</sub></MathSymbol>
- The token string is assembled using <MathSymbol>s<sub>0</sub></MathSymbol>, <MathSymbol>K<sub>wrapping</sub></MathSymbol>, the token's public key <MathSymbol>K<sub>token</sub></MathSymbol>, and the *Token ID*
- <MathSymbol>s<sub>1</sub></MathSymbol> is encrypted with <MathSymbol>K<sub>wrapping</sub></MathSymbol> to compute a wrapped share <MathSymbol>s<sub>1</sub><sup>wrapped</sup></MathSymbol> and stored on the backend
- The token string has the format: <MathSymbol>K<sub>token</sub></MathSymbol>||<MathSymbol>s<sub>0</sub></MathSymbol>||<MathSymbol>K<sub>wrapping</sub></MathSymbol>||<MathSymbol>TokenId</MathSymbol>

![service token construction](/assets/images/security/service-token-construction.png)

For each environment that the service token is scoped to, the respective *Environment Salt* and *Environment Seed* are encrypted asymmetrically (wrapped) with the service token publicKey <MathSymbol>K<sub>token</sub></MathSymbol> and stored on the backend. 

When a service token is invoked, the token private key is re-assembled client-side:
  - Fetch <MathSymbol>s<sub>1</sub><sup>wrapped</sup></MathSymbol> from the server
  - Decrypt <MathSymbol>s<sub>1</sub><sup>wrapped</sup></MathSymbol> with <MathSymbol>K<sub>wrapping</sub></MathSymbol> to retrieve <MathSymbol>s<sub>1</sub></MathSymbol>
  - Reconstruct the token private key <MathSymbol>k<sub>token</sub></MathSymbol> from <MathSymbol>s<sub>0</sub></MathSymbol> and <MathSymbol>s<sub>1</sub></MathSymbol>.


![service token usage](/assets/images/security/service-token-use.png)

The private key is used to unwrap the *Environment Seed*, which in turn can be used to derive the Environment keys and decrypt secrets. See [environment access provisioning](#environment-access-provisioning) for details.

## Lockbox
Lockbox allows secrets to be shared via a single link with a zero-trust encryption scheme. 

To create a new lockbox link with some plaintext data <MathSymbol>P</MathSymbol>:
- A random 32-byte *Box Seed* is generated and used to derive a Curve25519 key pair (<MathSymbol>K<sub>box</sub></MathSymbol>, <MathSymbol>k<sub>box</sub></MathSymbol>)
- <MathSymbol>P</MathSymbol> is encrypted with the public key <MathSymbol>K<sub>box</sub></MathSymbol> to compute ciphertext <MathSymbol>C</MathSymbol>, and the corresponding private key is discarded
- The ciphertext <MathSymbol>C</MathSymbol> is stored on the backend along with metadata such as the number of allowed views, link expiry etc and given a unique *Box ID*
- The *Box ID* and *Box Seed* are used to generate the link: `/lockbox/${boxId}#${boxSeed}`. Note that the *Box Seed* is added as a URL fragment prepended with `#`, and thus only is only parsed by the browser, and never sent to the server.

![create lockbox](/assets/images/security/lockbox-create-box.png)

To retrieve and decrypt a secret shared via Lockbox:
- The *Box ID* is used to retrieve the ciphertext <MathSymbol>C</MathSymbol> from the server
- The *Box Seed* in the link URL fragment is used to compute the keypair (<MathSymbol>K<sub>box</sub></MathSymbol>, <MathSymbol>k<sub>box</sub></MathSymbol>) client-side
- Ciphertext <MathSymbol>C</MathSymbol> is decrypted with the box private key <MathSymbol>k<sub>box</sub></MathSymbol> to get the original secret <MathSymbol>P</MathSymbol>

![open lockbox](/assets/images/security/lockbox-open-box.png)

---

