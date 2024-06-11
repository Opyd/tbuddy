import {faker} from '@faker-js/faker'

const username = faker.internet.userName();
const password = faker.internet.password();
const email = faker.internet.email();


describe('Auth middleware', () => {
  it('Trying to set up a team without being logged in', () => {
    cy.visit('/auth')
    cy.get(`[aria-label="Navigation"]`).click()
    cy.contains("Teams").click()
    cy.get(".mdi-plus").click()
    //strona powinna przejść do formularza logowania
    cy.url().should('include', 'auth')
  })
  it('Trying to set up a tournament without being logged in', () => {
    cy.visit('/auth')
    cy.get(`[aria-label="Navigation"]`).click()
    cy.contains("Tournaments").click()
    cy.get(".mdi-plus").click()
    //strona powinna przejść do formularza logowania
    cy.url().should('include', 'auth')
  })
})

describe('Account', () => {
  it('Creates new account', () => {
    cy.visit('/')
    cy.contains('Join NOW').click()

    cy.contains("Create new account").click()
    //wprowadzanie danych
    cy.get('input[id="username"]').eq(1).type(username)
    cy.get('input[id="email"]').type(email)
    cy.get('input[id="repeatEmail"]').type(email)
    cy.get('input[id="password"]').eq(1).type(password)
    cy.get('input[id="repeatPassword"]').type(password)
    cy.get('input[id="terms"]').parent().click()

    cy.contains("Create account").click()
  })
  it('Logs in', () => {
    cy.visit('/')
    cy.contains('Join NOW').click()
    //wprowadzanie danych
    cy.get('input[id="username"]').eq(0).type(username)
    cy.get('input[id="password"]').eq(0).type(password)
    cy.get('#loginBtn').click()
    //weryfikacja czy strona przeszła do panelu użytkownika
    cy.url().should('include', 'dashboard')
  })
})

describe("Creating tournament", () => {
  it('Create tournament', () => {
    //Logowanie
    cy.visit('/')
    cy.contains('Join NOW').click()
    //wprowadzanie danych
    cy.get('input[id="username"]').eq(0).type(username)
    cy.get('input[id="password"]').eq(0).type(password)
    cy.get('#loginBtn').click()
    cy.wait(1000)
    cy.get(`[aria-label="Navigation"]`).click()
    cy.contains("Tournaments").click()
    cy.get(".mdi-plus").click()
    cy.wait(500)
    cy.get("input").eq(0).type("Test tournament")
    cy.get("input").eq(1).click()
    cy.contains("4").click()
    cy.get("textarea").type("Description")
    cy.contains("Create Tournament").click()
    cy.contains("Manage").click()
    cy.contains("Start the tournament")
  })
})
