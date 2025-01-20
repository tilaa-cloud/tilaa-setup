# Tilaa Setup action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Usage

This action can be used to sign in on the Tilaa-cloud API. This will make the Tilaa commandline tool 
available in GitHub Actions. The tool allows you to interact with our platform, like you can do
local.

We recommend to use secrets to pass you Tilaa username and password to make sure you do not expose them to
the world.

```yaml
steps:
  
  - name: Login to Tilaa
    uses: tilaa-cloud/tilaa-setup@main
    with:
      username: ${{ secrets.TILAA_USER }}
      password: ${{ secrets.TILAA_PASSWORD }}
  
  - name: 
    run: tilaa namespace list

  - name: 
    run: tilaa container modify --image hello-world -i <your-container-id>
```