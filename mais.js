const KEY_BD = 'usuario'


var listaRegitros = {
    ultimoIdGerado:0,
    equipamento:[]
}

var FILTRO = ''

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegitros) )

}

function lerBD(){
    const Date = localStorage.getItem (KEY_BD)
    if(Date){
        listaRegitros = JSON.parse(Date)
    }
    desenhar()
}

function pesquizar(value){
    FILTRO = value;
    desenhar()
}

function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegitros.equipamentos
        if(FILTRO.trim()){
            
            const expReg = eval ("/$FILTRO.trim().replace (/[^\d\w] +/g,'.*')} / i") 
            data = data.filter(equipamentos => {
                return expReg.test (equipamentos.produto) || expReg.test(equipamentos.codigo)
            })
        }

        data = data
        .sort ( (a, b) => {
            return a.produto < b.produto ? -1 : 1
        })
        
        .map( equipamento => {

            return  <tr>
                     <td>${equipamento.id} </td>
                     <td>${equipamento.produto} </td>
                     <td>${equipamento.codogo} </td>
                     <td>
                        <button onclick = 'visualizar("cadastro, false, ${produto.id}) '>Editar</button>
                        <button class ='vermelho' onclick ='perguntarSeDeletar(${produto.id})'>Deletar</button>
                     </td>
            </tr> 
        } ).join('')
        tbody.innerHTML = data. join('')
    }
}

function insertEquipamento(produto, codogo){

    const id = listaRegitros.ultimoIdGerado + 1;
    listaRegitros.ultimoIdGerado = id;
    listaRegitros.equipamento.push({
        id, produto, codogo
    })

    gravarBD()
    desenhar()
    visualizar('lista')
}

function edit(id, produto, codogo){
    var equipamento = listaRegitros.equipamento.find ( equipamento => equipamento.id == id)
    equipamento.produto = produto;
    equipamento.codogo = codogo;
    gravarBD()
    desenhar()
    visualizar('lista')
    
}

function deleteEquipamento(id) {

    listaRegitros.equipamento = listaRegitros.equipamento.filter (equipamento =>{
        return equipamento.id != id
    })

    gravarBD()
    desenhar()
    
}

function perguntarSeDeleta(id){
   
         if(confirm('Que deletr o Registro de id ' + id)){
             deleteEquipamento(id)
         }
}

function limparEdicao(){
    document.getElementById('produto').value = ''
    document.getElementById('codigo').value = ''
}

function visualizar(pagina, novo = false, id = null){
    document.body.setAttribute('page' ,pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const equipamento = listaRegitros.equipamento.find( equipamento => equipamento.id == id)
            if(equipamento){
                document.getElementById('id').value = equipamento.id
                document.getElementById('produto').value = equipamento.produto
                document.getElementById('codigo').value = equipamento.codogo
            }
        }
        document.getElementById('produto').focus()
    }
}

function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value || listaRegitros.ultimoIdGerado + 1,
        produto: document.getElementById('produto').value,
        codogo: document.getElementById('codigo').value,
    }

    if(data){
        editUsurio(data.id, data.produto, data.codogo)
     }else{
         insertUsuario(data.produto, data.codogo )
    }

}

window.addEventListener('load' , () => {
   lerBD()
   document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
   document.getElementById('inputPesquiza').addEventListener('keyup', e => {

   })

})