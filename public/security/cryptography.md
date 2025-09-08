import { Tag } from '@/components/Tag'

export const description = 'Cryptographic algorithms used in Phase Encryption'

<Tag variant="small">SECURITY</Tag>

# Cryptographic Algorithms

## Data Encryption - `XChaCha20-Poly1305`

`ChaCha20-Poly1305` is an authenticated encryption with additional data (AEAD) algorithm, that combines the ChaCha20 stream cipher with the Poly1305 message authentication code. Its usage in IETF protocols is standardized in RFC 8439.

![ChaCha20-Poly1305](/assets/ChaCha20-Poly1305_Encryption.png)

- `XChaCha20`: This is a variant of the ChaCha20 stream cipher, but it has a longer nonce size. The original ChaCha20 uses a 64-bit nonce, which is a number that should only be used once per key. However, managing nonces can be difficult in practice and reusing a nonce can lead to serious vulnerabilities. XChaCha20 increases the nonce size to 192 bits, significantly reducing the risk of nonce reuse.
- `Poly1305`: This is a message authentication code (MAC) that is used to ensure the integrity and authenticity of a message. It's secure and efficient, helping to ensure that an encrypted message hasn't been tampered with.

Comparison of `XChaCha20-Poly1305` with `AES-GCM`, a common mode of operation for AES:

- **Nonce Size**: `AES-GCM` uses a 96-bit nonce, whereas XChaCha20 uses a 192-bit nonce. This means XChaCha20 can handle a larger number of messages without nonce reuse, reducing the risk of vulnerabilities.

- **Block Sizes**: AES is a block cipher with a block size of 128 bits, whereas ChaCha20 is a stream cipher and does not have a block size in the same sense. Instead, it generates a "stream" of pseudo-random bytes which are XORed with the plaintext to produce the ciphertext. Stream ciphers like ChaCha20 can handle messages of any size without needing padding, whereas block ciphers like AES must pad messages to a multiple of the block size.

- **Resistance to Attacks**: Both AES and ChaCha20 are considered secure against known attacks when used correctly. However, AES can be vulnerable to certain side-channel attacks, such as timing attacks, if not implemented correctly. These attacks rely on information gained from the physical implementation of the cipher, like timing information or power consumption. ChaCha20's design is less susceptible to these kinds of attacks, making it potentially more secure in scenarios where these attacks are a concern.

- **Performance**: On systems with hardware support for AES (like the AES-NI instruction set on many modern CPUs), AES can be very fast. However, on systems without this support, ChaCha20 is faster.

Fun fact: `ChaCha20-Poly1305` is currently being used in TLS 1.3, Wireguard and others!

---

## Key agreement - `X25519`

The `X25519` key exchange algorithm is based on the Elliptic Curve Diffie-Hellman (ECDH) protocol, which uses the mathematics of elliptic curves to generate shared secret keys. In `X25519`, the elliptic curve used is `Curve25519`, which is a popular and efficient curve that is designed to be secure and resistant to attacks.

The key exchange process begins with each party generating a private key, which is a random 256-bit number. The private key is then used to calculate a public key by performing a scalar multiplication of the private key with a base point on the elliptic curve. The resulting public key is a point on the curve that can be shared with the other party over an insecure channel.

Once both parties have exchanged their public keys, they can each calculate a shared secret key by performing another scalar multiplication, this time using their own private key and the other party's public key. The resulting point on the curve is converted to a 256-bit shared secret key that can be used for subsequent encryption and decryption of messages.

## ![`Ed25519`](/assets/ed25519.png)

Comparison of `Curve25519` with `secp256k1` (Koblitz curve):

- **Security**: Both curves provide a similar level of security. However, the design of `Curve25519` has been considered more "rigid", meaning that it has been constructed to minimize the number of potential security pitfalls. This contrasts with `secp256k1` which has been criticized for having several potential weaknesses due to the curve's specific parameter choices.

- **Performance**: `Curve25519` generally provides superior performance due to its efficient curve operations.

The following table splits the SafeCurves requirements into:

- Basic parameter requirements
- ECDLP security requirements
- ECC security requirements beyond ECDLP security

