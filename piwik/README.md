# Addon Piwik Pro pour mviewer

Cet addon charge un conteneur Piwik Pro dans une application mviewer. Il initialise le data layer, ajoute le script distant du conteneur et expose le shim `ppms.tm.api` / `ppms.cm.api` utilisé par Piwik Pro.

Cette extension a été réalisée par le [SESAN](https://www.sesan.fr/).

L'addon est paramétrable depuis `config.json`: aucun hôte de conteneur ni nom de data layer n'est implicite dans le JavaScript.

## Prérequis

Cet addon nécessite un conteneur **Piwik Pro Tag Manager**. Il ne fonctionne pas tel quel avec Matomo classique, qui utilise une intégration différente basée sur `_paq`, `matomo.js` et `matomo.php`.

## Installation

Déclarer l'addon dans la configuration de l'application mviewer, puis adapter les valeurs de `options` dans `apps/addons/piwik/config.json`.

Exemple minimal:

```json
{
    "type": "module",
    "js": ["piwik.js"],
    "css": "empty.css",
    "target": "map",
    "html": "html/empty.html",
    "options": {
        "containerHost": "analytics.example.org",
        "containerIds": {
            "app.example.org": "11111111-1111-4111-8111-111111111111"
        },
        "defaultContainerId": "22222222-2222-4222-8222-222222222222",
        "dataLayerName": "dataLayer",
        "allowDebug": false
    }
}
```

## Parametres

| Parametre | Type | Obligatoire | Description |
| --- | --- | --- | --- |
| `containerHost` | `string` | Oui | Domaine qui sert le conteneur Piwik Pro, sans protocole ni chemin. Exemple: `analytics.example.org`. |
| `containerIds` | `object` | Non | Association entre un hote applicatif et un identifiant de conteneur Piwik Pro. Les cles peuvent etre le hostname seul (`app.example.org`) ou le host complet avec port (`localhost:8080`). |
| `defaultContainerId` | `string` | Non | Identifiant utilise si aucun hote de `containerIds` ne correspond. Laisser vide pour refuser le chargement sur les hotes non listes. |
| `dataLayerName` | `string` | Oui | Nom de la variable globale du data layer. Doit etre un identifiant JavaScript valide, par exemple `dataLayer`. |
| `allowDebug` | `boolean` | Non | Autorise le mode debug Piwik via `?stg_debug` ou le cookie `stg_debug=1`. Par defaut, utiliser `false` en production. |
| `referrerPolicy` | `string` | Non | Valeur appliquee a l'attribut `referrerPolicy` du script injecte. Par defaut: `strict-origin-when-cross-origin`. |
| `mviewers` | `object` | Non | Surcharge les options par identifiant d'application mviewer. |

## Selection du conteneur

Au chargement, l'addon cherche un identifiant de conteneur dans cet ordre:

1. `containerIds[window.location.host]`
2. `containerIds[window.location.hostname]`
3. `defaultContainerId`

Si aucun identifiant valide n'est trouve, le conteneur Piwik Pro n'est pas charge et une erreur est loggee dans la console.

## Configuration par application mviewer

Pour reutiliser le meme addon dans plusieurs applications, ajouter une cle `mviewers` indexee par `configuration.getConfiguration().application.id`.

```json
{
    "options": {
        "containerHost": "analytics.example.org",
        "containerIds": {
            "app.example.org": "11111111-1111-4111-8111-111111111111"
        },
        "defaultContainerId": "22222222-2222-4222-8222-222222222222",
        "dataLayerName": "dataLayer",
        "allowDebug": false,
        "mviewers": {
            "mon_app": {
                "containerIds": {
                    "mon-app.example.org": "11111111-1111-4111-8111-111111111111"
                },
                "defaultContainerId": ""
            }
        }
    }
}
```

Les valeurs declarees dans `mviewers.mon_app` remplacent les valeurs globales portant le meme nom.

## Securite

L'addon applique plusieurs controles avant d'injecter le script:

- chargement force en `https://`;
- validation du domaine `containerHost`;
- validation des identifiants de conteneur au format UUID;
- validation du `dataLayerName` comme identifiant JavaScript;
- encodage des parametres d'URL;
- cookie debug en `SameSite=Strict`, avec `Secure` quand la page est servie en HTTPS;
- mode debug desactive par defaut avec `allowDebug: false`.

Pour limiter le chargement aux domaines connus, renseigner `containerIds` et laisser `defaultContainerId` vide.
