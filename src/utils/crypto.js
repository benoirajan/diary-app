/**
 * Crypto utility using Web Crypto API for Client-Side Encryption
 * SoulScript (formerly AI Diary) - Private Diary Implementation
 */

const ENCRYPTION_ALGO = 'AES-GCM';
const KEY_DERIVATION_ALGO = 'PBKDF2';
const HASH_ALGO = 'SHA-256';
const ITERATIONS = 100000;
const KEY_LENGTH = 256;

/**
 * Derives an AES-GCM key from a password and salt.
 */
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: KEY_DERIVATION_ALGO },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: KEY_DERIVATION_ALGO,
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    passwordKey,
    { name: ENCRYPTION_ALGO, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string using a password.
 * Returns a base64 encoded string containing: salt (16 bytes) + iv (12 bytes) + ciphertext
 */
export async function encrypt(text, password) {
  if (!text || !password) return text;

  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const key = await deriveKey(password, salt);
  
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGO, iv },
    key,
    enc.encode(text)
  );

  // Combine salt + iv + ciphertext into a single buffer
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);

  // Convert to base64
  return btoa(String.fromCharCode.apply(null, combined));
}

/**
 * Decrypts a base64 string using a password.
 */
export async function decrypt(encryptedBase64, password) {
  if (!encryptedBase64 || !password) return encryptedBase64;

  try {
    const combined = new Uint8Array(
      atob(encryptedBase64)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await deriveKey(password, salt);

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGO, iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Could not decrypt data. Incorrect password or corrupted data.');
  }
}
