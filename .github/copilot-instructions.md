# MiniQR Custom — Instruções do Projeto

## Objetivo

Este projeto é uma versão customizada e simplificada do MiniQR para uso interno na geração de QR Codes destinados à produção gráfica.

A aplicação deve continuar sendo uma aplicação estática, executada inteiramente no navegador e compatível com GitHub Pages.

Não criar backend, banco de dados ou dependências de APIs externas para geração dos QR Codes.

O objetivo não é criar um gerador genérico cheio de opções, mas uma ferramenta simples e controlada, com presets visuais previamente definidos.

---

# PRESETS VISUAIS

Os presets oficiais do projeto estão em:

`public/presets/`

Os arquivos existentes nessa pasta são a fonte da verdade para a aparência visual dos QR Codes.

Preservar exatamente as configurações visuais existentes nos arquivos JSON.

Não recriar, reinterpretar ou substituir os presets por configurações próprias.

Não alterar os arquivos JSON dos presets sem solicitação explícita.

Os presets atualmente disponíveis são:

- `qr-code-config-instagram.json`
- `qr-code-config-instagram-pb.json`
- `qr-code-config-padrão.json`
- `qr-code-config-pix.json`
- `qr-code-config-spotify.json`
- `qr-code-config-whatsapp.json`
- `qr-code-config-wifi.json`
- `qr-code-config-youtube.json`

---

# TIPOS DE QR CODE

A aplicação deve oferecer somente os seguintes tipos:

1. QR Code Padrão
2. QR Code PIX
3. QR Code Wi-Fi
4. QR Code Instagram
5. QR Code Instagram Preto e Branco
6. QR Code WhatsApp
7. QR Code Spotify
8. QR Code YouTube
9. QR Code Preto e Branco

Não adicionar outros tipos sem solicitação explícita.

---

# 1. QR CODE PADRÃO

Preset:

`public/presets/qr-code-config-padrão.json`

Solicitar somente:

- Link

O usuário informa o link ou conteúdo que deseja transformar em QR Code.

Não solicitar outras informações.

---

# 2. QR CODE PIX

Preset:

`public/presets/qr-code-config-pix.json`

O usuário NÃO deve digitar manualmente o payload PIX.

A interface deve solicitar somente:

### Tipo de chave

Opções:

- CPF
- CNPJ
- E-mail
- Telefone
- Chave aleatória

### Chave PIX

Campo para a chave correspondente ao tipo selecionado.

Não solicitar:

- Valor
- Nome do recebedor
- Cidade
- Mensagem
- TXID personalizado

O payload deve ser gerado automaticamente em JavaScript.

---

## Regras para PIX

Implementar a geração do payload BR Code/Pix diretamente no navegador.

A implementação deve:

1. Identificar o tipo da chave.
2. Normalizar a chave quando necessário.
3. Montar corretamente os campos TLV.
4. Montar corretamente o Merchant Account Information do PIX.
5. Utilizar o formato apropriado para uma cobrança PIX estática sem valor.
6. Não incluir valor de pagamento.
7. Não incluir mensagem adicional.
8. Calcular corretamente o CRC16-CCITT.
9. Retornar o payload final para o mecanismo existente de geração do QR Code.

O usuário deve enxergar somente os campos necessários para gerar o PIX.

O payload técnico não deve ser apresentado como campo de edição.

Criar funções reutilizáveis e isoladas para essa lógica, preferencialmente com responsabilidades semelhantes a:

- `generatePixPayload()`
- `normalizePixKey()`
- `calculatePixCRC16()`

Não duplicar a lógica de CRC ou TLV em diferentes componentes.

Validar os dados antes de gerar o QR Code e apresentar uma mensagem clara caso a chave seja inválida.

---

# 3. QR CODE WI-FI

Preset:

`public/presets/qr-code-config-wifi.json`

Solicitar somente:

- SSID
- Senha

O usuário não deve precisar conhecer a sintaxe do QR Code Wi-Fi.

Para redes WPA/WPA2, gerar o payload no formato:

`WIFI:T:WPA;S:<SSID>;P:<PASSWORD>;;`

