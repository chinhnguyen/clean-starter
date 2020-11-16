Feature: Authenticate with email and password

  Scenario: authentication failed
    Given local api at 'http://localhost:8080'
    When post "/authenticate" with '{"email":"some@email","password":"somepassword"}'
    Then return status 401
