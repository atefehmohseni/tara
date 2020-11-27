Security Considerations:

- General checks:
* using msg.sender.call.value(amount) instead of using 'transfer' or 'send' fucntions. More details [here](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/)

- Manual checks including:
*  prevent multiple tries in signin -> prevent DoS attack
*  keep track of photo's owners to prevent misuse of user's photos
*  check if users enter a correct email address -> client side
