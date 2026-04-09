# Habitly

Aplicativo mobile de acompanhamento de habitos com login social, dashboard, calendario e streaks.

Estrutura:

- `api`: Node.js + Express + PostgreSQL + TypeScript
- `mobile`: React Native + Expo + TypeScript

Orquestracao local:

- `docker-compose up --build`

Variaveis importantes:

- `JWT_SECRET`: segredo da API para assinar tokens JWT
- `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`: credenciais OAuth usadas pela API para trocar o `code` do Google por token
- `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`: credenciais OAuth usadas pela API para trocar o `code` do GitHub por token
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: client id publico do Google usado pelo app para iniciar o fluxo OAuth
- `EXPO_PUBLIC_GITHUB_CLIENT_ID`: client id publico do GitHub usado pelo app para iniciar o fluxo OAuth
- `EXPO_PUBLIC_API_URL`: URL da API acessivel pelo app

OAuth real:

- O app agora usa OAuth real com `expo-auth-session`.
- Neste projeto, o login Google foi configurado para usar apenas `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
- Para testar login real fora da web, use Development Build ou app standalone. O Expo Go nao e suficiente para esse fluxo com scheme customizado.
- Scheme configurado no app: `habitly`
- Redirect URI do Google no app: `habitly://oauth/google`
- Redirect URI do GitHub no app: `habitly://oauth/github`
- No GitHub OAuth App, configure o callback URL como `habitly://oauth/github`.
- No Google Cloud, o client id usado pelo app neste setup e o Web Client ID que voce criou.
