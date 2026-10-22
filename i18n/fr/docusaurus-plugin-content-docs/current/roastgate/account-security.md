---
sidebar_position: 8
title: Compte et sécurité
description: Authentification à deux facteurs, passkeys, sessions, et comment accéder à Roastgate en toute sécurité.
---

# Compte et sécurité

Roastgate contrôle votre serveur web, et son conteneur est privilégié avec `pid: host` : **quiconque contrôle Roastgate est, en pratique, root sur l'hôte.** Protégez-la en conséquence.

## Mot de passe

Utilisez un mot de passe long et unique. Il se change depuis **Settings → Change the password** (le mot de passe actuel est requis).

**Changer le mot de passe met fin à toutes les sessions ouvertes**, sur tous les appareils, en moins de 30 secondes. C'est aussi la réponse à une session volée.

Vous l'avez oublié ? Voir [Réinitialiser le mot de passe](./maintenance.md#forgot-the-password).

## Authentification à deux facteurs

Dans **Settings → Two-factor authentication**, cliquez sur **Set up two-factor authentication**.

![Configuration de l'authentification à deux facteurs : le QR code, la clé et le champ du code](@site/docs/roastgate/img/2fa-setup.png)

1. Scannez le QR code avec une application d'authentification ([Aegis](https://github.com/beemdevelopment/Aegis), [Google Authenticator](https://support.google.com/accounts/answer/1066447), [1Password](https://1password.com), [Bitwarden](https://bitwarden.com)…). Impossible de scanner ? Saisissez la clé affichée en dessous.
2. Saisissez le code à 6 chiffres affiché par l'application et cliquez sur **Turn on two-factor authentication**.
3. **Enregistrez les dix codes de récupération** maintenant : ils ne sont affichés qu'une seule fois. Chacun permet de vous connecter une fois si vous perdez votre téléphone.

![Les dix codes de récupération, affichés une seule fois](@site/docs/roastgate/img/2fa-recovery-codes.png)

La connexion se fait alors en deux étapes : le code n'est demandé qu'après un mot de passe correct.

- Un code ne peut être utilisé qu'une seule fois, et un décalage d'horloge d'une période (30 s) est toléré.
- Cinq codes erronés mettent fin à la tentative, et l'adresse du client est bloquée après cinq échecs.
- **Get new recovery codes** remplace les anciens codes (confirmez avec un code de l'application).
- **Turn it off** demande votre mot de passe et un code (ou un code de récupération).

Activer ou désactiver l'authentification à deux facteurs met fin à toutes les sessions, y compris celle-ci : vous vous reconnectez avec la nouvelle étape.

## Passkeys {/* #passkeys */}

Une passkey vous connecte avec une empreinte digitale, votre visage, le code PIN de l'appareil ou une clé de sécurité. Dans **Settings → Passkeys**, cliquez sur **Add a passkey**, donnez-lui un nom (`laptop`, `phone`…), confirmez avec votre mot de passe et suivez les instructions de votre navigateur.

![La section passkeys des réglages, avec une passkey](@site/docs/roastgate/img/passkeys.png)

Une passkey s'utilise de deux façons :

- **Seule** : cliquez sur **Sign in with a passkey** sur la page de connexion, sans mot de passe.
- **Comme seconde étape**, après le mot de passe, à la place du code d'authentification.

:::warning[Dès qu'une passkey existe, le mot de passe seul ne suffit plus]
Après le mot de passe, Roastgate demande toujours une passkey (ou un code, si l'authentification à deux facteurs est activée).
:::

- Une passkey ne fonctionne que sur l'**adresse sur laquelle elle a été créée** : `127.0.0.1`, ou le domaine de votre bloc server HTTPS. Les navigateurs n'autorisent les passkeys que sur `localhost` / `127.0.0.1` ou en HTTPS, donc un domaine en simple `http://` ne fonctionne pas.
- La liste indique quand chaque passkey a été ajoutée et utilisée pour la dernière fois.
- **Remove** demande votre mot de passe et met fin à toutes les sessions ouvertes.

Vous avez perdu votre téléphone, les codes de récupération et les passkeys ? Voir [Bloqué par l'authentification à deux facteurs](./maintenance.md#locked-out-of-two-factor).

## Accéder à Roastgate via nginx {/* #reach-roastgate-through-nginx */}

Par défaut, Roastgate n'est joignable que via un tunnel SSH. Pour l'ouvrir dans un navigateur sans tunnel, placez-la derrière votre nginx, avec Roastgate elle-même :

1. Créez une [liste blanche](./whitelists.md) avec vos propres adresses.
2. Créez un [reverse proxy](./reverse-proxies-and-sites.md#the-creation-wizard), par exemple `roastgate.example.com` :
   - **Forward to** : `http://127.0.0.1:8181`
   - **Support WebSockets** : activé (l'interface en a besoin)
   - **Access** : cochez votre liste blanche
   - **Let the Let's Encrypt validation through** : activé
3. [Obtenez un certificat](./certificates.md#get-a-certificate) pour le domaine, puis rouvrez le proxy et activez **HTTPS** et **Redirect HTTP to HTTPS**.
4. Dans `docker-compose.yml`, activez les deux variables et redémarrez avec `docker compose up -d` :

```yaml
    environment:
      ROASTGATE_SECURE_COOKIES: "true"
      ROASTGATE_TRUST_FORWARDED_HEADERS: "true"
```

Gardez le mappage de port sur `127.0.0.1:8181` : ainsi, seul votre nginx peut envoyer les en-têtes de transfert, et la limitation des connexions comme les listes blanches voient votre véritable adresse.

:::danger
N'activez jamais `ROASTGATE_TRUST_FORWARDED_HEADERS` si le port `8181` peut être atteint directement par d'autres : ils pourraient falsifier leur adresse.
:::

## Sessions et données

- Le cookie de session est `HttpOnly` et `SameSite=Strict`, et `Secure` avec `ROASTGATE_SECURE_COOKIES=true`.
- Les onglets ouverts sont revérifiés toutes les 30 secondes, donc une session terminée s'arrête rapidement.
- Le volume `/data` contient la base de données **et les clés qui chiffrent les cookies de session**. Sous Linux, ces clés sont stockées en clair : ne rendez le volume lisible que par root.

## Signaler une vulnérabilité

N'ouvrez pas d'issue publique. Signalez-la en privé via le [signalement privé de vulnérabilités de GitHub](https://github.com/ByteRoast/Roastgate/security/advisories/new), comme décrit dans la [politique de sécurité](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md).