Tratar corretamente caracteres especiais que precisem ser escapados no formato de QR Code Wi-Fi.

Criar uma função reutilizável semelhante a:

`generateWifiPayload()`

Não solicitar o payload manualmente.

---

# 4. QR CODE INSTAGRAM

Preset:

`public/presets/qr-code-config-instagram.json`

O usuário NÃO deve informar o link completo.

Solicitar somente:

- Usuário do Instagram

Aceitar:

`@usuario`

ou:

`usuario`

Remover automaticamente o caractere `@` caso esteja presente.

Gerar automaticamente:

`https://www.instagram.com/usuario/`

O QR Code deve receber essa URL como conteúdo.

Criar uma função reutilizável semelhante a:

`generateInstagramUrl()`

---

# 5. QR CODE INSTAGRAM PRETO E BRANCO

Preset:

`public/presets/qr-code-config-instagram-pb.json`

A lógica de conteúdo deve ser exatamente a mesma do QR Code Instagram.

Solicitar somente:

- Usuário do Instagram

Aceitar:

`@usuario`

ou:

`usuario`

Remover automaticamente o `@`.

Gerar:

`https://www.instagram.com/usuario/`

A única diferença entre este tipo e o Instagram normal deve ser o preset visual utilizado.

Não duplicar a lógica de geração da URL.

---

# 6. QR CODE WHATSAPP

Preset:

`public/presets/qr-code-config-whatsapp.json`

Solicitar:

- Número
- Mensagem

O usuário não deve precisar montar manualmente o link do WhatsApp.

Gerar automaticamente uma URL equivalente a:

`https://wa.me/NUMERO?text=MENSAGEM`

Normalizar o número adequadamente antes de gerar a URL.

A mensagem deve ser corretamente codificada para URL, preservando:

- espaços;
- acentos;
- caracteres especiais.

Criar uma função reutilizável semelhante a:

`generateWhatsappUrl()`

---

# 7. QR CODE SPOTIFY

Preset:

`public/presets/qr-code-config-spotify.json`

Solicitar somente:

- Link

O usuário fornece diretamente o link do Spotify.

Não solicitar outras informações.

---

# 8. QR CODE YOUTUBE

Preset:

`public/presets/qr-code-config-youtube.json`

Solicitar somente:

- Link

O usuário fornece diretamente o link do YouTube.

Não solicitar outras informações.

---

# 9. QR CODE PRETO E BRANCO

Utilizar o preset existente que corresponde ao QR Code Preto e Branco.

O arquivo de configuração deve ser analisado antes da implementação para confirmar qual preset existente corresponde a esta finalidade.

Este QR Code deve solicitar somente:

- Link

A finalidade é gerar um QR Code visualmente preto e branco.

Não confundir este preset com:

`qr-code-config-instagram-pb.json`

O preset Instagram P&B é específico para Instagram.

O preset Preto e Branco genérico é destinado a qualquer link/conteúdo.

---

# INTERFACE

A interface final deve ser extremamente simples, limpa e objetiva.

O diálogo/tela principal de geração deve conter somente:

1. Logo da empresa no topo.
2. Seleção do tipo de QR Code.
3. Campos necessários para aquele tipo.
4. Botão para gerar o QR Code.
5. Área de visualização do QR Code gerado.
6. Controles de exportação já existentes no MiniQR, quando aplicáveis.

Não adicionar:

- banners;
- cards desnecessários;
- textos explicativos extensos;
- elementos decorativos;
- configurações avançadas;
- controles de personalização visual;
- opções que não sejam necessárias para gerar o QR Code.

A ferramenta deve ser rápida e simples de utilizar.

---

# LOGO

Reservar uma área no topo da interface para o logotipo da empresa.

O logotipo será fornecido posteriormente em formato SVG.

Durante o desenvolvimento, o código deve estar preparado para utilizar:

`/logo.svg`

O arquivo poderá ser colocado posteriormente em `public/logo.svg`.

Após o build do Vite, ele deverá estar disponível como:

`/logo.svg`

Não criar um logo substituto.

Não desenhar um logo em CSS.

