Feature: Authenticate user using username and password
  Email must matches with email of either Merchant, Partner, Super Admin, Admin, Employee
  Password must be MD5 encrypted
  The result might have more than 1 value when the email/password is matched with multiple roles

  Scenario: empty email
    When authenticate with email "" and password "any"
    Then return Bad Request Problem

  Scenario: empty password
    When authenticate with email "any" and password ""
    Then return Bad Request Problem

  Scenario: invalid credential
    Given invalid credential
    When authenticate with email "any" and password "any"
    Then return Unauthorized Problem

  Scenario: user to auth response mapping
    Given User JSON '{"id":"any-id","email":"any@email","name":"Any Name"}'
    When authenticate with email "any" and password "any"
    Then return token having id of "any-id"
