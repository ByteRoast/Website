---
slug: roastgate-0.2.0
title: Roastgate 0.2.0
authors: [sikelio]
tags: [release, roastgate, nginx, docker, dotnet, self_hosted]
---

**Roastgate 0.2.0** est sortie : vous pouvez désormais choisir ce que reçoivent les visiteurs hors de vos listes blanches, au lieu du 403 par défaut de nginx.

{/* truncate */}

## Choisir la réponse faite aux visiteurs refusés

Jusqu'ici, un proxy ou un site restreint par une liste blanche répondait à tous les autres avec le **403 Forbidden** de nginx. Ça fonctionne, mais ça indique aussi au monde entier que quelque chose se cache derrière ce domaine.

L'onglet **Access** de l'assistant dispose maintenant d'un réglage **Visitors outside the whitelists**, aussi bien pour les reverse proxies que pour les sites hébergés :

| Choix | Réponse | Quand l'utiliser |
|---|---|---|
| **Forbidden** (par défaut) | `403` | le comportement habituel de nginx, rien ne change pour les configurations existantes |
| **Not found** | `404` | masque l'existence du site |
| **Close the connection** | `444` | nginx coupe la connexion sans rien envoyer |
| **Redirect** | `302` vers l'adresse de votre choix | renvoyer les visiteurs vers votre site principal, par exemple |

Comme toujours, l'onglet d'aperçu montre exactement ce qui sera écrit. Avec un 404, la partie liste blanche de la configuration ressemble à ceci :

```nginx
include /etc/nginx/whitelists/office.conf;
deny all;

error_page 403 = @rg_denied;

location @rg_denied {
    allow all;
    return 404;
}
```

:::info
La réponse remplace **tous** les 403 du serveur, pas seulement ceux des listes blanches : les autres refus, comme les fichiers cachés bloqués, reçoivent la même réponse.
:::

Quelques garde-fous l'accompagnent :

- Le réglage nécessite **au moins une liste blanche** : sans elle, personne n'est refusé et l'assistant vous le signale.
- L'adresse de redirection est validée avant d'arriver dans le fichier : `http://` ou `https://`, un hôte, un port, un chemin et une query string optionnels, et rien qui puisse sortir de la ligne `return`.
- Le challenge Let's Encrypt reste accessible à tous, donc les renouvellements de certificats continuent de fonctionner quel que soit votre choix.

### Réouverture et import

Le réglage est relu depuis le fichier : rouvrir une configuration dans l'assistant, ou [importer une configuration écrite à la main](/blog/roastgate-0.1.0#importing-hand-written-configs), restaure le choix et l'adresse de redirection. Si la ligne `error_page 403 = @rg_denied;` ou son bloc `location @rg_denied` a été modifié à la main en quelque chose que l'assistant ne sait pas reproduire, l'import est refusé avec le numéro de ligne et la raison, et le fichier reste modifiable en texte brut.

## Pour les contributeurs

Le projet a aussi reçu ce qu'il lui fallait pour accueillir des contributions :

- Un [guide de contribution](https://github.com/ByteRoast/Roastgate/blob/main/CONTRIBUTING.md) qui couvre le style de code, les tests, les commits et l'accord de licence des contributeurs.
- Une [politique de sécurité](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md) pour signaler des vulnérabilités en privé.
- Des formulaires d'issue et un modèle de pull request.

L'image sur `ghcr.io/byteroast/roastgate` est désormais publique : plus besoin de `docker login` pour la récupérer.

## Comment obtenir Roastgate 0.2.0 ?

### Mise à jour

Depuis le dossier qui contient `docker-compose.yml` :

```bash
docker compose pull
docker compose up -d
```

Le fichier compose n'a perdu que deux commentaires dans cette version : inutile de le retélécharger.

:::warning[Alpha]
Roastgate en est toujours à ses versions alpha `0.x`. Sauvegardez le volume `roastgate-data` avant de mettre à jour :

```bash
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine tar czf /backup/roastgate-data.tgz -C /data .
```
:::

Pour rester sur cette version, utilisez le tag `0.2.0` au lieu de `latest` dans `docker-compose.yml`.

### Nouvelle installation

Suivez le [guide d'installation](/docs/roastgate/installation), ou l'article [Présentation de Roastgate 0.1.0](/blog/roastgate-0.1.0#how-can-i-get-roastgate) : les étapes sont les mêmes.

---

- [Roastgate sur GitHub](https://github.com/ByteRoast/Roastgate)
- [Release 0.2.0](https://github.com/ByteRoast/Roastgate/releases/tag/v0.2.0)
- [Signaler un problème](https://github.com/ByteRoast/Roastgate/issues)
