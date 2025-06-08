
export function appInitializerFactory(): () => Promise<boolean> {
  return async () => {
    console.log('APP_INITIALIZER corriendo, sin intentar restaurar sesión');
    return true;
  };
}
