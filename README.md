# ms-auth-node

# Microsserviço para criação e autentiaçao de usuário
1. Cria um par de chaves RSA - Publico/Privado
2. Envia a chave pública para o usuário
3. Recebe uma cifra encriptada do usuário
4. Decrypta e extrai o payload
5. Confere se assinatura da chave é a mesma do servidor
6. consulta se o usuário existe na base de dados  e autoriza a troca de informação
7. Monta o claims do JWT
8. Cria uma sessão JWT com tempo de expiração de 10min

## Subindo o ms em ambiente dev
Antes de subir é necessário que confira se está com o repositório utils na mesma pasta que o ms auth. 
Existem arquivos compartilhados entre os dois repositírios.

- Para facilitar fiz um script para iniciar a apilcação:

        npm run create;
        npm run dev;

- Se preferir rodar um passo a passo siga as instruções:

        npm i;                          Instale as dependências: 
        npx sequelize-cli db:create     Crie o banco de dados:          
        npx sequelize-cli db:migrate    Execute as migrations:          
        npm run dev                     Inicie o projeto no anbiente de desenvolvimento:               

### Gerando migrations
**Criando novas migrations**
    
    npx sequelize-cli migration:generate --name create-users
    npx sequelize-cli db:migrate
    
**Criando Alterações na Tabela users. Adicionando uma coluna nova: doc**
    
    npx sequelize-cli migration:generate --name alter-user-doc
    npx sequelize-cli db:migrate

