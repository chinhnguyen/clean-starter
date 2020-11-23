Feature: Fido2Authenticate user using hardware security key
  This is to support passwordless authentication

  Scenario: register challenge request with empty email
    When requestRegister with email "" 
    Then return Bad Request Problem

  Scenario: register challenge request with any email
    When requestRegister with email "any@email" 
    Then return attestationoption having challenge not null and attestation is direct

 Scenario: register attestation validation request with invalid attestation
    Given WebAuthNUser JSON '{"id":"any-id","email":"any@email","challenge":"a challenge"}'
    When register with attestation '{"rawI": "invalid attestation"}'
    Then return Unauthorized Problem

 Scenario: register attestation validation request with valid attestation
    Given WebAuthNUser JSON '{"id":"any-id","email":"any@email","challenge":"a challenge"}'
    When register with attestation '{"rawId":"L8GNuxJcM8D0QLtS0AQ4EI0bYltqoo18JlzEDv2c/o+M4GoAYWg9o0xjEv8hKptpmPOILlQO8hQypIOUilsxNA==","response":{"attestationObject":"o2NmbXRmcGFja2VkZ2F0dFN0bXSjY2FsZyZjc2lnWEgwRgIhAOQgWzmGZJ4HJyQfphIWjxc5/hp5KHubrDRAYrrD7N4PAiEAsz1U/BZC2EtJzvbYJz/3Wkupz4vHtcnrlUn2mG/VB4FjeDVjgVkCwTCCAr0wggGloAMCAQICBAsFzVMwDQYJKoZIhvcNAQELBQAwLjEsMCoGA1UEAxMjWXViaWNvIFUyRiBSb290IENBIFNlcmlhbCA0NTcyMDA2MzEwIBcNMTQwODAxMDAwMDAwWhgPMjA1MDA5MDQwMDAwMDBaMG4xCzAJBgNVBAYTAlNFMRIwEAYDVQQKDAlZdWJpY28gQUIxIjAgBgNVBAsMGUF1dGhlbnRpY2F0b3IgQXR0ZXN0YXRpb24xJzAlBgNVBAMMHll1YmljbyBVMkYgRUUgU2VyaWFsIDE4NDkyOTYxOTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABCEab7G1iSXLCsEYX3wq46i0iBAUebEe//VV4H2XUb0rF2olLe5Z7OOFmSBbs+oov4/X/H2nXAVCcq5IWOWR/FqjbDBqMCIGCSsGAQQBgsQKAgQVMS4zLjYuMS40LjEuNDE0ODIuMS4xMBMGCysGAQQBguUcAgEBBAQDAgQwMCEGCysGAQQBguUcAQEEBBIEEBSaICGO9kEzlriB+NW38fUwDAYDVR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAQEAPv6j3z0q4HJXj34E0N1aS2jbAa/oYy4YtOC4c0MYkRlsGEvrwdUzoj13i7EECMG5qkFOdXaFWwk2lxizSK9c72ywMIZy1h+4vZuGoQqmgs6MLU7wkO1QVBj+U9TOHmJ6KPNyAwlY0I/6WRvEGIDhjooM7RqFgH+QlnFBegtFMhWzjcFHKiRJdkC06Gv+xPFUY5uFuOiAFJY2JDg1WQEr/Id8C0TsfaeU0gZUsprcHbpcUHvwym3zUrzN3nQNLqfhCCSizjlPkE0dmUFeOnxFtf4oepvL3GmOi9zVtHmKXO013oo1CQIKFLcmv785p0QHnLmPW53KCbfD67y9oq9pA2hhdXRoRGF0YVjESZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2NFAAAAAxSaICGO9kEzlriB+NW38fUAQC/BjbsSXDPA9EC7UtAEOBCNG2JbaqKNfCZcxA79nP6PjOBqAGFoPaNMYxL/ISqbaZjziC5UDvIUMqSDlIpbMTSlAQIDJiABIVggkRqBNswIwIuBDwLzp5EKyVAyessnYWXS4Hz6GSakw+8iWCAc1KoTCccBqzI3VqWzOWFkZWAmmWRa/2wefnIz3hlgSQ==","getAuthenticatorData":{},"getPublicKey":{},"getPublicKeyAlgorithm":{},"getTransports":{},"clientDataJSON":"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiMUgyUlM1N05zSWVnMGtqYkRrRUlvamQ5ZkwydFNSRk95Z3gzcmJZSEtaOCIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MSIsImNyb3NzT3JpZ2luIjpmYWxzZX0="},"getClientExtensionResults":{},"id":"L8GNuxJcM8D0QLtS0AQ4EI0bYltqoo18JlzEDv2c_o-M4GoAYWg9o0xjEv8hKptpmPOILlQO8hQypIOUilsxNA","type":"public-key"}'
    Then return true

