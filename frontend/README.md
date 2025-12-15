# Nutri2BeFit App 🥗

**Nutri2BeFit** es una aplicación moderna de planificación nutricional diseñada para simplificar la gestión de dietas diarias, haciendo que el proceso sea visual, intuitivo y eficiente.

Construida para **2BeFit**, esta herramienta permite a los usuarios:
-   Visualizar sus objetivos diarios de macronutrientes (Proteínas, Carbohidratos, Grasas, Verduras).
-   Generar menús diarios dinámicos ("Crea tu plato").
-   Guardar y gestionar historiales de comidas y menús favoritos.
-   Controlar su hidratación y progreso.

![Nutri2BeFit Banner](/brand-compact.png)

## ✨ Características Principales

*   **Generador de Menús Inteligente**: Interfaz interactiva para componer platos basados en raciones (Proteína, Carbohidrato, Grasa, Vegetal). Contadores en tiempo real contra objetivos diarios.
*   **Historial y Gestión**: Guarda tus días planificados. Copia comidas pasadas al día de hoy. Edita, renombra y organiza tus menús.
*   **Dashboard Visual**: "Cantidades Diarias" ofrece una vista rápida de tu progreso y objetivos.
*   **Diseño Premium**: Interfaz cuidada (Glassmorphism), totalmente responsiva y con modo oscuro/claro automático.
*   **Tipografía Optimizada**: Textos legibles y adaptados a dispositivos móviles.

## 🛠️ Tecnologías

Este proyecto está construido con un stack moderno y eficiente:

*   **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
*   **Backend / Base de Datos**: [Firebase](https://firebase.google.com/) (Firestore, Auth)
*   **Iconos**: Material Symbols

## 🚀 Instalación y Uso

Sigue estos pasos para correr el proyecto localmente:

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/appnutricion.git
    cd appnutricion/frontend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env.local` en la raíz de `frontend/` y añade tus credenciales de Firebase:
    ```env
    VITE_FIREBASE_API_KEY=tu_api_key
    VITE_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=tu_project_id
    ...
    ```

4.  **Correr en desarrollo**:
    ```bash
    npm run dev
    ```

5.  **Construir para producción**:
    ```bash
    npm run build
    ```

## 📦 Despliegue

La aplicación está lista para ser desplegada en **Vercel** o **Netlify**.
Consulta el archivo `DEPLOY.md` incluido en este repositorio para una guía paso a paso.

---
Desarrollado con ❤️ para 2BeFit.
