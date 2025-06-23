class Main {
    constructor(){
        this.files = []
        this.folders = []

        this.inputList = document.querySelectorAll('.js_input_files')
        this.filesContainer = document.querySelector('.js_files_container')
        this.text = document.querySelector('.js_provisory_text')
        this.folderBtn = document.querySelector('.js_create_folder')
        this.renameBtn = document.querySelector('.js_rename_file')

        this.isRenaming = false;
        this.renameIndex = -1;
        this.renameItems = [];

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

        this.renameBtn.addEventListener('click', function(e){
            e.preventDefault()
            self.isRenaming = true;
            self.renameItems = Array.from(document.querySelectorAll('.file_item, .folder-header'));
            self.renameIndex = 0;
            alert('Utilisez les flèches pour sélectionner. Appuyez sur Entrée pour renommer.');
            self.updateRenameHighlight();
            
        })

        //KEY INPUT

        document.addEventListener('keydown', (e) => {
            if (!this.isRenaming || this.renameItems.length === 0) return;

            if (e.key === 's' || e.key === 'd') {
                this.renameIndex = (this.renameIndex + 1) % this.renameItems.length;
                this.updateRenameHighlight();
                console.log(this.renameIndex)
            }

            if (e.key === 'w' || e.key === 'a') {
                this.renameIndex = (this.renameIndex - 1 + this.renameItems.length) % this.renameItems.length;
                this.updateRenameHighlight();
                console.log(this.renameIndex)
            }

            if (e.key === 'Enter') {
                const current = this.renameItems[this.renameIndex];
                let oldName = current.textContent.trim().replace(/^📁 /, '');
                const newName = prompt("Nouveau nom :", oldName);
                if (newName) {
                    if (current.classList.contains('folder-header')) {
                        current.innerHTML = `<strong>📁 ${newName}</strong>`;
                    } else {
                        current.textContent = newName;
                    }
                }
                this.isRenaming = false;
                this.renameItems = [];
                this.renameIndex = -1;
                this.updateRenameHighlight();
            }

            if (e.key === 'Escape') {
                this.isRenaming = false;
                this.renameItems = [];
                this.renameIndex = -1;
                this.updateRenameHighlight();
                console.log('Renommage annulé');
            }
        });

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
        dossier.innerHTML = `<div class="js_folder_header"><strong>📁 ${folderName}</strong></div><ul class="folder-contents"></ul>`
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

        let folderCollapse = document.querySelector('.js_folder_header')
        folderCollapse.addEventListener('click', function(){
            folderContent.classList.toggle('collapsed')
            console.log('collapsed')
        })

        console.log('Folder created:', folderName)
        //console.log(folderContent)
    }

    updateRenameHighlight(){
        console.log('allo')
        this.renameItems.forEach((item, index)=>{
            item.classList.toggle('selected', index === this.renameIndex)
        })

        
    }

}

new Main()