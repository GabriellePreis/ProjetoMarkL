
//Função customizada 'createTask' com o argumento taskName para atribuir um valor, essa função irá implementar 3 steps de uma vez (encapsulamento)
Cypress.Commands.add('createTask', (taskName= '')=> {
     
     cy.visit('/')

     cy.get('input[placeholder= "Add a new Task"]').as('inputTask')
     if (taskName){
         cy.get('@inputTask')
            .type(taskName)
     }
    
     cy.contains('button', 'Create').click()

})
Cypress.Commands.add('isRequired', (targetMessage)=> {

     cy.get('@inputTask')
          .invoke('prop', 'validationMessage')
          .should((text)=>{
            expect(
                targetMessage
            ).to.eq(text)
          })
})
//Nessa função utilizamos a requisição http DELETE passando pela rota helper em ambiente de teste para excluir a tarefa antes de rodar o teste
//Devido a regra de negócio, não podemos ter tarefas com nomes iguais
//Poderíamos utilizar dados dinâmicos, mas também iria poluir o ambiente

Cypress.Commands.add('removeTaskByName', (taskName)=>{
    cy.request({
            url: Cypress.env('apiUrl') + '/helper/tasks',
            method: 'DELETE',
            body: {name: taskName}
        }).then(response => {
            expect(response.status).to.eq(204)
        })
})

Cypress.Commands.add('postTask', (task)=>{
     cy.request({
            url: Cypress.env('apiUrl')+ '/tasks',
            method: 'POST', 
            body: task
         }).then(response => {
            expect(response.status).to.eq(201)
         })
} )