## Class User 
   
    const UserSchema = {
        uid:        { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        uuid:       { type: Sequelize.STRING, allowNull: false },           // internal uuid
        ex_uuid:    { type: Sequelize.STRING, allowNull: false },           // external uuid
        name:       { type: Sequelize.STRING, allowNull: false },
        password:   { type: Sequelize.STRING, allowNull: true  },
        email:      { type: Sequelize.STRING, allowNull: false },
        cellphone:  { type: Sequelize.STRING, allowNull: true  },
        doc:        { type: Sequelize.STRING, allowNull: true  },
    };

## Payloads
### Resposta ao pedido de chave pública
    
    - GET | /authenticate
            -----BEGIN PUBLIC KEY-----
        MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA1R0whdo04kldEGmfZ/Fw
        DCDTTFUCSWh3PKltQptyn6i9oAG4ao0O2EQJUNEBq/jbwvP2yIHhmFMXz9F9c6pG
        iGyF6+dfQQMN2+JknMxUHVx1IRM0fnKCw1Dcag0kffPt70Blkz63PqeE7lDsjrfI
        46U2gYz14wCx19iTyOZHxUHhjaNLzkqCbdRag9bJbhA8F8OhZPVxRPtBh2P/hXq9
        9HXVjvLmV5+s8Nht8THKp9ShKLNY52HRjpbN2XZ6DcRvjHW2ltqu2FKGlCagy9Ht
        AWZLA4Bjzn0jkebNv+GDPd2Epu/HiilaQN1ZOKCM+zuaNdaAlK/MrLNaxE25Vb40
        sMv4SuYqk6Dt0FY/4M0WAOiAtL3OZ0NCrywikGq2qFFW7aHfXpFi0mUio6KeQ26f
        sd9DsJ135/bsVZaEZv02EB0TbRvRRwrTb8PfxS77sOpiN/bde6YKvKJjQxc47CVb
        p7YCrHF+9Cnb3NgybJsr4ZqJfnlddKSrnnQAivbkYWedE4jtaNhQX63ncQeV4iFS
        sO/V8/OsMFjKbqtipdQnIr9tBxunHJhq/ovh12n0awIWeRXC2WY76u4amckRtJzi
        UsU/OTLWqddyGO34mvX7o+OfRXfB6sClocN/7rjaJ3V/kCu5QzyeDn9hmd+FgOZL
        /Rz+pEeehFbf59ZNi2t159kCAwEAAQ==
        -----END PUBLIC KEY-----

### Envio de pedito de autorização
    
    - POST | /authenticate
        {"cipher":"\"{\\\"v\\\":\\\"hybrid-crypto-js_0.2.4\\\",\\\"iv\\\":\\\"KCxmm9wX+sJgkhD3OApDR4RY0mUDbEZW432I9PMmVOc=\\\",\\\"keys\\\":{\\\"55:e9:0e:eb:29:41:8c:c1:82:ed:cf:02:b9:09:85:2e:b3:97:b7:4f\\\":\\\"jPa5Qgggd83D8oskLYU48wD2pjNMZTGzJsrmhSBKUFRD8KBxiMhoCNqjGpR2g+QWjcdbekCbOIMgBY0ac7covIAQcG5h9SB/b3lp+9qWBXkthuTN17Mj195z4Lk1YvhSG3sDQ3zBD2M62n7jLQAKKqd7fbXtJkl5gQWd+wvnjxquRWf8oYwLGjqOa80PAWxkFq/O7fVLfhaY570L+O9mWEwcJtQWeGAKJ/jFKY+Q9MeY1NPewb9FSTferpjhNYLSUN29Ll076hcKNh1OwUv0CLlenplfcjMVQnAVlIE61UVIcwLLL/jBTm6vZwXLOu3stRGDSI5eKpr/iyzFr573PRu2rWvObx1kEU57LsINOkFhVRkYHS01h/zflNSm5UAhaVKQ/hvju+xqDIF4+BQ8mLotL6JhSANQNg/k3Vi9JxoPYUP3xSs7n83IbcCCbc4F1sM3JAcWGl0ToVAiCRNT9CRrkPRPxnOysKqywpZJ848MsizgZu9eAs0rs15Re2kflOGPoiizoMHZdcs8kBZt6Eou0sKQ1vu9qQKlzESeUBKmnfCgYsTbVQaTI3XFx0sazzN28bPhV42uxDh0x+hECUgdLUrUUbtbBTIjlxoSOGTstG5zgH8+5pvO9uBzRgLE2d2VgDL06UVjJdypx8jJ8ti8ehKamSq0TeLg7M3KFko=\\\"},\\\"cipher\\\":\\\"zSkNcCRnJeaQnVsRTLyyZPfPisk3pw1OG7gSu8gNNyxRUPMKxr0YzY8lBPRKkK0y9td/xAo2GmsPHVzTdX3VTQ==\\\",\\\"signature\\\":\\\"\\\"}\""}

- Resposta ao pedido de autorização
    
    {
        "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIiLCJzdWIiOiIiLCJhdWQiOiIiLCJqaWQiOiIiLCJzaWQiOiIiLCJyb2xlcyI6IiIsInV1aWQiOiI1OTc1ZGQ4MS05YTY4LTQ2MDEtODNlNi01MWY0M2I3NmVkYTUiLCJpYXQiOjE2Mzk0ODE5NDUsImV4cCI6MTYzOTQ4MjU0NX0.TwyDIZqhbqwSF0-lsb69V0VOMipR60svdSmHjWXV7ucq5iyVVlK5K0OIA4ataeOVh6Bv9mrXsD9soEJaS0F3-YOw7OQuzwObyyZUS_SdN3g3ejHik1u30UxqGqZ9U5hC2WS6TLmYak08LDhb_Gexy7-1J7OMvO_uk6UsrVoYZ2uZ-Ohl1T29jpvtr7f2hdGT0amnCHd_MRvuIaKj5X-D8e1PFK6kP6wSgyiRMepufoYiDNzmn1gy2vIlARhAa8d6ViBiUH2zxKxftsgdU-1493Lcr0KRmNMd3LhcU5xrU7gai9G1B_9l0xWXhqk6YQgue5UaDc7OKr_EwSVD8yZ9xbD6tMjFHtoIaWyygHBFiohfaadpYFdibh0WIc-0F4DA5_Gu0U6kmtL2HrEXMEBbnI_3hRvrVOrF0zlpaJ5MBXF63_0fxdKYEYsCxSOhstTS05u3P4mcWj2dOgXXvzVLJPm-a73p2cw5fXPbX0UeOaevMe5iPxchMq9EqktVDslNQ8P828uCnj2eMkzcTm1H24lnOldk0BGYXOZeZCj4E8mLw9kYCv3m7ziODIB6PQS2C2Xn_VfN9ygTfsBG22Mof2pM-aszeMCU_5ClcJCg0j_rz1vciHPHxThOYKs8DTQ_YBQGfPYI8wifd7Ro-RqFpu0x4ok_hWJp1qTNge8aJnY"
    }

## Classe para consumo do front-end
Exixte uma arquivo  em **src/authentication/AuthenticationClient** destinado a fazer a parte do front-end.

### Sigin no servidor
Aqui ele faz o sigin (cria novo usuário) e recebe um token no result e também no **Header: X-AUTH-TOKEN**

    const auth = new AuthenticationClient();
    const  result = await auth.sign("http://localhost:50001/sign", { email: "email@email.com", password: "Alterar123" });

### Login no servidor
Aqui ele faz o login e recebe um token no result e também no **Header: X-AUTH-TOKEN**

    const auth = new AuthenticationClient();
    const  result = await auth.login("http://localhost:50001/login", { email: "email@email.com", password: "Alterar123" });

### Login no servidor
Para terminar a sessão
    const auth = new AuthenticationClient();
    auth.logout();

## Fluxo Padrão
- Teste do servidor: **GET - /healthz**
- Pedir uma chave pública: **GET - /authenticate**.
- Com a chave pública, deve-se encryptar o payload em uma cifra stringficada.
- Enviar a cifra para o servidor: **POST - /authenticate**.
- A resposta do servidor é um token jwt que vem no **HEADER** com o nome **X-AUTH-TOKEN**