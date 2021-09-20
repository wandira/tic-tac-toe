const ticTacToeGame = (function(){
    let gameBoard = [null, null, null,
                     null, null, null,
                     null, null, null]
    
    let currentMarker = 'O'
        
    const display = (function(){

        function fillBox(boxNumber){
            const XorO = document.createElement('span')
            XorO.textContent = currentMarker
            XorO.setAttribute('style', `font-size: 80px`)
            const box = document.querySelector(`[data-number="${boxNumber}"]`)
            box.append(XorO)
        }

        function initializeBoardDOM(){
            const board = document.getElementById('board')
            while (board.firstChild) { //empty the board div from boxes
                board.removeChild(board.firstChild);
            }
            board.setAttribute('style', `   background: white;
                                            display: grid;
                                            grid-gap: 1px;
                                            grid-template-columns: repeat(3, 1fr);
                                            grid-template-rows: repeat(3, 1fr);
                                            height: 50vh;
                                            width: 50vh`)
                                        
            for(let i=0; i<=8; i++){
                setTimeout(()=>{
                    const box = document.createElement('div')
                    box.dataset.number = i
                    box.addEventListener('click', boxClickEvent, { once: true })
                    box.classList.add('customHover');
                    box.setAttribute('style', ` background: #e6e6ff; 
                                                border: 1px solid black; 
                                                animation: 1s linear fadein;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;`)
                    board.appendChild(box)
                }, 70 + (i*20))
            }
        }

        function initializeRestartBtn(){
            const restartBtn = document.getElementById('restartBtn')
            restartBtn.addEventListener('click', logic.restartGame)
            restartBtn.textContent = 'RESTART'
            restartBtn.classList.add('customHover');
            restartBtn.setAttribute('style', `  background-color: #ffc2f8  ; 
                                                border: 1px solid black; 
                                                border-radius: 4px;
                                                animation: 1s linear fadein; 
                                                height: 50px; width: 150px;
                                                margin-top: 50px`)
        }

        function boxClickEvent (e) {
            logic.boxClicked(e.target.dataset.number) 
        }

        function updatePrompt (string){
            const prompt = document.getElementById('prompt')
            prompt.setAttribute('style', `animation: 1s linear fadein;`)
            prompt.textContent = string
        }

        function win(){
            updatePrompt(`${ currentMarker == 'O' ? 'X' : 'O'} WINS!`)

            const boxes = document.querySelectorAll(`[data-number]`)
            boxes.forEach(box => {
                    box.removeEventListener('click',boxClickEvent);
            })
        }

        function tie(){
            updatePrompt(`It's a TIE!`)
        }

        function initializeChooseOpponentModal(){
            const chooseOpponentModal = document.getElementById('chooseOpponentModal')

            const chooseDiv = document.createElement('div')
            chooseDiv.setAttribute('style', `   align-items: center;
                                                display: flex;
                                                flex-direction: column;
                                                justify-content: space-evenly;
                                                height: 300px;`)

            const pvp = document.createElement('button')
            const pvc = document.createElement('button')
            pvp.textContent = "Player vs Player"
            pvc.textContent = "Player vs COM (Coming soon)"
            
            pvp.classList.add('customHover');
            pvp.setAttribute('style', ` display: flex;
                                        font-size: larger;
                                        align-items: center;
                                        justify-content: center;
                                        background: #e6e6ff; 
                                        border: 1px solid black; 
                                        animation: 1s linear fadein;
                                        height: 60px;
                                        width: 200px;`)

            pvc.classList.add('customHover');
            pvc.setAttribute('style', ` display: flex;
                                        font-size: larger;
                                        align-items: center;
                                        justify-content: center;
                                        background: #95a8e4; 
                                        border: 1px solid black;
                                        animation: 1s linear fadein;
                                        height: 60px;
                                        width: 200px;`)

            pvp.addEventListener('click',onChooseOpponent)
            pvc.addEventListener('click',onChooseOpponent)
            pvc.disabled = true
            chooseDiv.appendChild(pvp)
            chooseDiv.appendChild(pvc)

            chooseOpponentModal.appendChild(chooseDiv)

            function onChooseOpponent(){
                logic.startGame()
                setTimeout(()=>{
                    chooseOpponentModal.style.visibility = "hidden";
                },200)
            }
        }

        function openChooseOpponentModal(){
            const chooseOpponentModal = document.getElementById('chooseOpponentModal')
            chooseOpponentModal.style.visibility = "visible";
        }
        return { initializeBoardDOM, initializeChooseOpponentModal, initializeRestartBtn, openChooseOpponentModal   , fillBox, updatePrompt, win, tie }
    })()

    const logic = (function(){

        function startGame(){
            gameBoard = [null, null, null,
                null, null, null,
                null, null, null]
            display.initializeBoardDOM()
            display.initializeRestartBtn()
            display.updatePrompt(`${currentMarker}'s move`)
        }

        function restartGame(){
            display.openChooseOpponentModal()
        }

        function boxClicked(boxNumber){
            gameBoard[boxNumber] = currentMarker
            display.fillBox(boxNumber)

            if(currentMarker == 'O'){
                currentMarker = 'X'
            } else {
                currentMarker = 'O'
            }
            display.updatePrompt(`${currentMarker}'s move`)

            checkIfWin()
        }

        function checkIfWin(){
            const winningCombination = [
                [0,1,2], [3,4,5], [6,7,8],
                [0,3,6], [1,4,7], [2,5,8],
                [0,4,8], [2,4,6]
            ]

            function checkIsTie(){
                const gameBoardHasNull = gameBoard.some(item =>{
                    return item == null
                })

                if(!gameBoardHasNull){
                    display.tie()
                }
            }

            let checkForTie = true

            winningCombination.forEach((arr)=>{
                if( gameBoard[arr[0]]  // if bukan null dan semua sama
                    && (gameBoard[arr[0]] == gameBoard[arr[1]])
                    && (gameBoard[arr[1]] == gameBoard[arr[2]])){
                    display.win()
                    checkForTie = false
                }
            })
            
            if(checkForTie){
                checkIsTie()
            }
        }

        return { startGame, restartGame, boxClicked }

    })()

    function start (){
        console.log("game is starting");
        display.initializeChooseOpponentModal()
        display.openChooseOpponentModal()
    }

    return { start }
})()


ticTacToeGame.start()