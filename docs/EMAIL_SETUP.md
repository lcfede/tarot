# Configuración de Emails — Visión Tarot

Este documento explica toda la infraestructura de emails del proyecto: envío transaccional, reenvío de recepción y Edge Function para el certificado.

---

## Arquitectura general

```
Envío  →  Resend (via SMTP o API)  →  hola@visiontarot.com
Recibo →  ImprovMX (forwarding)    →  visiontarotadmin@gmail.com
```

- **Resend**: servicio de envío de emails. Maneja todos los emails salientes (reset de contraseña, certificado).
- **ImprovMX**: servicio de reenvío. Cuando alguien responde a `hola@visiontarot.com`, el mail llega al Gmail personal.
- **Supabase SMTP**: configurado para usar Resend, así todos los emails del sistema (auth) salen desde `hola@visiontarot.com`.

---

## 1. Resend

### Cuenta y dominio
- URL: [resend.com](https://resend.com)
- Cuenta registrada con: `fedelanzacastelli@gmail.com`
- Plan: gratuito (3.000 emails/mes)
- Dominio verificado: `visiontarot.com`

### Registros DNS agregados en Hostinger para Resend

| Tipo | Nombre | Valor |
|------|--------|-------|
| TXT | `resend._domainkey` | `p=MIGf...` (DKIM) |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` (SPF) |
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` (DMARC) |

### API Key
- Guardada como secreto en Supabase: `RESEND_API_KEY`
- Para ver/regenerar: Resend dashboard → API Keys

### Configuración SMTP en Supabase
Supabase → Authentication → Settings → SMTP:

| Campo | Valor |
|-------|-------|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | API Key de Resend (`re_XXXXXXXXXX`) |
| Sender name | `Visión Tarot` |
| Sender email | `hola@visiontarot.com` |

Esto hace que todos los emails de Supabase (reset de contraseña, confirmaciones) salgan desde `hola@visiontarot.com`.

---

## 2. ImprovMX

### Para qué sirve
ImprovMX permite **recibir** emails en `hola@visiontarot.com` sin contratar un buzón de correo. Reenvía automáticamente todo lo que llegue a ese mail hacia el Gmail personal.

- URL: [improvmx.com](https://improvmx.com)
- Cuenta registrada con: `visiontarotadmin@gmail.com`
- Plan: gratuito

### Alias configurado
| Alias | Destino |
|-------|---------|
| `hola@visiontarot.com` | `visiontarotadmin@gmail.com` |

### Registros DNS agregados en Hostinger para ImprovMX

| Tipo | Nombre | Prioridad | Valor |
|------|--------|-----------|-------|
| MX | `@` | 10 | `mx1.improvmx.com` |
| MX | `@` | 20 | `mx2.improvmx.com` |

> **Nota:** ImprovMX es solo para recepción. No agregar el SPF de ImprovMX ya que puede conflictuar con el SPF de Resend.

---

## 3. Edge Function: send-certificate

### Ubicación
`supabase/functions/send-certificate/index.ts`

### Qué hace
Cuando un usuario completa el curso y genera su certificado:
1. El cliente genera el PDF del certificado en el browser (Canvas + jsPDF a escala 0.5 para reducir tamaño)
2. Convierte el PDF a base64
3. Llama a esta Edge Function con: `{ email, fullName, issuedDate, pdfBase64 }`
4. La función envía el email via API de Resend con el PDF adjunto

### Deploy
```bash
# Desde la carpeta del proyecto
supabase link --project-ref vhvkeueigdpwoilojrpp
supabase secrets set RESEND_API_KEY=re_XXXXXXXXXX
supabase functions deploy send-certificate --no-verify-jwt
```

> `--no-verify-jwt` es necesario para que la función acepte llamadas desde el browser sin validar el JWT de Supabase.

### Actualizar la función
Si modificás el código de la Edge Function, hay que re-deployar:
```bash
supabase functions deploy send-certificate --no-verify-jwt
```

---

## 4. Flujo completo de emails

### Reset de contraseña
1. Usuario va a `/login` → "¿Olvidaste tu contraseña?"
2. Supabase llama al SMTP de Resend
3. Resend envía el email desde `hola@visiontarot.com`
4. Template personalizado configurado en: Supabase → Authentication → Email Templates → Reset Password

### Certificado de finalización
1. Usuario completa todas las lecciones
2. Hace clic en "Descargar Certificado" en la última lección
3. Ingresa su nombre y confirma
4. El PDF se descarga en el browser automáticamente
5. En paralelo (no bloqueante): se llama a la Edge Function `send-certificate`
6. El usuario recibe el email con el PDF adjunto desde `hola@visiontarot.com`

### Recepción de emails
1. Alguien envía un mail a `hola@visiontarot.com`
2. ImprovMX lo intercepta via los registros MX
3. Lo reenvía automáticamente a `visiontarotadmin@gmail.com`

---

## 5. Resolución de problemas

### El email de reset no llega
- Verificar configuración SMTP en Supabase (puerto debe ser `465`)
- Verificar que el dominio esté verificado en Resend (DNS Settings → todo en verde)
- Revisar Resend → Logs para ver si hay errores de envío

### El email del certificado no llega
- Revisar Supabase → Edge Functions → Logs de `send-certificate`
- Verificar que `RESEND_API_KEY` esté seteado: `supabase secrets list`
- Verificar que la función esté deployada con `--no-verify-jwt`

### No recibo respuestas en el Gmail
- Verificar que los registros MX de ImprovMX estén en Hostinger DNS
- Ir a ImprovMX → inspector.improvmx.com para diagnosticar
- La propagación DNS puede tardar hasta 24-48hs

### Regenerar el API Key de Resend
1. Resend → API Keys → crear nueva key
2. Actualizar en Supabase SMTP: Authentication → Settings → Password
3. Actualizar el secreto de la Edge Function: `supabase secrets set RESEND_API_KEY=re_NUEVA_KEY`
4. Re-deployar: `supabase functions deploy send-certificate --no-verify-jwt`
