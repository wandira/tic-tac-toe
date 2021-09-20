const ticTacToeGame = (function(){
    let gameBoard = [null, null, null,
                     null, null, null,
                     null, null, null]

    let players = []

    let currentPlayer = null

    let currentMarker = currentPlayer?.getMarker() || 'F'

    let hasWinner = false

    let isTie = false
        
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
            if(!currentPlayer.getIsCom()){
                logic.boxClicked(e.target.dataset.number) 
            } else {
                const box = document.querySelector(`[data-number="${e.target.dataset.number}"]`)
                box.addEventListener('click', boxClickEvent, { once: true }) //reattach event
            }
        }

        function updatePrompt (string){
            const prompt = document.getElementById('prompt')
            prompt.setAttribute('style', `animation: 1s linear fadein;`)
            prompt.textContent = string
        }

        function win(){
            function getWinnerName(){ // get previous player, not current player
                if(currentPlayer.getMarker() == players[0].getMarker()){
                    return players[1].getName()
                }
                else{
                    return players[0].getName()
                }
            }

            updatePrompt(`${getWinnerName()} WINS!`)

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
            pvc.textContent = "Player vs COM"
            
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

            pvp.addEventListener('click',playerVsPlayer)
            pvc.addEventListener('click',playerVsCom)

            chooseDiv.appendChild(pvp)
            chooseDiv.appendChild(pvc)

            chooseOpponentModal.appendChild(chooseDiv)

            function playerVsPlayer(){
                logic.startVersusPlayer()
                setTimeout(()=>{
                    chooseOpponentModal.style.visibility = "hidden";
                },200)
            }

            function playerVsCom(){
                logic.startVersusCom()
                setTimeout(()=>{
                    chooseOpponentModal.style.visibility = "hidden";
                },200)
            }
        }

        function openChooseOpponentModal(){
            const chooseOpponentModal = document.getElementById('chooseOpponentModal')
            chooseOpponentModal.style.visibility = "visible";
        }
        return { initializeBoardDOM, initializeChooseOpponentModal, initializeRestartBtn, openChooseOpponentModal, fillBox, updatePrompt, win, tie }
    })()

    const logic = (function(){

        function restartGame(){
            isTie = false
            hasWinner = false
            display.openChooseOpponentModal()
        }

        function boxClicked(boxNumber){
            currentMarker = currentPlayer.getMarker()

            gameBoard[boxNumber] = currentMarker
            display.fillBox(boxNumber)

            if(currentPlayer.getMarker == players[0].getMarker){
                currentPlayer = players[1]
            } else {
                currentPlayer = players[0]
            }

            display.updatePrompt(`${currentPlayer.getName()}'s move`)

            checkIfWin()

            computerWillMakeMoveIfAllowed()
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
                    isTie = true
                    display.tie()
                }
            }

            let checkForTie = true

            winningCombination.forEach((arr)=>{
                if( gameBoard[arr[0]]  // if bukan null dan semua sama
                    && (gameBoard[arr[0]] == gameBoard[arr[1]])
                    && (gameBoard[arr[1]] == gameBoard[arr[2]])){
                    hasWinner = true
                    display.win()
                    checkForTie = false
                }
            })
            
            if(checkForTie){
                checkIsTie()
            }
        }

        function startGame(){
            gameBoard = [null, null, null,
                null, null, null,
                null, null, null]
            display.initializeBoardDOM()
            display.initializeRestartBtn()
            display.updatePrompt(`${currentPlayer.getName()}'s move`)
        }

        function startVersusPlayer(){
            players[0] = PlayerFactory("Player 1",false,'O')
            players[1] = PlayerFactory("Player 2",false,'X')

            currentPlayer = players[0]

            startGame()
        }

        function startVersusCom(){
            //add randomizer index here later
            players[0] = PlayerFactory("Player",false,'O')
            players[1] = PlayerFactory("COM",true,'X')

            currentPlayer = players[0]

            startGame()
            computerWillMakeMoveIfAllowed()
        }

        function computerWillMakeMoveIfAllowed(){
            if(!hasWinner && !isTie && currentPlayer.getIsCom()){
                let boxNumber
                do {
                    boxNumber = Math.floor(Math.random() * 9);
                } while (gameBoard[boxNumber]); // while true => boxnya udah ada isinya

                setTimeout(()=>{
                    boxClicked(boxNumber)
                },1000)
            }
        }

        return { restartGame, boxClicked, startVersusPlayer, startVersusCom }

    })()

    function PlayerFactory(name,isCom,marker){
        function getName(){ return name }
        function getIsCom(){ return isCom }
        function getMarker(){ return marker }
        return { getName, getIsCom, getMarker }
    }

    function start (){
        console.log("game is starting");
        display.initializeChooseOpponentModal()
        display.openChooseOpponentModal()
    }

    return { start }
})()


ticTacToeGame.start()