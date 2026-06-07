# Guía de Despliegue en Vercel — Shell Out 🚀

Esta guía detalla los pasos necesarios para desplegar la plataforma **Shell Out** (tanto el frontend en Vite como el backend en Express) en una única cuenta de **Vercel** usando la configuración monorepositorio optimizada.

---

## 📦 Estructura del Despliegue

Hemos configurado un archivo `vercel.json` en la raíz del proyecto para que Vercel compile el frontend estático y sirva los endpoints del backend Express en funciones Serverless bajo un mismo dominio (evitando problemas de CORS):

- **Frontend:** Compilado desde la carpeta `client/` usando Vite y guardado en `dist/`.
- **Backend:** Servido desde `server/server.js` bajo la ruta `/api/*`.

---

## ⚙️ Variables de Entorno a Configurar

Antes de desplegar en Vercel, asegúrate de añadir las siguientes variables de entorno en el panel de control del proyecto Vercel:

| Variable | Descripción | Valor Recomendado / Ejemplo |
| :--- | :--- | :--- |
| `MONGO_URI` | Cadena de conexión a MongoDB Atlas | `mongodb+srv://usuario:password@cluster.mongodb.net/shellout` |
| `JWT_SECRET` | Llave secreta para firmar tokens JWT | `una_clave_secreta_muy_segura_y_larga` |
| `SMTP_HOST` | Servidor SMTP para envío de correos | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `587` |
| `SMTP_USER` | Usuario SMTP (correo emisor) | `tu_correo@gmail.com` |
| `SMTP_PASS` | Contraseña de aplicación SMTP | `xxxx xxxx xxxx xxxx` |
| `SMTP_FROM` | Cabecera del correo emisor | `"Shell Out" <tu_correo@gmail.com>` |

---

## 🚀 Pasos para Desplegar

1. **Sube tu código a GitHub / GitLab / Bitbucket**:
   Asegúrate de empujar todos los cambios locales (incluyendo el archivo `vercel.json` de la raíz).

2. **Crea un Nuevo Proyecto en Vercel**:
   - Ve a tu panel de [Vercel](https://vercel.com).
   - Haz clic en **"Add New"** > **"Project"**.
   - Importa el repositorio de **Shell Out**.

3. **Configura el Proyecto**:
   - **Root Directory**: Deja la raíz del repositorio (no selecciones `client` ni `server`, vercel.json en la raíz se encargará de todo).
   - **Framework Preset**: Selecciona **Other** (Vercel leerá las directivas de construcción de `vercel.json`).

4. **Agrega las Variables de Entorno**:
   - Despliega la pestaña **"Environment Variables"** y añade cada una de las variables indicadas arriba.

5. **Haz clic en "Deploy"** ⚡:
   - Vercel construirá la interfaz estática en `client` y compilará la API Express en `server`.
   - Una vez finalizado, recibirás un subdominio de producción (ej. `shell-out.vercel.app`).

---

## 📱 Optimización de Responsividad Realizada

Hemos adaptado por completo la interfaz para ofrecer una experiencia prémium en todo tamaño de pantalla:

1. **Ajuste de Cabecera Móvil (`Header.jsx`)**:
   - En pantallas pequeñas (< 768px), la altura fija del contenedor del header se convierte en flexible (`height: auto`), evitando que el menú de navegación y los botones del carrito se desborden de forma superpuesta.
   - Las pestañas de navegación se centran y distribuyen en múltiples líneas de manera proporcional y elegante.

2. **Cuadrícula de Ajustes de Cuenta (`AccountSettings.jsx`)**:
   - Reemplazamos la cuadrícula rígida en línea (`gridTemplateColumns: '260px 1fr'`) por una clase reactiva (`.account-settings-grid`).
   - Ahora, en dispositivos móviles, el menú lateral de perfil se apila verticalmente por encima del formulario de contenido con un espaciado óptimo, en lugar de comprimirse a lo ancho.

3. **Endpoints Dinámicos en Cliente**:
   - Modificamos el contexto de autenticación (`AuthContext.jsx`) para cambiar automáticamente entre el puerto local (`http://localhost:5000`) cuando estás programando en local, y las rutas relativas (`/api/...`) en producción. Esto previene llamadas fallidas al servidor local en internet.
