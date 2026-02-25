# Orientaciones App (React + Vite + Tailwind)

Interfaz institucional para **Registrar** y **Consultar** orientaciones. Colores base: `#21294C`.

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
```

## Ejecutar
```bash
npm run dev
```

## Conexión con API
Por defecto usa `/api`. Puedes cambiarlo con:
```bash
# Linux/Mac
export VITE_API_BASE="http://localhost:3000/api"
npm run dev

# Windows PowerShell
setx VITE_API_BASE "http://localhost:3000/api"
npm run dev
```

### Endpoints esperados
- `GET /api/orientaciones?identificacion=123` -> `{ found: boolean, items: Orientacion[] }`
- `POST /api/orientaciones` -> `{ ok: true, id: string }`


## Deploy en Vercel (API incluida)

Configura estas variables de entorno en Vercel:

- `TENANT_ID`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `FILE_SHARE_URL` (Copiar vínculo del Excel en OneDrive)
- `TABLE_NAME` (opcional, default: OrientacionesTable)

Luego al desplegar, tendrás:
- `GET /api/tipificaciones`
- `GET /api/orientaciones?id=...`
- `POST /api/orientaciones`
