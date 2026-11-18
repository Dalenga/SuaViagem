# Rota — diário de viagem offline (demo)

App React Native (Expo) com foto, GPS e texto, salvo no aparelho (SQLite no celular, localStorage no navegador).
Esta demo **não tem backend AWS**: ela mostra a parte do app descrita no documento do trabalho.

## Publicar no GitHub (link para enviar)
1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`.
2. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Abra a aba **Actions** e aguarde o workflow terminar (2 a 4 min).
4. O link será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` (aparece também no fim do workflow).

## Rodar localmente
```
npm install --legacy-peer-deps
npx expo install --fix
npx expo start        # pressione w para o navegador, ou leia o QR code com o Expo Go
```

## Observações
- No navegador, a câmera abre o seletor de arquivos do aparelho e a localização exige HTTPS (o GitHub Pages tem).
- No navegador as fotos são guardadas no localStorage (limite ~5 MB); no celular ficam no armazenamento do app.
