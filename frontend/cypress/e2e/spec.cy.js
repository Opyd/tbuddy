// describe('First test', () => {
//   it('Visits home page and clicks CTA', () => {
//     cy.visit('/')
//     cy.contains('Join NOW').click()
//     cy.url().should('include', 'auth')
//   })
// })

// describe('Creating new account', () => {
//   it('Visits register page and fills form', () => {
//     cy.visit('/')
//     cy.contains('Join NOW').click()

//     cy.contains('Create new account').click()

//     cy.get('#username').type("Cypress")

//     const email = "cypress@test.com"

//     cy.get('#email').type(email)
//     cy.get('#repeatEmail').type(email)

//     const password = "abcd1234"

//     cy.get('#password').type(password)
//     cy.get('#repeatPassword').type(password)

//     cy.get("#terms").parent().click()

//     cy.contains("Create account").click()

//   })
// })

describe('Log in to account', () => {
  it('Visits login page and fills form', () => {
    cy.visit('/')
    cy.contains('Join NOW').click()

    cy.get('#username').type("Cypress")

    const password = "abcd1234"

    cy.get('#password').type(password)

    cy.get("#loginBtn").click()

    cy.url().should('include', 'dashboard')

  })
})