Não criar um logo fictício.

O logo deve ser exibido:

- acima dos campos do gerador;
- centralizado;
- em tamanho adequado;
- sem interferir na utilização dos campos.

O logo é somente a identificação visual da interface.

O logo NÃO deve ser inserido automaticamente dentro dos QR Codes.

---

# CAMPOS DA INTERFACE

## Padrão

Tipo:

`QR Code Padrão`

Campo:

`Link`

---

## PIX

Tipo:

`QR Code PIX`

Campo:

`Tipo de chave`

Campo:

`Chave PIX`

---

## Wi-Fi

Tipo:

`QR Code Wi-Fi`

Campo:

`SSID`

Campo:

`Senha`

---

## Instagram

Tipo:

`QR Code Instagram`

Campo:

`@usuário`

---

## Instagram Preto e Branco

Tipo:

`QR Code Instagram Preto e Branco`

Campo:

`@usuário`

---

## WhatsApp

Tipo:

`QR Code WhatsApp`

Campo:

`Número`

Campo:

`Mensagem`

---

## Spotify

Tipo:

`QR Code Spotify`

Campo:

`Link`

---

## YouTube

Tipo:

`QR Code YouTube`

Campo:

`Link`

---

## Preto e Branco

Tipo:

`QR Code Preto e Branco`

Campo:

`Link`

---

# BOTÃO PRINCIPAL

Utilizar um botão principal simples:

`Gerar QR Code`

Não criar diferentes botões para cada tipo.

O formulário deve mudar dinamicamente de acordo com o tipo selecionado.

---

# SEPARAÇÃO ENTRE CONTEÚDO E VISUAL

A lógica de geração do conteúdo deve ser independente do preset visual.

Fluxo conceitual:

`Entrada do usuário`

↓

`Normalização / geração do conteúdo`

↓

`Payload ou URL final`

↓

`Preset visual`

↓

`Gerador QR existente do MiniQR`

↓

`QR Code`

---

## Exemplo — Instagram

`@usuario`

↓

`https://www.instagram.com/usuario/`

↓

`qr-code-config-instagram.json`

↓

`QR Code`

---

## Exemplo — Instagram P&B

`@usuario`

↓

`https://www.instagram.com/usuario/`

↓

`qr-code-config-instagram-pb.json`

↓

`QR Code`

---

## Exemplo — PIX

`Tipo de chave + chave`

↓

`Payload BR Code PIX`

↓

`qr-code-config-pix.json`

↓

`QR Code`

---

## Exemplo — Wi-Fi

`SSID + senha`

↓

`Payload WIFI`

↓

`qr-code-config-wifi.json`

↓

`QR Code`

---

## Exemplo — WhatsApp

`Número + mensagem`

↓

`https://wa.me/...`

↓

`qr-code-config-whatsapp.json`

↓

`QR Code`

---

# PRESERVAR O MINIQR

Antes de modificar o código:

1. Analisar a estrutura atual do MiniQR.
2. Identificar como os presets são carregados.
3. Identificar como o QR Code é renderizado.
4. Identificar como PNG e SVG são exportados.
5. Identificar quais componentes já podem ser reutilizados.
6. Identificar quais funcionalidades podem ser removidas da interface sem quebrar o funcionamento interno.

Reutilizar componentes e funções existentes sempre que possível.

Não reescrever o mecanismo de geração do QR Code sem necessidade.

Não substituir a biblioteca de QR Code existente sem justificativa técnica.

---

# SIMPLIFICAÇÃO DA INTERFACE EXISTENTE

A aplicação deve ser simplificada para o objetivo deste projeto.

Remover ou ocultar da interface todas as opções de personalização visual que não sejam necessárias.

O usuário final não deve conseguir alterar:

- cor dos módulos;
- formato dos módulos;
- formato dos olhos;
- pontos centrais;
- margem;
- fundo;
- correção de erro;
- logo interno;
- gradientes;
- imagens;
- bordas;
- configurações avançadas;
- outras propriedades visuais do QR Code.

Essas propriedades devem ser determinadas exclusivamente pelos presets JSON.

