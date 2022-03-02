import { serialize } from 'cookie';
import Cookies from 'js-cookie';

export function getParsedCookie(key: string) {
  const cookieValue = Cookies.get(key); // Type is string | undefined

  // Narrowing
  if (!cookieValue) {
    return undefined;
  }

  try {
    return JSON.parse(cookieValue); // Type is string
  } catch (err) {
    return undefined;
  }
}

type LikedAnimal = { id: string; stars: number };
type LikedAnimals = LikedAnimal[];

export function setParsedCookie(key: string, value: LikedAnimals) {
  Cookies.set(key, JSON.stringify(value));
}

export function deleteCookie(key: string) {
  Cookies.remove(key);
}

export function stringifyCookieValue(value: LikedAnimals) {
  return JSON.stringify(value);
}

export function createSerializedRegisterSessionTokenCookie(token: string) {
  // check if we are in production e.g. Heroku
  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 10; // 10 minutes

  return serialize('sessionToken', token, {
    maxAge: maxAge,

    expires: new Date(Date.now() + maxAge * 1000),

    // Important for security
    httpOnly: true,
    // Important for security
    // Set secure cookies on production (eg. Heroku)
    secure: isProduction,
    path: '/',
    // Be explicit about new default behavior
    // in browsers
    // https://web.dev/samesite-cookies-explained/
    sameSite: 'lax',
  });
}
