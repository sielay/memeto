# Memeto API API documentation

---

## /server-error

### /server-error

* **get**: 

## /not-found

### /not-found

* **get**: 

## /

### /

* **get**: 

## /*

### /*

* **get**: 

## /api/graph/entity

### /api/graph/entity

* **post**: Insert
* **get**: Query

## /api/graph/entity/{rid}

### /api/graph/entity/{rid}

* **get**: Gets one Entity
* **put**: Updates Entity
* **post**: Add link
* **delete**: Deletes Entity

## /api/graph/type

### /api/graph/type

* **post**: Insert
* **get**: Query

## /api/graph/type/{typeId}

### /api/graph/type/{typeId}

* **get**: Gets one Type
* **put**: Updates Type
* **delete**: Deletes Entity

## /api/integration

### /api/integration

* **get**: List all registered integrations
* **post**: Insert new integration

## /api/integration/providers

### /api/integration/providers

* **get**: Get providers

## /api/integration/{integrationId}

### /api/integration/{integrationId}

* **get**: Get specific integration
* **put**: Update specific integraiton
* **delete**: Delete integration

## /api/auth/signup

### /api/auth/signup

* **post**: Registers new user

## /api/auth/signout

### /api/auth/signout

* **get**: Logs out user

## /api/auth/signin

### /api/auth/signin

* **post**: Logs in user

## /api/auth/{oauthProvider}

### /api/auth/{oauthProvider}

* **get**: Redirects to OAuth provider login

## /api/auth/{oauthProvider}/callback

### /api/auth/{oauthProvider}/callback

* **get**: Recieves OAuth provider login response

## /api/auth

### /api/auth

* **get**: List available auth providers

## /api/auth/forgot

### /api/auth/forgot

* **post**: 

## /api/auth/reset/{token}

### /api/auth/reset/{token}

* **get**: 
* **post**: 

## /api/users/me

### /api/users/me

* **get**: Get currently logged in user profile

## /api/users/{userId}

### /api/users/{userId}

* **get**: Gets one user objct

## /api/users

### /api/users

* **put**: 
* **get**: Gets list of users

## /api/users/accounts

### /api/users/accounts

* **delete**: Removes oauth accounts

## /api/users/password

### /api/users/password

* **post**: Changes password

## /api/users/picture

### /api/users/picture

* **post**: 