Não remover do código interno funcionalidades que sejam necessárias para carregar ou renderizar os presets.

---

# EXPORTAÇÃO

Manter a exportação dos QR Codes nos formatos suportados pelo projeto, especialmente:

- PNG
- SVG

O SVG deve permanecer realmente vetorial e adequado para utilização em produção gráfica.

Não rasterizar o SVG.

---

# GITHUB PAGES

A aplicação deve continuar funcionando como site estático.

Não depender de:

- backend;
- banco de dados;
- API externa;
- servidor para geração do QR Code.

Todas as informações necessárias para gerar os QR Codes devem ser processadas localmente no navegador.

O build deve continuar gerando a aplicação em:

`dist/`

Não editar arquivos dentro de `dist/` manualmente durante o desenvolvimento.

`dist/` é considerado diretório de build/output.

Arquivos permanentes que fazem parte da aplicação devem ficar em `src/` ou `public/`.

---

# ESTRUTURA DOS PRESETS

Os presets ficam em:

`public/presets/`

Eles devem permanecer separados em arquivos individuais.

Não consolidar todos os presets em um único arquivo sem solicitação explícita.

Não mover os presets para `dist/` manualmente.

O processo de build deve cuidar da cópia dos arquivos necessários para o output.

---

# REGRAS DE DESENVOLVIMENTO

Antes de implementar alterações:

- analisar os arquivos existentes;
- analisar todos os presets JSON;
- entender a arquitetura atual;
- reutilizar código existente;
- preservar os presets;
- evitar dependências desnecessárias;
- evitar duplicação de lógica.

Não fazer grandes refatorações sem necessidade.

Não alterar configurações visuais dos presets.

Não adicionar funcionalidades não solicitadas.

Não criar o preset PIX Central.

Não criar um mecanismo paralelo de geração de QR Code se o MiniQR já fornecer a funcionalidade necessária.

---

# VALIDAÇÃO

Depois de implementar alterações:

1. Executar o lint disponível no projeto.
2. Executar os testes existentes, se houver.
3. Executar o build.
4. Verificar se o build termina sem erros.
5. Verificar se todos os presets continuam sendo carregados.
6. Verificar se PNG continua funcionando.
7. Verificar se SVG continua funcionando.
8. Verificar se o logo é carregado corretamente quando `public/logo.svg` existir.

---

# TESTES ESPECÍFICOS

## PIX

Testar:

- CPF;
- CNPJ;
- E-mail;
- Telefone;
- Chave aleatória.

Verificar que o payload produzido possui CRC válido e pode ser lido por aplicativos de pagamento PIX.

---

## Wi-Fi

Testar:

- SSID simples;
- SSID contendo espaços;
- senha contendo caracteres especiais;
- senha contendo espaços.

---

## Instagram

Testar:

`@usuario`

e:

`usuario`

Ambos devem gerar a mesma URL final.

---

## WhatsApp

Testar:

- número com diferentes formatos de entrada;
- mensagem simples;
- mensagem com espaços;
- mensagem com acentos;
- mensagem com caracteres especiais.

---

# TRATAMENTO DE ERROS

As mensagens de erro devem ser simples e objetivas.

Exemplos:

`Informe uma chave PIX válida.`

`Informe o SSID.`

`Informe a senha.`

`Informe um usuário do Instagram.`

`Informe um número de WhatsApp.`

`Informe um link.`

Não mostrar mensagens técnicas ou stack traces para o usuário final.

---

# PRINCÍPIO PRINCIPAL

Este projeto não deve se tornar um gerador genérico de QR Codes cheio de configurações.

É uma ferramenta controlada para geração de QR Codes com presets visuais pré-definidos.

A interface deve ser simples.

O usuário escolhe a finalidade, fornece somente os dados necessários e gera o QR Code.

As características visuais dos QR Codes são determinadas exclusivamente pelos presets oficiais existentes em:

`public/presets/`

A prioridade é:

1. simplicidade;
2. estabilidade;
3. preservação dos presets;
4. geração correta dos dados;
5. qualidade do QR Code;
6. exportação adequada para produção gráfica.