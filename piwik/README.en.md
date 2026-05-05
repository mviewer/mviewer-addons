# Piwik Pro addon for mviewer

This addon loads a Piwik Pro container in an mviewer application. It initializes the data layer, injects the remote container script, and exposes the `ppms.tm.api` / `ppms.cm.api` shim used by Piwik Pro.

This extension was created by [SESAN](https://www.sesan.fr/).

The addon is configured from `config.json`: no container host or data layer name is implicit in the JavaScript code.

## Requirements

This addon requires a **Piwik Pro Tag Manager** container. It does not work as-is with classic Matomo, which uses a different integration based on `_paq`, `matomo.js`, and `matomo.php`.

## Installation

Declare the addon in the mviewer application configuration, then adapt the `options` values in `apps/addons/piwik/config.json`.

Minimal example:

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

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `containerHost` | `string` | Yes | Domain serving the Piwik Pro container, without protocol or path. Example: `analytics.example.org`. |
| `containerIds` | `object` | No | Mapping between an application host and a Piwik Pro container id. Keys can be the hostname only (`app.example.org`) or the full host with port (`localhost:8080`). |
| `defaultContainerId` | `string` | No | Container id used when no `containerIds` host matches. Leave empty to block loading on unlisted hosts. |
| `dataLayerName` | `string` | Yes | Global data layer variable name. Must be a valid JavaScript identifier, for example `dataLayer`. |
| `allowDebug` | `boolean` | No | Allows Piwik debug mode through `?stg_debug` or the `stg_debug=1` cookie. Keep `false` in production. |
| `referrerPolicy` | `string` | No | Value applied to the injected script `referrerPolicy` attribute. Default: `strict-origin-when-cross-origin`. |
| `mviewers` | `object` | No | Overrides options by mviewer application id. |

## Container Selection

On load, the addon looks for a container id in this order:

1. `containerIds[window.location.host]`
2. `containerIds[window.location.hostname]`
3. `defaultContainerId`

If no valid id is found, the Piwik Pro container is not loaded and an error is logged to the console.

## Per-Application Configuration

To reuse the same addon across several applications, add a `mviewers` key indexed by `configuration.getConfiguration().application.id`.

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
            "my_app": {
                "containerIds": {
                    "my-app.example.org": "11111111-1111-4111-8111-111111111111"
                },
                "defaultContainerId": ""
            }
        }
    }
}
```

Values declared in `mviewers.my_app` replace global values with the same name.

## Security

The addon applies several checks before injecting the script:

- forced `https://` loading;
- `containerHost` domain validation;
- UUID format validation for container ids;
- `dataLayerName` validation as a JavaScript identifier;
- URL parameter encoding;
- debug cookie set with `SameSite=Strict`, and `Secure` when the page is served over HTTPS;
- debug mode disabled by default with `allowDebug: false`.

To restrict loading to known domains, set `containerIds` and leave `defaultContainerId` empty.
