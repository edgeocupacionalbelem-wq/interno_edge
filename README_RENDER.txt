PRONTO PARA RENDER

1. Crie um repositório novo no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. No Render, clique em New > Web Service.
4. Conecte o repositório.
5. O Render vai usar o render.yaml automaticamente.

Arquivos principais:
- app.py
- requirements.txt
- render.yaml
- ATESTADO_FISICO_MENTAL_TEMPLATE.docx
- ENCAMINHAMENTOS PERIODICO MCP.docx

Variáveis recomendadas no Render:
- SECRET_KEY: o render.yaml já gera automaticamente.
- ADMIN_USERNAME: opcional, mas recomendado para ativar login.
- ADMIN_PASSWORD: opcional, mas recomendado para ativar login.
- MAX_CONTENT_LENGTH: opcional. Padrão do sistema: 78643200 bytes, aproximadamente 75 MB.
- LOG_LEVEL: opcional. Exemplo: INFO.

Login:
- O login só é ativado se ADMIN_USERNAME e ADMIN_PASSWORD estiverem configurados.
- Se essas variáveis não existirem, o sistema abre normalmente.
- Para produção, configure as duas variáveis no Render.

Observações:
- O banco SQLite local não deve ser enviado com dados reais.
- Para o Render, use disco persistente se quiser manter cadastros no servidor.
- Veja ALTERACOES_PRIORITARIAS.md para entender todas as alterações desta versão.
