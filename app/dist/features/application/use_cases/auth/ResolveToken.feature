Feature: Authenticate user using token
  Scenario: empty token
    When resolve token ""
    Then return Forbidden Problem

  Scenario: invalid token
    When resolve token "anything"
    Then return Forbidden Problem

  Scenario: valid token of not existing user
    Given valid token
    But token could not be resolved to a user
    When resolve token "anything"
    Then return Forbidden Problem

  Scenario: valid token of existing merchant
    Given valid token
    And token resolved to an existing user
    When resolve token "anything"
    Then return the matching user