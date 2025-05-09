describe('Dashboard', () => {
  it('should display the dashboard heading', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Flight Control Dashboard');
  });

  it('should allow model selection and run analysis', () => {
    cy.visit('http://localhost:3000');
    cy.get('select').first().as('modelSelect');
    cy.get('@modelSelect').should('exist');
    cy.get('@modelSelect').select(0); // Select first model
    cy.get('textarea, [contenteditable], input').first().as('codeInput');
    cy.get('@codeInput').clear().type('def foo(): pass');
    cy.contains('Analyzing...').should('exist');
    cy.contains('predicted_class').should('exist');
    cy.contains('confidence').should('exist');
  });
});