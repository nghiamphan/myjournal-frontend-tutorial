describe('MyJournal app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3001/api/testing/reset')
		const user = {
			name: 'Superuser',
			username: 'root',
			password: 'root'
		}
		cy.request('POST', 'http://localhost:3001/api/users/', user)
		cy.visit('http://localhost:3000')
	})

	it('front page can be opened', function () {
		cy.contains('Journal')
		cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
	})

	it('login fails with wrong password', function () {
		cy.contains('login').click()
		cy.get('#username').type('root')
		cy.get('#password').type('wrong')
		cy.get('#login-button').click()

		cy.get('.error')
			.should('contain', 'Wrong credentials')
			.and('have.css', 'color', 'rgb(255, 0, 0)')
			.and('have.css', 'border-style', 'solid')

		cy.get('html').should('not.contain', 'Hello Superuser')
	})

	it('user can log in', function () {
		cy.contains('login').click()
		cy.get('#username').type('root')
		cy.get('#password').type('root')
		cy.get('#login-button').click()

		cy.contains('Hello Superuser')
	})

	describe('when logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'root', password: 'root' })
		})

		it('a new entry can be created', function () {
			cy.contains('new entry').click()
			cy.get('input').type('an entry created by cypress')
			cy.contains('save').click()
			cy.contains('an entry created by cypress')
		})

		describe('and an entry exists', function () {
			beforeEach(function () {
				cy.createEntry({
					content: 'another note cypress',
					important: false
				})
			})

			it('it can be made important', function () {
				cy.contains('another note cypress')
					.contains('make important')
					.click()

				cy.contains('another note cypress')
					.contains('make not important')
			})
		})

		describe('and several entries exist', function () {
			beforeEach(function () {
				cy.createEntry({ content: 'first entry', important: false })
				cy.createEntry({ content: 'second entry', important: false })
				cy.createEntry({ content: 'third entry', important: false })
			})

			it('one of those can be made important', function () {
				cy.contains('second entry')
					.contains('make important')
					.click()

				cy.contains('second entry')
					.contains('make not important')
			})
		})
	})
})