Scenario: login request with empty email
    Given WebAuthNUser JSON '{"id":"any-id","email":"any@email","challenge":"a challenge"}'
    When login with email "" 
    Then return Bad Request Problem

Scenario: login request with any user with valid key
   Given WebAuthNUser JSON '{"email":"any@email","challenge":"prior challenge","key":{"fmt":"packed","publicKey":"BKkFhmqKhNi0UHYSahvfO1KekEPhZWjC4pN1hYknr6g9pE5SJ5CYjquGmeNtbhAunw4lSTghCZs6Ul0/aiaWAaE=","counter":1,"credID":"Y668QqUn6nriHCUAXv990v8VhZbAOsMzYWx1PphMnlx1do6Fj0RIUoi9bPz7P7PYnBdC4ZhJvHpGpwXzEqRXMA=="}}'
   When login with email "any@email" 
   Then return assertionOptions having different challenge than "prior challenge"
 
Scenario: login assertion validation request with invalid attestation
   Given WebAuthNUser JSON '{"email":"any@email","challenge":"prior challenge"}'
   When loginChallenge with assertion '{"rawI": "invalid attestation"}' 
   Then return Unauthorized Problem

Scenario: login assertion validation request with valid attestation
   Given WebAuthNUser JSON '{"email":"any@email","challenge":"prior challenge","key":{"fmt":"packed","publicKey":"BKkFhmqKhNi0UHYSahvfO1KekEPhZWjC4pN1hYknr6g9pE5SJ5CYjquGmeNtbhAunw4lSTghCZs6Ul0/aiaWAaE=","counter":1,"credID":"Y668QqUn6nriHCUAXv990v8VhZbAOsMzYWx1PphMnlx1do6Fj0RIUoi9bPz7P7PYnBdC4ZhJvHpGpwXzEqRXMA=="}}'
   When loginChallenge with assertion '{"rawId":"Y668QqUn6nriHCUAXv990v8VhZbAOsMzYWx1PphMnlx1do6Fj0RIUoi9bPz7P7PYnBdC4ZhJvHpGpwXzEqRXMA==","response":{"authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MFAAAABg==","signature":"MEUCIEODSt6P2MpgBnCQW+Fr/utVt6gmR9EY1l3aqlraTuB0AiEAuEk+yJsmuTiiFX7airIjKA5glpSCKHmGFDE6SGz1h9A=","userHandle":null,"clientDataJSON":"eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiUU5oVXZKWXJsNk9QU1ZVbzcxSXlIeHlQQlpmNkdUb05hWUhMdXJfUkJESSIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MSIsImNyb3NzT3JpZ2luIjpmYWxzZX0="},"getClientExtensionResults":{},"id":"Y668QqUn6nriHCUAXv990v8VhZbAOsMzYWx1PphMnlx1do6Fj0RIUoi9bPz7P7PYnBdC4ZhJvHpGpwXzEqRXMA","type":"public-key"}' 
   Then return true
