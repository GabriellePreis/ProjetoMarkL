/// <reference types="cypress" />



describe ('tarefas', ()=>{  //Agrupador de cenários

    let testData;

    before(()=> {
        cy.fixture('tasks').then(t =>{
            testData = t
        })

    })

    
    context('cadastro', () => {

    //Cenário 1
    it('Deve cadastrar uma nova tarefa', ()=>{

        const taskName = 'Fazer um desenho para pintar com giz' //Define o nome da Tarefa que será testada

        cy.removeTaskByName(taskName)                          //Remove a tarefa (se já existir) para evitar duplicidade

        cy.createTask(taskName)                               //Cria a tarefa

        cy.contains('main div p', taskName)                  //Verifica se a tarefa aparece na tela
           .should('be.visible')
    })
       
    //Cenário 2
    it('Não deve permitir tarefa duplicada', ()=> {

        const task = testData.dup                           // Utilizamos uma fixture para evitar repetição da tarefa
            
        
        cy.removeTaskByName(task.name)                     // Remove qualquer tarefa anterior com o mesmo nome, para garantir ambiente limpo
       
        //Dado que eu tenho uma tarefa duplicada

         cy.postTask(task)                                //Envia a tarefa diretamente via requisição HTTP para criar no backend

        //Quando faço o cadastro da tarefa com o mesmo nome

        cy.createTask(task.name)                         

        //Então vejo a mensagem de duplicidade

        cy.get('.swal2-html-container')
            .should('be.visible')
            .should('have.text', 'Task already exists!')



    })

    //Cenário 3
    it('Campo obrigatório', ()=> {
        cy.createTask()

        cy.isRequired('This is a required field')

    })
    })
       
    context('atualização', ()=> {
        it ('deve concluir uma tarefa', ()=>{
            const task = {
                name:'Fazer um desenho para pintar com giz',
                is_done:false}

            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            cy.contains ('p', task.name)
                  .parent()
                  .find('button[class*=ItemToggle]')
                  .click()

            cy.contains('p', task.name)
                .should('have.css', 'text-decoration-line', 'line-through')

        })
    })

    context('exclusão', ()=> {
        it('deve remover uma tarefa', ()=>{
            const task = {
                name:'Ler um capítulo do livro',
                is_done:false
            }

            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            cy.contains ('p', task.name)
                  .parent()
                  .find('button[class*=ItemDelete]')
                  .click()

            cy.contains('p', task.name)
                .should('not.exist')

        })
    })
})




