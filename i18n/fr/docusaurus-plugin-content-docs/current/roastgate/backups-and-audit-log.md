---
sidebar_position: 7
title: Sauvegardes et journal d'audit
description: Comparer et restaurer les versions précédentes de vos fichiers, et voir qui a fait quoi.
---

# Sauvegardes et journal d'audit

## Sauvegardes

Chaque écrasement et chaque suppression faits depuis Roastgate conservent le contenu précédent du fichier, dans la base de données de Roastgate. Les **30 sauvegardes les plus récentes de chaque fichier** sont conservées.

Une modification refusée par nginx ne laisse aucune sauvegarde derrière elle, puisqu'elle ne ferait que répéter le fichier actuel.

![La liste des sauvegardes](@site/docs/roastgate/img/backups.png)

Ouvrez **Backups** depuis le menu, ou depuis le lien **history** de n'importe quel fichier. Filtrez par **Area** (reverse proxies, sites, listes blanches) et **File name**, puis cliquez sur **Show**.

Chaque sauvegarde indique quand elle a été prise, le fichier, la modification avant laquelle elle a été prise, et sa taille.

### Comparer et restaurer

Cliquez sur **Compare** pour voir la version à côté du fichier actuel, ligne par ligne : ce que la restauration **ajouterait** et **supprimerait**.

![Une sauvegarde comparée au fichier actuel, ligne par ligne](@site/docs/roastgate/img/backup-compare.png)

- Si le fichier a été supprimé depuis, la restauration le recrée.
- Si la version est identique au fichier actuel, la restauration ne change rien.

Cliquez sur **Restore this version**. Une restauration passe par le même cycle qu'un enregistrement : sauvegarde du fichier actuel, écriture, `nginx -t`, retour arrière si invalide, rechargement si valide. Une restauration peut donc elle-même être annulée.

## Journal d'audit {/* #audit-log */}

La page **Audit log** liste les 200 actions les plus récentes, de la plus récente à la plus ancienne : heure, auteur, action, cible, résultat et détails.

![Le journal d'audit](@site/docs/roastgate/img/audit-log.png)

Il enregistre les connexions et les échecs, les changements de mot de passe, d'authentification à deux facteurs et de passkeys, les changements de réglages, chaque modification de vos fichiers (enregistrement, activation, désactivation, suppression, restauration), les tests et rechargements de nginx, et les opérations sur les certificats.