| Curve                                                          | Safe? | [field](https://safecurves.cr.yp.to/field.html) | [equation](https://safecurves.cr.yp.to/equation.html) | [base](https://safecurves.cr.yp.to/base.html) | [rho](https://safecurves.cr.yp.to/rho.html) | [transfer](https://safecurves.cr.yp.to/transfer.html) | [disc](https://safecurves.cr.yp.to/disc.html) | [rigid](https://safecurves.cr.yp.to/rigid.html) | [ladder](https://safecurves.cr.yp.to/ladder.html) | [twist](https://safecurves.cr.yp.to/twist.html) | [complete](https://safecurves.cr.yp.to/complete.html) | [ind](https://safecurves.cr.yp.to/ind.html) |
| -------------------------------------------------------------- | ----- | ----------------------------------------------- | ----------------------------------------------------- | --------------------------------------------- | ------------------------------------------- | ----------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| `Anomalous`                                                    | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ❌                                                    | ❌                                            | ✅                                              | ❌                                                | ❌                                              | ❌                                                    | ❌                                          |
| `M-221`                                                        | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `E-222`                                                        | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `NIST P-224`                                                   | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ❌                                              | ❌                                                | ❌                                              | ❌                                                    | ❌                                          |
| `Curve1174`                                                    | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| <code className="text-emerald-500 font-bold">Curve25519</code> | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `BN(2,254)`                                                    | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ❌                                                    | ❌                                            | ✅                                              | ❌                                                | ❌                                              | ❌                                                    | ❌                                          |
| `brainpoolP256t1`                                              | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ❌                                                | ❌                                              | ❌                                                    | ❌                                          |
| `ANSSI FRP256v1`                                               | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ❌                                              | ❌                                                | ❌                                              | ❌                                                    | ❌                                          |
| `NIST P-256`                                                   | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ❌                                              | ❌                                                | ✅                                              | ❌                                                    | ❌                                          |
| `secp256k1`                                                    | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ❌                                            | ✅                                              | ❌                                                | ✅                                              | ❌                                                    | ❌                                          |
| `E-382`                                                        | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `M-383`                                                        | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `Curve383187`                                                  | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `brainpoolP384t1`                                              | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ❌                                                | ✅                                              | ❌                                                    | ❌                                          |
| `NIST P-384`                                                   | ❌    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ❌                                              | ❌                                                | ✅                                              | ❌                                                    | ❌                                          |
| `Curve41417`                                                   | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `Ed448-Goldilocks`                                             | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `M-511`                                                        | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |
| `E-521`                                                        | ✅    | ✅                                              | ✅                                                    | ✅                                            | ✅                                          | ✅                                                    | ✅                                            | ✅                                              | ✅                                                | ✅                                              | ✅                                                    | ✅                                          |

<div className="not-prose">
  <Button
    href="https://safecurves.cr.yp.to/"
    variant="text"
    arrow="right"
    children="Read more at SafeCurves"
  />
</div>

Fun fact: `Curve25519` is currently being used in TLS 1.3, Signal, Wireguard, Tor and others!

---

## Secret Sharing

Phase uses t=n XOR based secret sharing. The term "t=n XOR based secret sharing" refers to a cryptographic mechanism where a secret is divided into 'n' parts using XOR operations such that all 't' parts are needed to reconstruct the original secret. In this specific case, 't' equals 'n', which means that all parts are required to reconstruct the secret.

Here's how it works:

- **Secret Generation**: We start with a 256 bit secret which we want to split into 'shares', `privKey`.
- **Share Creation**: We generate a random, high-entropy offset key which is equal in length to the `privKey`, `offsetKey0`. One share of the secret `share0` is set to be this `offsetKey0`. The second share `share1` is the ⊕ result of `privKey` and `offsetKey0`.
- **Secret Reconstruction**: To reconstruct the secret, both shares are required. The original secret `privKey` can be recovered by calculating `share0 ⊕ share1` (i.e., `offsetKey0 ⊕ (privKey ⊕ offsetKey0)`).

The scheme ensures that each share individually provides no information about the original secret; only when combined do they reveal the secret. It's a simple, yet effective, method of secret sharing with symmetric properties - it doesn't matter which share is labeled as `share0` and which as `share1`. As long as they are stored securely, and not used across multiple secrets, this scheme can provide a solid layer of security. Phase Console also encrypts the share that is deployed via the KMS service with a key only you have access to, for a added layer of security. [Read more](/security/architecture#app-keys-and-secret-generation)

---

## Key derivation `Argon2`

`Argon2id` is a modern, high-security password hashing algorithm. It is a variant of the Argon2 algorithm, which won the Password Hashing Competition in 2015. `Argon2id` is designed to be resistant against a wide range of attacks, including both time-memory trade-off attacks and side-channel attacks.

`Argon2id` is unique because it combines the advantages of the two other modes of Argon2: Argon2i and Argon2d. It uses data-independent memory access (like Argon2i), which is preferred for password hashing and password-based key derivation, while also using data-dependent memory access (like Argon2d), which is preferred for cryptocurrencies and applications with no threats from side-channel timing attacks.

Comparison of `Argon2id` with `PBKDF2-SHA512`:

1. **Memory Usage**:
   `Argon2id` is designed to use a significant amount of memory, which can be configured. This makes it much harder for an attacker to use parallel hardware, such as GPUs or ASICs, to speed up attacks. `PBKDF2` does not use a significant amount of memory and therefore can be parallelized on hardware, making brute-force attacks more feasible.

2. **Security**:
   `Argon2id` provides a higher level of security due to its resistance to GPU cracking attacks, side-channel attacks, and its "memory-hard" properties.
   `PBKDF2`, while still considered secure, does not have these properties and is potentially more vulnerable to hardware-accelerated brute force attacks.

The issue is that the PBKDF2 algorithm doesn't require significant memory to compute the hash - it is not a "memory-hard" function. Therefore, it can be computed in parallel. This is where GPUs and ASICs come in. These types of hardware are designed to do many computations in parallel, so they can calculate many hashes simultaneously.

---

## References

[RFC 8439 - ChaCha20 and Poly1305 for IETF Protocols](https://www.rfc-editor.org/rfc/rfc8439)

[ChaCha20-Poly1305 - Wikipedia](https://en.wikipedia.org/wiki/ChaCha20-Poly1305)

[Ed2551 - Crypto++](https://www.cryptopp.com/wiki/Ed25519)

[Ed25519: high-speed high-security signatures - cr.yp.to](https://ed25519.cr.yp.to/)

[SafeCurves](https://safecurves.cr.yp.to/)

[Secret Sharing](https://en.wikipedia.org/wiki/Secret_sharing)
