const ticTacToeGame = (function(){
    let gameBoard = [null, null, null,
                     null, null, null,
                     null, null, null]
    
    let currentMarker = 'O'

    const display = (function(){
        function startScreen(){
            updateBoardDisplay()
        }
        function fillBox(marker,boxNumber){
            updateBoardDisplay(marker,boxNumber)
        }
        function updateBoardDisplay(marker=null, boxNumber=null){
            if(boxNumber){
                //update dom 1 box aja
            } else {
                //kosongin isi semua box di dom
            }
        }
        function initializeBoardDOM(){
            //init semua base html buat boardnya dan h1 prompt nya
        }
        function win(marker){
            //update h1 prompt jadi    `${marker} wins!`
            //hilangin semua event listener di dom
            //munculin tombol reset , event logic.startGame <--satu-satunya listener
        }
        function tie(){
            //update h1 prompt jadi    `It's a tie!`
            //hilangin semua event listener di dom
            //munculin tombol reset , event logic.startGame <--satu-satunya listener
        }

        return { startScreen, fillBox, win, tie, initializeBoardDOM }
    })()

    const logic = (function(){
        function startGame(){
            gameBoard = [null, null, null,
                null, null, null,
                null, null, null]
            display.startScreen()
        }

        function boxClicked(boxNumber){
            if(!gameBoard[boxNumber]){ //if box is null

                gameBoard[boxNumber] = currentMarker
                display.fillBox(currentMarker,boxNumber)

                if(currentMarker == 'O'){
                    currentMarker = 'X'
                } else {
                    currentMarker = 'O'
                }

                checkIfWin()
            }
        }

        function checkIfWin(){
            const winningCombination = [
                [0,1,2], [3,4,5], [6,7,8],
                [0,3,6], [1,4,7], [2,5,8],
                [0,4,8], [2,4,6]
            ]

            function checkIsTie(){
                if(/*gameBoard isinya semua tidak null*/gameBoard[0]){
                    display.tie()
                }
            }

            winningCombination.forEach((arr)=>{
                if(gameBoard[arr[0]] && (gameBoard[arr[0]]==gameBoard[arr[1]]==gameBoard[arr[2]])){ // if bukan null dan semua sama
                    display.win()
                    return //jangan checkIsTie
                }
            })
            checkIsTie()
        }

        return { startGame, boxClicked }

    })()

    return { start: () => { console.log("game is starting"); display.initializeBoardDOM(); logic.startGame() } }
})()


ticTacToeGame.start()