class Main {
    constructor(){
        this.files = []
        this.folders = []

        this.inputList = document.querySelectorAll('.js_input_files')
        this.filesContainer = document.querySelector('.js_files_container')
        this.text = document.querySelector('.js_provisory_text')
        this.folderBtn = document.querySelector('.js_create_folder')
        
        console.log(this.folderBtn)

        this.init()
    }

    init(){
       let self = this;
        this.inputList.forEach(function(input) {
            input.addEventListener('change', function(e) {
                self.onFileChange(e.target.files);
            })
        })

        this.folderBtn.addEventListener('click', function(e){
            e.preventDefault()
            self.createFolder()
        })
    }

    onFileChange(fileList){
        this.files = Array.prototype.slice.call(fileList);

        console.log(this.files); 
        this.displayFiles();
    }

    displayFiles(){
        console.log(this.inputList)
        if (!this.inputList){
            this.filesContainer.innerHTML = ''
        }

        for (let i = 0; i < this.files.length; i++) {
            let file = this.files[i]
            this.text.classList.add('none')
            let li = document.createElement('li')
            li.setAttribute('draggable', true)
            li.classList.add('file_item')
            li.dataset.filename = file.name
            //let img = document.createElement('img')
            li.textContent = file.webkitRelativePath || file.name
            this.filesContainer.appendChild(li)

            li.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text/plain', e.target.dataset.filename);
            });
        }
    }

    //Création de dossiers
    createFolder() {
        let folderName = prompt("Nom du dossier ?")
        let dossier = document.createElement('li')

        if (!folderName) return;

        if (this.text && !this.text.classList.contains('none')) {
            this.text.classList.add('none')
        }

        dossier.classList.add('folder')
        dossier.innerHTML = `<strong>📁 ${folderName}</strong><ul class="folder-contents"></ul>`
        this.filesContainer.appendChild(dossier)

        let folderContent = dossier.querySelector('.folder-contents')

        folderContent.addEventListener('dragover', function(e){
            e.preventDefault()
        })

        folderContent.addEventListener('drop', function(e){
            e.preventDefault()

            let filename = e.dataTransfer.getData('text/plain')

            let fileEl = document.querySelector('.file_item[data-filename="' + filename + '"]')
            if (fileEl) {
                folderContent.appendChild(fileEl)
                console.log(folderContent)
            }
        })

        console.log('Folder created:', folderName)
        //console.log(folderContent)
    }

}

new Main()